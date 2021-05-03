import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { StockItem } from '../../models/stock-item.model';
import { Location } from '@angular/common';
import { StockItemService } from '../../services/stock-item.service'
import { STOCK_ITEM_ID_PARAM , INITIAL_ID } from '../../app.constants'
import { BaseComponent } from 'src/app/base/base.component';
import { ScriptsService } from 'src/app/services/scripts.service';
import { FormGroup } from '@angular/forms';


@Component({
  selector: 'app-stock-item',
  templateUrl: './stock-item.component.html',
  styleUrls: ['./stock-item.component.scss']
})
export class StockItemComponent extends BaseComponent implements OnInit {

  id : number
  stockItem : StockItem
  stockItemForm : FormGroup

  constructor(
    private stockItemService : StockItemService,
    private activatedRoute : ActivatedRoute,
    scriptsService : ScriptsService,
    location : Location,
    router : Router
  ) { 
    super(scriptsService, location, router)
  }

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.params[STOCK_ITEM_ID_PARAM]
    this.stockItem = new StockItem(this.id, -1)

    if (this.id != INITIAL_ID) {
      this.fetchStockItem()
    }
  }

  fetchStockItem(): void {
    this.stockItemService.getStockItem(this.id).subscribe(
      data => {
        this.stockItem = data
      }
    )
  }

  saveStockItem(): void {
    if (this.id == INITIAL_ID) {
      this.createStockItem()
      return
    }

    this.updateStockItem()
  }

  createStockItem(): void {
    delete this.stockItem['id']
    this.stockItemService.createStockItem(this.stockItem).subscribe(
      data => {
        this.location.back()
      }
    )
  }

  updateStockItem(): void {
    this.stockItemService.updateStockItem(this.stockItem).subscribe(
      data => {
        this.location.back()
      }
    )
  }

  deleteStockItem(): void {
    this.stockItemService.deleteStockItem(this.stockItem.id).subscribe(
      response => {
        this.location.back()
      }
    )
  }

  sendToMaintenance() : void {
    this.stockItemService.sendToMaintenance(this.stockItem).subscribe(
      data => {
        this.location.back()
      }
    )
  }

  releaseFromMaintenance() : void {
    this.stockItemService.releaseFromMaintenance(this.stockItem).subscribe(
      data => {
        this.location.back()
      }
    )
  }

  leave() : void {
    this.stockItemService.leave(this.stockItem).subscribe(
      data => {
        this.location.back()
      }
    )
  }

  arrive() : void {
    this.stockItemService.arrive(this.stockItem).subscribe(
      data => {
        this.location.back()
      }
    )
  }

  readyForLeave() : void {
    this.stockItemService.readyForLeave(this.stockItem).subscribe(
      data => {
        this.location.back()
      }
    )
  }
}