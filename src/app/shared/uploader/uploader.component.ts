import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FileUpload,
  FileUploadsByCategory,
} from '../../_model/file-upload.model';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import {
  FileStatus,
  UploadServiceService,
} from '../../services/uploader-service.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogContentComponent } from '../dialog-content/dialog-content.component';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.component.html',
  styleUrl: './uploader.component.css',
})
export class UploaderComponent implements OnInit {
  @Input() category = '';
  @Output() sendSelectedFiles = new EventEmitter<FileUploadsByCategory>();

  constructor(
    private sanitizer: DomSanitizer,
    private uploadService: UploadServiceService,
    public dialog: MatDialog
  ) {}

  multipleFiles: FileUpload[] = [];
  duplicatedFiles: FileUpload[] = [];
  uploadProgress: Observable<FileStatus[]> | undefined;
  filenames: string[] = [];
  ngOnInit(): void {}

  onFileSelected(event: any) {
    if (event.target.files) {
      for (let i = 0; i < event.target.files.length; i++) {
        const file = event.target.files[i];
        const fileUpload: FileUpload = {
          file: file,
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          url: this.sanitizer.bypassSecurityTrustUrl(
            window.URL.createObjectURL(file)
          ),
        };
        if (!this.checkDuplicatedFile(this.multipleFiles, fileUpload)) {
          this.multipleFiles.push(fileUpload);
        } else {
          this.duplicatedFiles.push(fileUpload);
        }
      }
      if (this.duplicatedFiles.length > 0) {
        this.openDialog(this.duplicatedFiles);
        this.duplicatedFiles = [];
      }
      if (this.multipleFiles.length > 0) {
        this.multipleFiles.forEach((file) => (file.category = this.category));
        this.sendSelectedFiles.emit({
          filesUpload: this.multipleFiles,
          category: this.category,
        });
      }
    }
  }

  removeFile(i: number) {
    this.multipleFiles.forEach((item, index) => {
      if (i > -1 && i === index) this.multipleFiles.splice(index, 1);
    });

    this.multipleFiles.forEach((file) => (file.category = this.category));
    this.sendSelectedFiles.emit({
      filesUpload: this.multipleFiles,
      category: this.category,
    });
  }

  fileDropped(multipleFiles: FileUpload[] | any) {
    multipleFiles.forEach((fileUpload: any) => {
      if (!this.checkDuplicatedFile(this.multipleFiles, fileUpload)) {
        this.multipleFiles.push(fileUpload);
      } else {
        this.duplicatedFiles.push(fileUpload);
      }
    });
    if (this.duplicatedFiles.length > 0) {
      this.openDialog(this.duplicatedFiles);
      this.duplicatedFiles = [];
    }
    if (this.multipleFiles.length > 0) {
      this.multipleFiles.forEach((file) => (file.category = this.category));
      this.sendSelectedFiles.emit({
        filesUpload: this.multipleFiles,
        category: this.category,
      });
    }
  }

  openDialog(duplicatedFiles: FileUpload[]) {
    this.dialog.open(DialogContentComponent, {
      data: {
        duplicatedFiles,
      },
    });
  }

  checkDuplicatedFile = (
    multipleFiles: FileUpload[],
    fileUpload: FileUpload
  ): boolean => {
    let flag: boolean = false;
    multipleFiles.forEach((file) => {
      if (
        file.fileName === fileUpload.fileName &&
        file.fileSize === fileUpload.fileSize &&
        file.fileType === fileUpload.fileType
      )
        flag = true;
    });
    return flag;
  };
}
