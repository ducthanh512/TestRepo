import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { Upload } from 'tus-js-client';
import { environment } from '../../../environments/environment';

export interface FileStatus {
  filename: string;
  progress: number;
  hash: string;
  uuid: string;
}

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  constructor() {}

  private uploadStatus = new Subject<FileStatus[]>();
  uploadProgress = this.uploadStatus.asObservable();

  fileStatusArr: FileStatus[] = [];

  // getCharacters(): Observable<any> {
  //   return this.http.get(environment.characterBaseUrl);
  // }
  //public testUrl = environment.uploadServiceUrl;
  uploadFile(file: File, filename: string) {
    const fileStatus: FileStatus = {
      filename,
      progress: 0,
      hash: '',
      uuid: '',
    };
    this.fileStatusArr.push(fileStatus);

    this.uploadStatus.next(this.fileStatusArr);
    console.log(this.fileStatusArr);
    const upload = new Upload(file, {
      endpoint: 'https://master.tus.io/files/',
      retryDelays: [0, 3000, 6000, 12000, 24000],
      chunkSize: 20000,
      metadata: {
        filename,
        filetype: file.type,
      },
      onError: async (error) => {
        console.log(error);
        return false;
      },
      onChunkComplete: (chunkSize, bytesAccepted, bytesTotal) => {
        this.fileStatusArr.forEach((value) => {
          if (value.filename === filename) {
            value.progress = Math.floor((bytesAccepted / bytesTotal) * 100);
            value.uuid = upload.url!.split('/').slice(-1)[0];
          }
        });
        this.uploadStatus.next(this.fileStatusArr);
      },
      onSuccess: async () => {
        this.fileStatusArr.forEach((value) => {
          if (value.filename === filename) {
            value.progress = 100;
          }
        });
        this.uploadStatus.next(this.fileStatusArr);
        return true;
      },
    });
    upload.start();
  }
}
