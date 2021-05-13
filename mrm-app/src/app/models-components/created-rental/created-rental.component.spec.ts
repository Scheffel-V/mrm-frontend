import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatedRentalComponent } from './created-rental.component';

describe('CreatedRentalComponent', () => {
  let component: CreatedRentalComponent;
  let fixture: ComponentFixture<CreatedRentalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatedRentalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatedRentalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
