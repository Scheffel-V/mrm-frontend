import { Component, OnInit } from '@angular/core'
import { ScriptsService } from '../services/scripts.service'
import { BaseComponent } from '../base/base.component'
import { Router } from '@angular/router'
import { Location } from '@angular/common';
import { CustomerService } from '../services/customer.service';
import { StockItemService } from '../services/stock-item.service';
import { SupplierService } from '../services/supplier.service';
import { Customer } from '../models/customer.model';
import { StockItem } from '../models/stock-item.model';
import { Supplier } from '../models/supplier.model';
import { Rental } from '../models/rental.model'
import { MatSnackBar } from '@angular/material/snack-bar';


const scripts = [
  //'../../assets/js/demo/chart-area-demo.js',
  //'../../assets/js/demo/chart-pie-demo.js'
]

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent extends BaseComponent implements OnInit {

  customers : Customer[] = []
  stockItems : StockItem[] = []
  suppliers : Supplier[] = []
  rentals : Rental[] = []

  constructor(
    private customerService : CustomerService,
    private stockItemService : StockItemService,
    private supplierService : SupplierService,
    scriptsService : ScriptsService,
    location : Location,
    router : Router,
    matSnackBar : MatSnackBar
  ) {
    super(
      scriptsService,
      location,
      router,
      matSnackBar
    )
   }

  ngOnInit(): void {
    this.customerService.getAllCustomers().subscribe(
      customers => {
        this.customers = customers
      }
    )

    this.stockItemService.getAllStockItems().subscribe(
      stockItems => {
        this.stockItems = stockItems
      }
    )

    /**this.supplierService.getAllSuppliers().subscribe(
      suppliers => {
        this.suppliers = suppliers
      }
    )**/
  }

  ngAfterContentInit(): void {
    this.loadScripts(scripts)
  }
}
