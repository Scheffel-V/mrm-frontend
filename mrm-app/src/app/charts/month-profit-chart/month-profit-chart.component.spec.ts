import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthProfitChartComponent } from './month-profit-chart.component';

describe('MonthProfitChartComponent', () => {
  let component: MonthProfitChartComponent;
  let fixture: ComponentFixture<MonthProfitChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonthProfitChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthProfitChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
