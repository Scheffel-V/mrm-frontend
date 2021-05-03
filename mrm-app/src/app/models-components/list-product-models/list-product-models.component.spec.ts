import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListProductModelsComponent } from './list-product-models.component';

describe('ListProductModelsComponent', () => {
  let component: ListProductModelsComponent;
  let fixture: ComponentFixture<ListProductModelsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListProductModelsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListProductModelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
