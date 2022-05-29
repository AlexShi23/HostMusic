import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';
import { Track } from '@app/_models';

const baseUrl = `${environment.apiUrl}/releases`;

@Injectable({ providedIn: 'root' })
export class TrackService {
    
}