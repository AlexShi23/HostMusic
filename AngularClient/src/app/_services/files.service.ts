import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FileType } from "@app/_models";
import { environment } from "@environments/environment";
import { Observable } from "rxjs";

const baseUrl = `${environment.releasesUrl}/files`;

@Injectable({
    providedIn: 'root'
})
export class FilesService {
    constructor(
        private http: HttpClient
    ) {}

    getFileUrl(id: string, fileType: FileType, compressed: boolean): Observable<string> {
        return this.http.get(`${baseUrl}/url/get?FileId=${id}&FileType=${fileType}&Compressed=${compressed}`, {responseType: 'text'});
    }

    uploadFile(id: string, file: File, fileType: FileType) {
        const request = new FormData();
        request.append('fileId', id);
        request.append('fileType', fileType.toString());
        request.append('fileData', file);

        return this.http.post(baseUrl, request);
    }

    deleteFile(id: string, fileType: FileType): Observable<any> {
        return this.http.delete(`${baseUrl}?FileId=${id}&FileType=${fileType}`);
    }

    getPreSignedUrl(id: string, fileType: FileType, compressed: boolean): Observable<string> {
        return this.http.get(`${baseUrl}/url/upload?FileId=${id}&FileType=${fileType}&Compressed=${compressed}`, {responseType: 'text'});
    }

    uploadFileToPreSignedUrl(url: string, file: File): Observable<any> {
        var options = { headers: { 'Content-Type': file.type, 'ACL': 'public-read' } };
        return this.http.put(url, file, options);
    }
}