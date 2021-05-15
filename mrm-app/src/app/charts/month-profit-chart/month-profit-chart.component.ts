import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';

@Component({
  selector: 'app-month-profit-chart',
  templateUrl: './month-profit-chart.component.html',
  styleUrls: ['./month-profit-chart.component.scss']
})
export class MonthProfitChartComponent implements OnInit {
  public lineChartData: ChartDataSets[] = [
    { data: [40000, 45000, 48000, 43000, 50000], label: 'Faturamento' },
  ];
  public lineChartLabels: Label[] = ['January', 'February', 'March', 'April', 'May'];
  public lineChartOptions: (ChartOptions & { annotation: any }) = {
    responsive: true,
    annotation: true
  };
  public lineChartColors: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: 'rgba(0,255,0,0.5)',
    },
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';
  public lineChartPlugins = [];

  constructor() { }

  ngOnInit() {
  }
}