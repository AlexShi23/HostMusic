import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

import { environment } from '@environments/environment';
import { Release, ReleasesPage } from '@app/models';

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

    getAll(page: number) {
        return this.http.get<ReleasesPage>(`${baseUrl}/all/${page}`);
    }

    getAllOnModeration(page: number) {
        return this.http.get<ReleasesPage>(`${baseUrl}/moderation/${page}`);
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

    search(query: string, page: number) {
        return this.http.get(`${baseUrl}/search?query=${query}&page=${page}`);
    }

    moderate(id, params) {
        return this.http.patch(`${baseUrl}/${id}/moderate`, params);
    }
}