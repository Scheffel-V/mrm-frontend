import { TestBed } from '@angular/core/testing';

import { StockItemEventService } from './stock-item-event.service';

describe('StockItemEventService', () => {
  let service: StockItemEventService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StockItemEventService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
