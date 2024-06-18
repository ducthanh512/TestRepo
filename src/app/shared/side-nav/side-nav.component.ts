import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.css',
})
export class SideNavComponent {
  @Output() sendSelectedMenu = new EventEmitter<string>();

  constructor(private router: Router) {}

  onMenuClick(menu: string) {
    this.sendSelectedMenu.emit(menu);

    if (menu == 'SearchMatter') {
      this.router.navigate(['/search']);
    } else if (menu == 'FileUpload') {
      this.router.navigate(['/upload']);
    }
  }
}
