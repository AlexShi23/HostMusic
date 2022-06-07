import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';
import { Release, Track } from '@app/_models';
import { BehaviorSubject, Observable } from 'rxjs';

const baseUrl = `${environment.apiUrl}/tracks`;

@Injectable({ providedIn: 'root' })
export class TrackService {
    private trackSubject: BehaviorSubject<Track>;
    public track: Observable<Track>;

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this.trackSubject = new BehaviorSubject<Track>(null);
        this.track = this.trackSubject.asObservable();
    }

    public get trackValue(): Track {
        return this.trackSubject.value;
    }

    getAll() {
        return this.http.get<Track[]>(baseUrl);
    }

    getById(id: string) {
        return this.http.get<Track>(`${baseUrl}/${id}`);
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