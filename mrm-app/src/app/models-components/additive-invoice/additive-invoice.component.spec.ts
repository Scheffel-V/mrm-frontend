import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditiveInvoiceComponent } from './additive-invoice.component';

describe('AdditiveInvoiceComponent', () => {
  let component: AdditiveInvoiceComponent;
  let fixture: ComponentFixture<AdditiveInvoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdditiveInvoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdditiveInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
