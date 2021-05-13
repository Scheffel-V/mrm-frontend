import { TestBed } from '@angular/core/testing';

import { ItemRentalService } from './item-rental.service';

describe('ItemRentalService', () => {
  let service: ItemRentalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItemRentalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
