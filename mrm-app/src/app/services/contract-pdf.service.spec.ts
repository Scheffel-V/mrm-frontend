import { TestBed } from '@angular/core/testing';

import { ContractPDFService } from './contract-pdf.service';

describe('ContractPDFService', () => {
  let service: ContractPDFService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContractPDFService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
