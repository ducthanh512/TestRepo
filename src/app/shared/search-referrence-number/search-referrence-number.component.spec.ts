import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchReferrenceNumberComponent } from './search-referrence-number.component';

describe('SearchReferrenceNumberComponent', () => {
  let component: SearchReferrenceNumberComponent;
  let fixture: ComponentFixture<SearchReferrenceNumberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchReferrenceNumberComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SearchReferrenceNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
