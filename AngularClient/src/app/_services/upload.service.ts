import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {Upload} from 'tus-js-client';

export interface FileStatus {
	filename: string;
	hash: string;
	uuid: string;
}

@Injectable({
  	providedIn: 'root'
})

export class UploadService {

	private uploadStatus = new Subject<FileStatus[]>();
	uploadProgress = this.uploadStatus.asObservable();

	fileStatusArr: FileStatus[] = [];

	uploadFile(file: File, filename: string) {
		const fileStatus: FileStatus = {filename, hash: '', uuid: ''};
		this.fileStatusArr.push(fileStatus);

		this.uploadStatus.next(this.fileStatusArr);

		const upload = new Upload(file, {
			endpoint: "https://localhost:7283/upload",
			retryDelays: [0, 3000, 6000, 12000, 24000],
			chunkSize: 5 * 1024 * 1024,
			metadata: {
				filename,
				filetype: file.type
			},
			onError: async (error) => {
				console.log(error);
				this.uploadStatus.complete();
				return false;
			},
			onChunkComplete: (chunkSize, bytesAccepted, bytesTotal) => {
				this.fileStatusArr.forEach(value => {
				if (value.filename === filename) {
					value.uuid = upload.url.split('/').slice(-1)[0];
				}
				});
				this.uploadStatus.next(this.fileStatusArr);
			},
			onSuccess: async () => {
				this.uploadStatus.next(this.fileStatusArr);
				this.uploadStatus.complete();
				return true;
			}
		});
		upload.start();
	}
}