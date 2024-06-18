import { Component, HostListener, Inject, OnInit } from '@angular/core';
import {
  FileUpload,
  FileUploadsByCategory,
} from '../../_model/file-upload.model';
import {
  FileStatus,
  UploadServiceService,
} from '../../services/uploader-service.service';
import { Observable } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatterNewChange } from '../../_model/matter-new-change';
import { error } from 'console';

import { InjectionToken } from '@angular/core';
import { SearchReferrenceNumberComponent } from '../search-referrence-number/search-referrence-number.component';
import { TabMenuComponent } from '../tab-menu/tab-menu.component';

export const WINDOW = new InjectionToken<Window>('WindowToken', {
  factory: () => {
    if (typeof window !== 'undefined') {
      return window;
    }
    return new Window(); // does this work?
  },
});

@Component({
  selector: 'app-upload-screen',
  templateUrl: './upload-screen.component.html',
  styleUrl: './upload-screen.component.css',
})
export class UploadScreenComponent {
  isOpened: boolean = true;
  desktopViewWidth: number = 1100;
  fileUploadsByCategories: FileUploadsByCategory[] = [];
  isHnumberExisted: boolean = false;
  isReadyForUploading: boolean = true;
  isSearchingRefNumber: boolean = false;
  isCompleted: boolean = false;
  uploadProgress: Observable<FileStatus[]> | undefined;
  uploadServiceWrapper: UploadServiceService | undefined = undefined;
  refNumber?: string = '';
  location: string = 'Sydney';
  searchPlacehoder: string = 'ODPP Referrence Number (e.g 123456789)';
  selectedOptions?: string;
  defaultBriefType: string = 'HNumber';
  matterNewChange?: MatterNewChange;
  errorMessage?: string = '';
  hprefix: string = 'H';
  searchMask: string = '00000000';
  selectedMenu: string = 'SearchMatter';
  breadCrumbText: string = 'Home > Search Number';

  private _window = Inject(WINDOW); // or window = inject(WINDOW);
  constructor(private uploadService: UploadServiceService) {}
  ngOnInit() {
    this.onResize(this._window.innerWidth);
    this.uploadProgress = this.uploadService.uploadProgress;
    this.uploadServiceWrapper = this.uploadService;

    this.uploadServiceWrapper.kickOffUpload$.subscribe((data) => {
      if (data == 'UploadAll') {
        this.uploadService.startingUpload = true;
        this.uploadDataLake();
      }
    });
  }

  @HostListener('window:resize', ['$event.target.innerWidth'])
  onResize(width: number) {
    width = width == undefined ? this.desktopViewWidth : width;
    this.isOpened = width >= this.desktopViewWidth;
  }

  ToggleMenu() {
    this.isOpened = !this.isOpened;
  }

  searchForm = new FormGroup({
    refNumber: new FormControl('', Validators.required),
  });
  submitted = false;

  onPrepareDocument() {
    this.isReadyForUploading = true;
  }

  uploadDataLake() {
    console.log(this.uploadService.defaultBriefType);
    console.log(this.searchForm.controls['refNumber'].value);
    var latestFileUploadId = this.uploadService.getFileUploadLatestIdAsync();
    latestFileUploadId.subscribe({
      next: (latestId) => {
        var batchId = latestId + 1;

        this.fileUploadsByCategories =
          this.uploadService.fileUploadsByCategories;
        if (this.fileUploadsByCategories.length > 0) {
          this.fileUploadsByCategories.forEach((fileUploadsByCategory) => {
            // tslint:disable-next-line:prefer-for-of
            for (let i = 0; i < fileUploadsByCategory.filesUpload.length; i++) {
              fileUploadsByCategory.filesUpload[i].briefType =
                this.uploadService.defaultBriefType;
              fileUploadsByCategory.filesUpload[i].batchId = batchId;
              if (this.uploadService.defaultBriefType == 'HNumber') {
                fileUploadsByCategory.filesUpload[i].hNumber =
                this.uploadService.refNumber;
              } else {
                fileUploadsByCategory.filesUpload[i].matterNumber =
                this.uploadService.refNumber;
              }
              this.uploadService.uploadToDataLake(
                fileUploadsByCategory.filesUpload[i],
                this.uploadServiceWrapper?.matterNewChange!,
                this.uploadService.defaultBriefType!
              );
            }
          });
        }
      },
    });
  }

  staringUpload() {
    this.uploadService.startingUpload = true;
    this.uploadDataLake();
    //this.uploadWithResume();
  }

  receivedSelectedMenu(menu: string) {
    this.selectedMenu = menu;
    console.log(menu);
    if (menu == 'SearchMatter') {
      this.breadCrumbText = 'Home > SearchNumber';
    } else if (menu == 'FileUpload') {
      this.breadCrumbText = 'Home > Search Number > File Upload';
    }
  }

  onOutletLoaded(
    component: SearchReferrenceNumberComponent | TabMenuComponent
  ) {
    if (component instanceof TabMenuComponent) {
      component.matterNewChange = this.uploadService.matterNewChange;
    }
  }
}
