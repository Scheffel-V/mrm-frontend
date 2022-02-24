import { Component, OnInit } from '@angular/core';
import { StockItemEvent } from '../../models/stock-item-event.model';
import { MatTableDataSource } from '@angular/material/table';
import { StockItemEventService } from '../../services/stock-item-event.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ScriptsService } from 'src/app/services/scripts.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BaseComponent } from 'src/app/base/base.component';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent extends BaseComponent implements OnInit {

  stockItemEvents : StockItemEvent[] = []
  public displayedColumns = ['date', 'item', 'event'];
  public dataSource = new MatTableDataSource<StockItemEvent>();

  constructor(
    private stockItemEventService : StockItemEventService,
    scriptsService : ScriptsService,
    router : Router,
    location : Location,
    matSnackBar : MatSnackBar,
    authService: AuthService
  ) {
    super(scriptsService, location, router, matSnackBar, authService)
   }

  ngOnInit(): void {
    this.stockItemEventService.getAllStockItemEvents().subscribe(
      data => {
        this.stockItemEvents = this.filterInvalidStockItemEvents(data) //@TODO: Backend should do this.
        this.stockItemEvents = this.stockItemEvents.reverse()
        this.prepareTextToDisplay()
        this.displayStockItemEvents(this.stockItemEvents)
      }
    )
  }

  public displayStockItemEvents(stockItemEvents : StockItemEvent[]) : void {
    this.dataSource.data = stockItemEvents
  }

  public prepareTextToDisplay() {
    this.stockItemEvents.forEach(stockItemEvent => {
      if (stockItemEvent.stockItem) {
        stockItemEvent.createdAt = new Date(stockItemEvent.createdAt)
        stockItemEvent.textToDisplay = "O Item " + stockItemEvent.stockItem.name + " , de código " + stockItemEvent.stockItem.code + ", foi movido para " + this.prepareStatusToDisplay(stockItemEvent.status) + " as " + this.prepareDateToDisplay(stockItemEvent.createdAt) + "."
      }
    })
  }

  public prepareStatusToDisplay(status : string) {
    if (status === 'INVENTORY') {
      return "Retornou ao estoque."
    }
    
    if (status === 'RENTED') {
      return "Foi alugado."
    }

    if (status === 'RESERVED') {
      return "Foi reservado."
    }

    if (status === 'MAINTENANCE') {
      return "Movido para a manutenção."
    }

    if (status === 'READY_FOR_RENTAL') {
      return "Está pronto para sair."
    }

    if (status === 'CUSTOMER') {
      return "Está com o cliente."
    }
  }

  public prepareDateToDisplay(date : Date) {
    return this.prepareDay(date.getDate()) + "/" + this.prepareMonth(date.getMonth()) + "/" + date.getFullYear() + " - " + date.getHours() + ":" + date.getMinutes()
  }

  public prepareDay(day : number) {
    return day <= 9 ? '0' + String(day) : day
  }

  public prepareMonth(month : number) {
    month += 1
    return month <= 9 ? '0' + String(month) : month
  }

  public filterInvalidStockItemEvents(stockItemEvents) : StockItemEvent[] {
    return stockItemEvents.filter(stockItemEvent => stockItemEvent.stockItem)
  }
}
