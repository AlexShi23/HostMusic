import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { FileType } from "@app/_models";
import { environment } from "@environments/environment";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

const baseUrl = `${environment.releasesUrl}/files`;

@Injectable({
    providedIn: 'root'
})
export class FilesService {
    constructor(
        private http: HttpClient,
        private sanitizer: DomSanitizer
    ) {}

    uploadFile(id: string, file: File, fileType: FileType) {
        const request = new FormData();
        request.append('fileId', id);
        request.append('fileType', fileType.toString());
        request.append('fileData', file);

        return this.http.post(baseUrl, request);
    }

    getFile(id: string, fileType: FileType, compressed: boolean): Observable<any> {
        return this.http.get(`${baseUrl}?FileId=${id}&FileType=${fileType}&Compressed=${compressed}`, {responseType: 'blob'});
    }

    getFileUrl(id: string, fileType: FileType, compressed: boolean) : Observable<SafeUrl>{
        return this.getFile(id, fileType, compressed).pipe(
            map((blob: Blob) => {
                let objectURL = URL.createObjectURL(blob);
                return this.sanitizer.bypassSecurityTrustUrl(objectURL);
            })
        )
    }

    deleteFile(id: string, fileType: FileType): Observable<any> {
        return this.http.delete(`${baseUrl}?FileId=${id}&FileType=${fileType}`);
    }

    getPreSignedUrl(id: string, fileType: FileType, compressed: boolean): Observable<string> {
        return this.http.get(`${baseUrl}/url?FileId=${id}&FileType=${fileType}&Compressed=${compressed}`, {responseType: 'text'});
    }

    uploadFileToPreSignedUrl(url: string, file: File): Observable<any> {
        var options = { headers: { 'Content-Type': file.type, 'ACL': 'public-read' } };
        return this.http.put(url, file, options);
    }
}