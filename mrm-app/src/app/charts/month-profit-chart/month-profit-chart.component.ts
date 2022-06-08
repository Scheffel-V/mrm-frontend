import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { RentalService } from '../../services/rental.service';

@Component({
  selector: 'app-month-profit-chart',
  templateUrl: './month-profit-chart.component.html',
  styleUrls: ['./month-profit-chart.component.scss']
})
export class MonthProfitChartComponent implements OnInit {
  public lineChartData: ChartDataSets[] = [
    { data: [], label: 'Receita' },
  ];
  public lineChartLabels: Label[] = [];
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
  
  private revenues = {}

  constructor(
    private rentalService : RentalService
  ) { }

  ngOnInit() {
    this.getMonthlyRevenue()
  }

  getMonthlyRevenue() {
    this.rentalService.getRevenueFromLastTwelveMonths().subscribe(
      data => {
        var currentDate = new Date()

        for (let i = 11; i >= 0; i--) {
          var auxDate = new Date()
          this.revenues[this.getMonthLabel(new Date(auxDate.setMonth(currentDate.getMonth() - i)))] = data['revenues'][i]
          this.revenuesToChart()
        }
      }
    )
  }

  revenuesToChart() {
    this.lineChartLabels = Object.keys(this.revenues)
    let values = Object.keys(this.revenues).map((v) => { return this.revenues[v] })
    this.lineChartData = [
      { data: values, label: 'Receita' },
    ]
  }

  getMonthLastDay(date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  getMonthLabel(date) {
    switch (date.getMonth()) {
      case 0:
        return "Janeiro"
      case 1:
        return "Fevereiro"
      case 2:
        return "Março"
      case 3:
        return "Abril"
      case 4:
        return "Maio"
      case 5:
        return "Junho"
      case 6:
        return "Julho"
      case 7:
        return "Agosto"
      case 8:
        return "Setembro"
      case 9:
        return "Outubro"
      case 10:
        return "Novembro"
      case 11:
        return "Dezembro"
      default:
        return "Indeterminado"
    }
  }

  getRevenuesForChart() : ChartDataSets[] {
    let values = Object.keys(this.revenues).map(function(v) { return this.revenues[v]; }.bind(this));
    return [
      { data: values , label: 'Receita' },
    ]
  }
}