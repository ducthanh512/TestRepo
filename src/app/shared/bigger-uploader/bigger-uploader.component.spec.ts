import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BiggerUploaderComponent } from './bigger-uploader.component';

describe('BiggerUploaderComponent', () => {
  let component: BiggerUploaderComponent;
  let fixture: ComponentFixture<BiggerUploaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BiggerUploaderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BiggerUploaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
