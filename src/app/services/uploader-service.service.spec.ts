import { TestBed } from '@angular/core/testing';

import { UploaderServiceService } from './uploader-service.service';

describe('UploaderServiceService', () => {
  let service: UploaderServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UploaderServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
