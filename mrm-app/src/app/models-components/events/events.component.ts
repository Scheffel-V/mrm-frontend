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
      return "estoque"
    }
    
    if (status === 'RENTED') {
      return "Alugado"
    }

    if (status === 'MAINTENANCE') {
      return "a manutenção"
    }

    if (status === 'READY_FOR_RENTAL') {
      return "Pronto para sair"
    }

    if (status === 'CUSTOMER') {
      return "cliente"
    }
  }

  public prepareDateToDisplay(date : Date) {
    return date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear() + " - " + date.getHours() + ":" + date.getMinutes()
  }

  public filterInvalidStockItemEvents(stockItemEvents) : StockItemEvent[] {
    return stockItemEvents.filter(stockItemEvent => stockItemEvent.stockItem)
  }
}
