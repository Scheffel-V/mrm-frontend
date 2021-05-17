import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAdditivesComponent } from './list-additives.component';

describe('ListAdditivesComponent', () => {
  let component: ListAdditivesComponent;
  let fixture: ComponentFixture<ListAdditivesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListAdditivesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListAdditivesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
