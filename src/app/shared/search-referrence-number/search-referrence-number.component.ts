import { Component, OnInit } from '@angular/core';
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
import { Router } from '@angular/router';
import { MatterActionResult } from '../../_model/IActionResult';

@Component({
  selector: 'app-search-referrence-number',
  templateUrl: './search-referrence-number.component.html',
  styleUrl: './search-referrence-number.component.css',
})
export class SearchReferrenceNumberComponent implements OnInit {
  fileUploadsByCategories: FileUploadsByCategory[] = [];
  startingUpload: boolean = false;
  isHnumberExisted: boolean = false;
  isReadyForUploading: boolean = true;
  isSearchingRefNumber: boolean = false;
  isCompleted: boolean = false;
  uploadProgress: Observable<FileStatus[]> | undefined;
  uploadServiceWrapper: UploadServiceService | undefined = undefined;
  refNumber?: string = '';
  documentType: string = 'Brief';
  location: string = 'Sydney';
  searchPlacehoder: string = 'ODPP Referrence Number (e.g 123456789)';
  selectedOptions?: string;
  defaultBriefType: string = 'HNumber';
  matterNewChange?: MatterNewChange;
  errorMessage?: string = '';
  hprefix: string = 'H';
  searchMask: string = '00000000';

  searchForm = new FormGroup({
    refNumber: new FormControl('', Validators.required),
  });
  submitted = false;

  constructor(
    private uploadService: UploadServiceService,
    private router: Router
  ) {}
  ngOnInit(): void {
    console.log('searcing');
    this.uploadProgress = this.uploadService.uploadProgress;
    this.uploadServiceWrapper = this.uploadService;
    if(this.uploadService.startingUpload) this.uploadService.startingUpload=false;
  }

  onBriefTypeSelection(event: any) {
    this.uploadService.defaultBriefType = event.value;
    this.uploadService.defaultBriefType = this.defaultBriefType;
    if (this.defaultBriefType == 'HNumber') {
      this.hprefix = 'H';
      this.searchMask = '00000000';
      this.searchPlacehoder = 'ODPP HNumber(e.g H12345678)';
    } else {
      this.hprefix = '';
      this.searchMask = '000000000';
      this.searchPlacehoder = 'ODPP Referrence Number (e.g 123456789)';
    }

    this.searchForm.setValue({
      refNumber: '',
    });
  }

  onSearch() {
    this.submitted = true;

    if (this.searchForm.controls['refNumber'].value == '') {
      this.errorMessage = 'Referrence Number is required *';
      this.isSearchingRefNumber = false;
      this.isHnumberExisted = false;
      this.submitted = false;
    }

    if ((this, this.searchForm.invalid)) {
      this.errorMessage = 'Referrence Number not found*';
      this.isSearchingRefNumber = false;
      this.isHnumberExisted = false;
      this.submitted = false;
      return;
    }

    this.isSearchingRefNumber = true;
    this.refNumber = this.searchForm.controls['refNumber'].value!;
    this.uploadService.refNumber = this.refNumber;
    var result = null;
    if (this.defaultBriefType == 'HNumber') {
      result = this.uploadService.getMatterNewChangeByHNumberAsync(
        this.refNumber
      );
    } else {
      result = this.uploadService.getMatterNewChangeByMatterNumberAsync(
        this.refNumber
      );
    }

    result!.subscribe({
      next: (actionResult: MatterActionResult) => {
        var matterNewChange = actionResult.value;
        if (matterNewChange == null || matterNewChange.id == -1) {
          this.errorMessage = 'Referrence number not found';
          this.isHnumberExisted = false;
          this.isSearchingRefNumber = false;
          return;
        }
        this.errorMessage = '';
        this.isSearchingRefNumber = false;
        matterNewChange!.firstHNumber = matterNewChange!.matterHREF?.substring(
          0,
          8
        );
        this.matterNewChange = matterNewChange;
        if (this.matterNewChange!.id != null && this.matterNewChange!.id > 0) {
          this.isHnumberExisted = true;
          this.uploadService.setMatterNewChange(matterNewChange!);
        }
      },
      error: (e: any) => {
        console.log(e);
        this.errorMessage = 'Referrence number not found';
        this.isHnumberExisted = false;
        this.isSearchingRefNumber = false;
      },
      complete: () => (this.isSearchingRefNumber = false),
    });
  }

  onPrepareDocument() {
    this.isReadyForUploading = true;
    this.router.navigate(['/upload']);
  }
}
