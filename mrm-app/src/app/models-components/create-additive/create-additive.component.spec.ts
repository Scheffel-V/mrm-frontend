import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAdditiveComponent } from './create-additive.component';

describe('CreateAdditiveComponent', () => {
  let component: CreateAdditiveComponent;
  let fixture: ComponentFixture<CreateAdditiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateAdditiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAdditiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
