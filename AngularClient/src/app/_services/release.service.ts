import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, finalize } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { Release } from '@app/_models';

const baseUrl = `${environment.releasesUrl}/releases`;

@Injectable({ providedIn: 'root' })
export class ReleaseService {
    private releaseSubject: BehaviorSubject<Release>;
    public release: Observable<Release>;

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this.releaseSubject = new BehaviorSubject<Release>(null);
        this.release = this.releaseSubject.asObservable();
    }

    public get releaseValue(): Release {
        return this.releaseSubject.value;
    }

    getAll() {
        return this.http.get<Release[]>(baseUrl);
    }

    getById(id: string) {
        return this.http.get<Release>(`${baseUrl}/${id}`);
    }
    
    create(params) {
        return this.http.post(baseUrl, params);
    }
    
    update(id, params) {
        return this.http.put(`${baseUrl}/${id}`, params);
    }
    
    delete(id: string) {
        return this.http.delete(`${baseUrl}/${id}`);
    }
}