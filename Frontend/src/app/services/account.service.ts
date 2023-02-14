import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, finalize } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { Account } from '@app/models';

const accountsUrl = `${environment.apiUrl}/accounts`;
const authUrl = `${environment.apiUrl}/auth`;

@Injectable({ providedIn: 'root' })
export class AccountService {
    private accountSubject: BehaviorSubject<Account>;
    public account: Observable<Account>;

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this.accountSubject = new BehaviorSubject<Account>(null);
        this.account = this.accountSubject.asObservable();
    }

    public get accountValue(): Account {
        return this.accountSubject.value;
    }

    login(email: string, password: string) {
        return this.http.post<any>(`${authUrl}/login`, { email, password }, { withCredentials: true })
            .pipe(map(account => {
                this.accountSubject.next(account);
                this.startRefreshTokenTimer();
                return account;
            }));
    }

    logout() {
        let jwtToken = this.accountValue.jwtToken;
        this.http.post<any>(`${authUrl}/revoke-token`, {}, { withCredentials: true }).subscribe();
        this.stopRefreshTokenTimer();
        this.accountSubject.next(null);
        this.router.navigate(['/account/login']);
    }

    refreshToken() {
        return this.http.post<any>(`${authUrl}/refresh-token`, {}, { withCredentials: true })
            .pipe(map((account) => {
                this.accountSubject.next(account);
                this.startRefreshTokenTimer();
                return account;
            }));
    }

    register(account: Account) {
        return this.http.post(`${authUrl}/register`, account);
    }

    verifyEmail(token: string, accountId: string) {
        return this.http.post(`${authUrl}/verify-email`, { token, accountId });
    }
    
    forgotPassword(email: string) {
        return this.http.post(`${authUrl}/forgot-password`, { email });
    }
    
    validateResetToken(accountId: string, token: string) {
        return this.http.post(`${authUrl}/validate-reset-token`, { accountId, token });
    }
    
    resetPassword(accountId: string, token: string, password: string, confirmPassword: string) {
        return this.http.post(`${authUrl}/reset-password`, { accountId, token, password, confirmPassword });
    }

    changePassword(password: string) {
        return this.http.post(`${authUrl}/change-password`, { password });
    }

    getAll() {
        return this.http.get<Account[]>(accountsUrl);
    }

    getById(id: string) {
        return this.http.get<Account>(`${accountsUrl}/${id}`);
    }
    
    create(params) {
        return this.http.post(accountsUrl, params);
    }
    
    updateByAdmin(id, params) {
        return this.http.put(`${accountsUrl}/${id}`, params)
            .pipe(map((account: any) => {
                if (account.id === this.accountValue.id) {
                    account = { ...this.accountValue, ...account };
                    this.accountSubject.next(account);
                }
                return account;
            }));
    }

    update(id, params) {
        return this.http.patch(`${accountsUrl}/${id}`, params)
            .pipe(map((account: any) => {
                if (account.id === this.accountValue.id) {
                    account = { ...this.accountValue, ...account };
                    this.accountSubject.next(account);
                }
                return account;
            }));
    }
    
    delete(id: string) {
        return this.http.delete(`${accountsUrl}/${id}`)
            .pipe(finalize(() => {
                if (id === this.accountValue.id)
                    this.logout();
            }));
    }

    private refreshTokenTimeout;

    private startRefreshTokenTimer() {
        const jwtToken = JSON.parse(atob(this.accountValue.jwtToken.split('.')[1]));

        const expires = new Date(jwtToken.exp * 1000);
        const timeout = expires.getTime() - Date.now() - (60 * 1000);
        this.refreshTokenTimeout = setTimeout(() => this.refreshToken().subscribe(), timeout);
    }

    private stopRefreshTokenTimer() {
        clearTimeout(this.refreshTokenTimeout);
    }
}