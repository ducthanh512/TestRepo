import { Directive, HostBinding, HostListener, Output } from '@angular/core';
import { FileUpload } from '../_model/file-upload.model';
import { DomSanitizer } from '@angular/platform-browser';
import { EventEmitter } from '@angular/core';

@Directive({
  selector: '[appDrag]',
})
export class DragDirective {
  @Output() multipleFiles: EventEmitter<FileUpload[]> = new EventEmitter();
  @HostBinding('style.background') private background = '#f7f8f9';
  @HostBinding('style.z-index') private zIndex = 1;

  files: FileUpload[] = [];
  constructor(private sanitizer: DomSanitizer) {}
  @HostListener('dragover', ['$event'])
  public onDragOver(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#999';
  }
  @HostListener('dragleave', ['$event'])
  public onDragLeave(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#f7f8f9';
  }
  @HostListener('drop', ['$event'])
  public onDrop(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#f7f8f9';

    let fileUpload: FileUpload = { file: null, url: '' };
    if (evt.dataTransfer?.files) {
      for (let i = 0; i < evt.dataTransfer?.files.length; i++) {
        let file = evt.dataTransfer?.files[i];
        const url = this.sanitizer.bypassSecurityTrustUrl(
          window.URL.createObjectURL(file as any)
        );
        fileUpload = {
          file,
          url,
          fileName: file?.name,
          fileType: file?.type,
          fileSize: file?.size,
          position: i + 1,
          sentitive: false,
        };
        this.files.push(fileUpload);
      }
      this.multipleFiles.emit(this.files);
      this.files = [];
    }
  }
}
