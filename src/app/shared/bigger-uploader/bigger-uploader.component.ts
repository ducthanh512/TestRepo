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
import { MatTableDataSource } from '@angular/material/table';

import { SelectionModel } from '@angular/cdk/collections';


@Component({
  selector: 'app-bigger-uploader',
  templateUrl: './bigger-uploader.component.html',
  styleUrl: './bigger-uploader.component.css',
})
export class BiggerUploaderComponent implements OnInit {
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

  displayedColumns: string[] = ['fileName', 'select', 'actions'];
  dataSource = new MatTableDataSource<FileUpload>(this.multipleFiles);
  selection = new SelectionModel<FileUpload>(true, []);

  ngOnInit(): void {}

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: FileUpload): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.position! + 1
    }`;
  }

  onFileSelected(event: any) {
    if (event.target.files) {
      for (let i = 0; i < event.target.files.length; i++) {
        const file = event.target.files[i];
        const fileUpload: FileUpload = {
          file: file,
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          sentitive:false,
          position: i + 1,
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
        this.dataSource.connect().next(this.multipleFiles);
        this.sendSelectedFiles.emit({
          filesUpload: this.multipleFiles,
          category: this.category,
        });
      }
    }
  }

  removeFile(event: FileUpload) {
    console.log(this.multipleFiles);
    var index = this.multipleFiles.findIndex(x=>x.fileName === event.fileName);
    this.multipleFiles.splice(index, 1);
    this.multipleFiles.forEach((file) => (file.category = this.category));
    this.dataSource.connect().next(this.multipleFiles);
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
      this.dataSource.connect().next(this.multipleFiles);
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

  getRecord(event: any) {
    console.log(event);
  }

  onFolderSelected(event: any) {
    console.log(event);
    if (event.target.files.length > 0) {
      let files = event.target.files;
    }
  }

  TonggleSensitive(row: FileUpload){

    var index = this.multipleFiles.findIndex(x =>x.fileName == row.fileName);
    if(index > -1)
    this.multipleFiles[index].sentitive =  !this.multipleFiles[index].sentitive;
    this.dataSource.connect().next(this.multipleFiles);
    this.sendSelectedFiles.emit({
      filesUpload: this.multipleFiles,
      category: this.category,
    });
    
  }
}
