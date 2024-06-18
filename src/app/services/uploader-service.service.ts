import { Injectable, inject } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { Upload } from 'tus-js-client';
import { FileUpload, FileUploadsByCategory } from '../_model/file-upload.model';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { files, categoryList, FileNode, TreeNode } from './example-data';
import { MatterNewChange } from '../_model/matter-new-change';
import {  MatterActionResult } from '../_model/IActionResult';
import { CustomConfiguration } from '../_model/custom-configuration';

export interface FileStatus {
  id: number;
  filename: string;
  progress: number;
  hash: string;
  uuid: string;
  category?: string;
}

@Injectable({
  providedIn: 'root',
})
export class UploadServiceService {
  constructor(private http: HttpClient) {}
  //http = inject(HttpClient);
  uploadStatus = new Subject<FileStatus[]>();
  uploadProgress = this.uploadStatus.asObservable();
  isCompleted: boolean = false;
  fileStatusArr: FileStatus[] = [];
  uploadedFiles!: string[];
  fileUploadsByCategories: FileUploadsByCategory[] = [];
  fileStatus = { status: '', requestType: '', progress: 0 };
  fileNames: string[] = [];
  matterNewChange?: MatterNewChange;
  defaultBriefType?:string ="HNumber";
  kickOffUpload: string = "";
  startingUpload: boolean = false;
  refNumber!: string;
  
  public setFileUploadsByCategories$ = Observable.create((observer: any) => {
    observer.next(this.fileUploadsByCategories);
  });

  public setKickOffUpload$ = Observable.create((observer: any) => {
    observer.next(this.kickOffUpload);
  });


  public fileUploadsByCategories$ = new Subject();
  public kickOffUpload$ = new Subject();

  updateTreeData() {
    var rootCatetory = new Array<FileNode>();
    rootCatetory.push({
      name: 'Categories',
      type: 'folder',
      children: [],
    });
    var currentCategoryChild = rootCatetory[0].children!;
    if (categoryList.length > 0) {
      categoryList.forEach((category, index) => {
        var currentFileUploadsByCategories = this.fileUploadsByCategories.find(
          (fileUploadsByCategory) => fileUploadsByCategory.category == category.name
        );
        currentCategoryChild.push({
          name: category.name,
          type: 'folder',
          children: [],
        });
        currentFileUploadsByCategories?.filesUpload.forEach((fileUpload) => {
          currentCategoryChild[index]!.children?.push({
            name: fileUpload.fileName!,
            type: 'file',
          });
        });
      });
    }
    return rootCatetory;
  }


  updateTabData() {
    if (categoryList.length > 0) {
      categoryList.forEach((category, index) => {
        var currentFileUploadsByCategories = this.fileUploadsByCategories.find(
          (fileUploadsByCategory) => fileUploadsByCategory.category == category.name
        );
        category.numOfFiles = currentFileUploadsByCategories?.filesUpload.length!;
      });
    }
    return categoryList;
  }


  getJsonDate() {
    var rootCatetory = new Array<FileNode>();
    rootCatetory.push({
      name: 'Categories',
      type: 'folder',
      children: [],
    });
    if (categoryList.length > 0) {
      categoryList.forEach((category, index) => {
        rootCatetory[0].children!.push({
          name: category.name,
          type: 'folder',
          children: [],
        });
      });
    }
    return rootCatetory;
  }

  uploadFile(file: File, id: number, filename: string, category: string) {
    const fileStatus: FileStatus = {
      id,
      filename,
      progress: 0,
      hash: '',
      uuid: '',
      category,
    };
    this.fileStatusArr.push(fileStatus);

    this.uploadStatus.next(this.fileStatusArr);
    const upload = new Upload(file, {
      endpoint: environment.baseEndpoint + 'files/',
      retryDelays: [0, 3000, 6000, 12000, 24000],
      chunkSize: 20000,
      metadata: {
        filename,
        filetype: file.type,
      },
      onError: (error) => {
        console.log(error);
        if (window.confirm(`Failed because: ${error}\nDo you want to retry?`)) {
          upload.start();
          return;
        }
        return false;
      },
      onChunkComplete: (chunkSize, bytesAccepted, bytesTotal) => {
        this.fileStatusArr.forEach((value) => {
          if (value.filename === filename) {
            value.progress = Math.floor((bytesAccepted / bytesTotal) * 100);
            console.log(value.progress);
            value.uuid = upload.url!.split('/').slice(-1)[0];
          }
        });
        this.uploadStatus.next(this.fileStatusArr);
      },
      onSuccess: async () => {
        console.log('sucess');
        this.fileStatusArr.forEach((value) => {
          if (value.filename === filename) {
            value.progress = 100;
            console.log(value.id);
          }
        });
        this.uploadStatus.next(this.fileStatusArr);

        const incompletedFiles = this.fileStatusArr.filter(
          (file) => file.progress !== 100
        );
        if (incompletedFiles.length === 0) {
          console.log('all done');
          this.isCompleted = true;
        }
        return true;
      },
    });

    upload.findPreviousUploads().then((previousUploads) => {
      this.askToResumeUpload(previousUploads, upload);
      console.log(previousUploads);
      upload.start();
    });
  }

  askToResumeUpload(previousUploads: any, currentUpload: Upload) {
    if (previousUploads.length === 0) return;

    let text = 'You tried to upload this file previously at these times:\n\n';
    previousUploads.forEach((previousUpload: any, index: number) => {
      text += `[${index}] ${previousUpload.creationTime}\n`;
    });
    text +=
      '\nEnter the corresponding number to resume an upload or press Cancel to start a new upload';

    const answer = prompt(text);
    const index = parseInt(answer!, 10);

    if (!Number.isNaN(index) && previousUploads[index]) {
      currentUpload.resumeFromPreviousUpload(previousUploads[index]);
    }
  }

  addFileUpload(fileUpload: FileUpload) {
    console.log('adding file');
    const addFileUpload: FileUpload = {
      fileName: fileUpload.fileName,
      fileSize: fileUpload.fileSize,
      fileType: fileUpload.fileType,
      batchId: fileUpload.batchId,
      createdTime: new Date(),
      createdUser: fileUpload.createdUser,
      sentitive: false,
      matterNumber: fileUpload.matterNumber,
      location: fileUpload.location,
      category: fileUpload.category,
      status: fileUpload.status,
    };

    this.http
      .post(environment.baseEndpoint + 'api/FileUploads', addFileUpload)
      .subscribe({
        next: (value: FileUpload) => {
          fileUpload.id = value.id;
          this.uploadFile(
            fileUpload.file!,
            fileUpload.id!,
            fileUpload.fileName!,
            fileUpload.category!
          );
        },
      });
  }

  uploadToDataLake(
    fileUpload: FileUpload,
    matterNewChange: MatterNewChange,
    defaultBriefType: string
  ): void {
    const fileStatus: FileStatus = {
      id: fileUpload.id!,
      filename: fileUpload.fileName!,
      progress: 0,
      hash: '',
      uuid: '',
      category: fileUpload.category,
    };
    this.fileStatusArr.push(fileStatus);

    this.uploadStatus.next(this.fileStatusArr);

    const form = new FormData();
    form.append(fileUpload.fileName!, fileUpload.file!);
    form.append('FileName', fileUpload.fileName!);
    form.append('FileType', fileUpload.fileType!);
    form.append('FileSize', fileUpload.fileSize!.toString());
    form.append('batchId', fileUpload.batchId!.toString());
    form.append('createdUser', fileUpload.createdUser!);
    form.append(
      'sensitive',
      fileUpload.sentitive == true ? 'sensitive' : 'normal'
    );
    form.append('matterNumber', fileUpload.matterNumber!);
    form.append('hNumber', matterNewChange.matterHREF!);
    form.append('location', matterNewChange.odppOffice!);
    form.append('category', fileUpload.category!);
    form.append('status', fileUpload.status!);
    form.append('briefType', fileUpload.briefType!);
    form.append(
      'DocumentType',
      defaultBriefType == 'HNumber' ? 'Matter' : 'Advisings'
    );
    form.append(
      'PracticeWithCarriageManagerHierarchyEmail',
      matterNewChange.practiceWithCarriageManagerHierarchyEmail!
    );

    this.http
      .post<string[]>(
        environment.baseEndpoint + 'api/Blob/uploadclient',
        form,
        {
          reportProgress: true,
          observe: 'events',
        }
      )
      .subscribe((event) => {
        console.log(event);
        this.reportProgress(event, fileUpload.fileName!);
      });
  }

  reportProgress(httpEvent: HttpEvent<string[]> | Blob, fileName: string) {
    switch (httpEvent.type) {
      case HttpEventType.UploadProgress:
        this.uploadDataLakeStatus(
          httpEvent.loaded,
          httpEvent.total!,
          'Uploading',
          fileName
        );
        break;
      case HttpEventType.DownloadProgress:
        this.uploadDataLakeStatus(
          httpEvent.loaded,
          httpEvent.total!,
          'Downloading',
          fileName
        );
        break;
      case HttpEventType.ResponseHeader:
        console.log('Header returned', httpEvent);
        break;
      case HttpEventType.Response:
        if (httpEvent.body instanceof Object) {
          this.fileStatusArr.forEach((value) => {
            if (value.filename === fileName && value.progress === 100) {
              value.progress = 100;
            }
          });

          const incompletedFiles = this.fileStatusArr.filter(
            (file) => file.progress !== 100
          );

          
          if (incompletedFiles.length === 0) {
            console.log('all done');
            this.isCompleted = true;
          }

          // httpEvent.body.forEach((fileName) => {
          //   this.fileNames.unshift(fileName);
          // });
        } else {
        }
        break;
      default:
        console.log(httpEvent);
        break;
    }
  }
  uploadDataLakeStatus(
    loaded: number,
    total: number,
    requestType: string,
    fileName: string
  ) {
    let percent = Math.round((100 * loaded) / total);
    console.log(percent + '% | ' + requestType);

    this.fileStatusArr.forEach((value) => {
      if (value.filename === fileName) {
        percent =
          isNaN(percent) || !isFinite(percent) ? value.progress : percent;
        value.progress = percent;
      }
    });
    this.uploadStatus.next(this.fileStatusArr);
  }

  getMatterNewChangeByMatterNumberAsync(
    matterNumber: string
  ): Observable<MatterActionResult> {
    var result= this.http.get<MatterActionResult>(
      environment.baseEndpoint +
        'api/MatterNewChanges/matternumber/' +
        matterNumber
    );
    return result;
  }

  getMatterNewChangeByHNumberAsync(
    hnumber: string
  ): Observable<MatterActionResult> {
    return this.http.get<MatterActionResult>(
      environment.baseEndpoint + 'api/MatterNewChanges/hnumber/' + hnumber
    );
  }

  getFileUploadLatestIdAsync(): Observable<number> {
    var result= this.http.get<number>(
      environment.baseEndpoint +
        'api/GetLatestId'
    );
    return result;
  }

  getCustomConfigurationAsync(
  ): Observable<CustomConfiguration> {
    var result= this.http.get<CustomConfiguration>(
      environment.baseEndpoint +
        'api/configuration'
    );
    return result;
  }

  setMatterNewChange(matterNewChange: MatterNewChange) {
    this.matterNewChange = matterNewChange;
  }
}
