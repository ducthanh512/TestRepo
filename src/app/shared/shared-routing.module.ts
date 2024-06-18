import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {SearchReferrenceNumberComponent} from './search-referrence-number/search-referrence-number.component';
import{TabMenuComponent} from './tab-menu/tab-menu.component';

const routes: Routes = [
  {
    path: "", component:SearchReferrenceNumberComponent
  },
  {
    path: "search", component:SearchReferrenceNumberComponent
  },
  {
    path: "upload", component:TabMenuComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class SharedRoutingModule { }
