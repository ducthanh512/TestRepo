import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list/list.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { MatGridListModule } from '@angular/material/grid-list';
import { UploaderComponent } from './uploader/uploader.component';
import { DragDirective } from './drag.directive';
import { DialogContentComponent } from './dialog-content/dialog-content.component';
import { MatDialogModule } from '@angular/material/dialog';
import { UploadingComponent } from './uploading/uploading.component';
import {ReactiveFormsModule} from '@angular/forms'
import {MAT_RADIO_DEFAULT_OPTIONS, MatRadioModule} from '@angular/material/radio';
import { NgxMaskModule } from 'ngx-mask';
import { TreeMenuComponent } from './tree-menu/tree-menu.component'
import {MatTreeModule} from '@angular/material/tree';
import { TabMenuComponent } from './tab-menu/tab-menu.component';
import {MatTabsModule} from '@angular/material/tabs';
import { UploadScreenComponent } from './upload-screen/upload-screen.component';
import {MatButtonModule} from '@angular/material/button';
import {MatSidenavModule} from '@angular/material/sidenav';
import { BiggerUploaderComponent } from './bigger-uploader/bigger-uploader.component';
import {MatTableModule} from '@angular/material/table';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { RouterModule } from '@angular/router';
import { SearchReferrenceNumberComponent } from './search-referrence-number/search-referrence-number.component';
import {MatIconModule} from '@angular/material/icon';
import { SharedRoutingModule } from './shared-routing.module';
import { SideNavComponent } from './side-nav/side-nav.component';


@NgModule({
  declarations: [
    ListComponent,
    UploaderComponent,
    DragDirective,
    DialogContentComponent,
    UploadingComponent,
    TabMenuComponent,
    UploadScreenComponent,
    BiggerUploaderComponent,
    SearchReferrenceNumberComponent,
    SideNavComponent,  
  ],
  imports: [
    CommonModule,
    FormsModule,
    BrowserModule,
    MatGridListModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatRadioModule,
    NgxMaskModule.forRoot(),
    MatTreeModule,
    MatTabsModule,
    MatButtonModule,
    MatSidenavModule,
    MatTableModule,
    MatCheckboxModule,
    MatIconModule,
    TreeMenuComponent,
    SharedRoutingModule
  ],
  providers: [{
    provide: MAT_RADIO_DEFAULT_OPTIONS,
    useValue: { color: 'primary' },
}],
  exports: [
    ListComponent,
    UploaderComponent,
    DialogContentComponent,
    UploadingComponent,
    TreeMenuComponent,
    TabMenuComponent,
    UploadScreenComponent,
    BiggerUploaderComponent,
    SearchReferrenceNumberComponent,
    SideNavComponent,
  ],
})
export class SharedModule {}
