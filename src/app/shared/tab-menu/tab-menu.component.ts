import { Component, EventEmitter, Input, Output } from '@angular/core';
import { categoryList } from '../../services/example-data';
import { FileUploadsByCategory } from '../../_model/file-upload.model';
import {
  UploadServiceService,
} from '../../services/uploader-service.service';
import { MatterNewChange } from '../../_model/matter-new-change';
import { Router } from '@angular/router';
@Component({
  selector: 'app-tab-menu',
  templateUrl: './tab-menu.component.html',
  styleUrl: './tab-menu.component.css',
})
export class TabMenuComponent {

  @Input() matterNewChange?:MatterNewChange;
  @Output() sendUploadAll = new EventEmitter<string>();
  fileUploadsByCategories: FileUploadsByCategory[] = [];
  uploadServiceTab: UploadServiceService| undefined = undefined;
  categorylist = categoryList;

  constructor(public uploadService: UploadServiceService, private router: Router) {}
  ngOnInit(): void {
    this.uploadServiceTab = this.uploadService;
    
    if (!this.uploadService.matterNewChange || this.uploadService.matterNewChange.id == null || this.uploadService.matterNewChange.id == 0) {      
      this.router.navigate(['/search']);
    }

    this.uploadServiceTab.fileUploadsByCategories$.subscribe((data) => {
      this.categorylist = this.uploadService.updateTabData();
    });

  }

  receivedSelectedFiles(fileUploadsByCategory: FileUploadsByCategory) {
    this.fileUploadsByCategories = this.fileUploadsByCategories.filter(
      (item) => item.category !== fileUploadsByCategory.category
    );
    this.fileUploadsByCategories.push(fileUploadsByCategory);
    this.uploadService.fileUploadsByCategories = this.fileUploadsByCategories;
    this.uploadServiceTab!.setFileUploadsByCategories$.subscribe(this.uploadService.fileUploadsByCategories$);
  }
  staringUpload(){
   // this.sendUploadAll.emit('UploadAll');
   this.uploadService.kickOffUpload = "UploadAll";
   this.uploadServiceTab!.setKickOffUpload$.subscribe(this.uploadService.kickOffUpload$);
  }
}
