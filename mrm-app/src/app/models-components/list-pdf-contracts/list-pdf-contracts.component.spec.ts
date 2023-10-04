import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPdfContractsComponent } from './list-pdf-contracts.component';

describe('ListPdfContractsComponent', () => {
  let component: ListPdfContractsComponent;
  let fixture: ComponentFixture<ListPdfContractsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListPdfContractsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPdfContractsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
