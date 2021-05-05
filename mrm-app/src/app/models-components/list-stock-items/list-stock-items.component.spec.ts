import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListStockItemsComponent } from './list-stock-items.component';

describe('ListStockItemsComponent', () => {
  let component: ListStockItemsComponent;
  let fixture: ComponentFixture<ListStockItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListStockItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListStockItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
