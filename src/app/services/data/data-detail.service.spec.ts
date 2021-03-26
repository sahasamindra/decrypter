import { TestBed } from '@angular/core/testing';

import { DataDetailService } from './data-detail.service';

describe('DataDetailService', () => {
  let service: DataDetailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataDetailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
