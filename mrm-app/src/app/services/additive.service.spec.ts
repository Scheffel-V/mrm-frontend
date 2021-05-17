import { TestBed } from '@angular/core/testing';

import { AdditiveService } from './additive.service';

describe('AdditiveService', () => {
  let service: AdditiveService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdditiveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
