import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { StockItem } from '../../models/stock-item.model';
import { Location } from '@angular/common';
import { StockItemService } from '../../services/stock-item.service'
import { ProductModelService } from '../../services/product-model.service'
import { SupplierService } from '../../services/supplier.service'
import { STOCK_ITEM_ID_PARAM , INITIAL_ID } from '../../app.constants'
import { BaseComponent } from 'src/app/base/base.component';
import { ScriptsService } from 'src/app/services/scripts.service';
import { FormGroup, FormControl } from '@angular/forms';
import { ProductModel } from '../../models/product-model.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReplaySubject, Subject } from 'rxjs';
import { Supplier } from '../../models/supplier.model';
import { MatSelect } from '@angular/material/select';
import { takeUntil } from 'rxjs/operators';


@Component({
  selector: 'app-stock-item',
  templateUrl: './stock-item.component.html',
  styleUrls: ['./stock-item.component.scss']
})
export class StockItemComponent extends BaseComponent implements OnInit {

  id : number
  stockItem : StockItem
  stockItemForm : FormGroup
  suppliers : Supplier[] = []

  supplierFilterControl : FormControl = new FormControl()
  filteredSuppliers : ReplaySubject<Supplier[]> = new ReplaySubject<Supplier[]>(1)
  protected _onDestroy = new Subject<void>();
  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;

  constructor(
    private stockItemService : StockItemService,
    private productModelService : ProductModelService,
    private supplierService : SupplierService,
    private activatedRoute : ActivatedRoute,
    scriptsService : ScriptsService,
    location : Location,
    router : Router,
    matSnackBar : MatSnackBar
  ) { 
    super(scriptsService, location, router, matSnackBar)
  }

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.params[STOCK_ITEM_ID_PARAM]
    this.stockItem = new StockItem(this.id, -1, new ProductModel(-1))

    if (this.id != INITIAL_ID) {
      this.fetchStockItem()
    }

    this.fetchSuppliers()
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
    this.productModelService.createProductModel(this.stockItem.productModel).subscribe(
      data => {
        let stockItem = this.stockItem
        stockItem.productModelId = data.id
        delete stockItem['productModel']
        delete stockItem['id']
        this.stockItemService.createStockItem(stockItem).subscribe(
          data => {
            this.stockItem = data
            this.listStockItems()
          }
        )
      }
    )
  }

  updateStockItem(): void {
    this.productModelService.updateProductModel(this.stockItem.productModel).subscribe(
      data => {
        this.stockItem.productModel = data
        this.stockItemService.updateStockItem(this.stockItem).subscribe(
          data => {
            this.listStockItems()
          }
        )
      }
    )
  }

  deleteStockItem(): void {
    this.stockItemService.deleteStockItem(this.stockItem.id).subscribe(
      response => {
        this.listStockItems()
      }
    )
  }

  sendToMaintenance() : void {
    this.stockItemService.sendToMaintenance(this.stockItem).subscribe(
      data => {
        this.listStockItems()
      }
    )
  }

  releaseFromMaintenance() : void {
    this.stockItemService.releaseFromMaintenance(this.stockItem).subscribe(
      data => {
        this.listStockItems()
      }
    )
  }

  leave() : void {
    this.stockItemService.leave(this.stockItem).subscribe(
      data => {
        this.listStockItems()
      }
    )
  }

  arrive() : void {
    this.stockItemService.arrive(this.stockItem).subscribe(
      data => {
        this.listStockItems()
      }
    )
  }

  readyForLeave() : void {
    this.stockItemService.readyForLeave(this.stockItem).subscribe(
      data => {
        this.listStockItems()
      }
    )
  }

  fetchSuppliers(): void {
    this.supplierService.getAllSuppliers().subscribe(
      data => {
        this.suppliers = data
        this.filteredSuppliers.next(this.suppliers.slice())

        this.supplierFilterControl.valueChanges
          .pipe(takeUntil(this._onDestroy))
          .subscribe(() => {
            this.filterSuppliers();
          });
      }
    )
  }

  
  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  filterSuppliers() {
    if (!this.suppliers) {
      return;
    }
    
    let search = this.supplierFilterControl.value;
    if (!search) {
      this.filteredSuppliers.next(this.suppliers.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    
    this.filteredSuppliers.next(
      this.suppliers.filter(supplier => supplier.companyName.toLowerCase().indexOf(search) > -1)
    );
  }
}