import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-month-profit-chart',
  templateUrl: './month-profit-chart.component.html',
  styleUrls: ['./month-profit-chart.component.scss']
})
export class MonthProfitChartComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  public chartType: string = 'line';

  public chartDatasets: Array<any> = [
    { data: [35000,26500, 28000, 33000, 13000], label: 'Para faturar' },
    { data: [23000, 20000, 25000, 30000, 8000], label: 'Faturado' }
  ];

  public chartLabels: Array<any> = ['January', 'February', 'March', 'April', 'May'];

  public chartColors: Array<any> = [
    {
      backgroundColor: 'rgba(20, 101, 246, .3)',
      borderColor: 'rgba(20, 101, 246, .9)',
      borderWidth: 2,
    },
    {
      backgroundColor: 'rgba(20, 253, 0, .5)',
      borderColor: 'rgba(20, 253, 0, .9)',
      borderWidth: 2,
    }
  ];

  public chartOptions: any = {
    responsive: true
  };
  public chartClicked(e: any): void { }
  public chartHovered(e: any): void { }
}
