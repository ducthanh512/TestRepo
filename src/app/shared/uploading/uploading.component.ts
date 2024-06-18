import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import {
  FileStatus,
  UploadServiceService,
} from '../../services/uploader-service.service';
import {
  FileUpload,
  FileUploadsByCategory,
} from '../../_model/file-upload.model';
//const fileInput = document.querySelector('#file') as FileList | any;
@Component({
  selector: 'app-uploading',
  templateUrl: './uploading.component.html',
  styleUrl: './uploading.component.css',
})
export class UploadingComponent implements OnInit {
  @Input() fileUploadsByCategory: FileUploadsByCategory = {
    category: '',
    filesUpload: [],
  };
  uploadProgress: Observable<FileStatus[]> | undefined;
  filenames: string[] = [];

  constructor(private uploadService: UploadServiceService) {}

  ngOnInit() {
    this.uploadProgress = this.uploadService.uploadProgress;
  }
}
