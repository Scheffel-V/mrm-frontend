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
import { RentalService } from '../services/rental.service';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent extends BaseComponent implements OnInit {

  customers : Customer[] = []
  activeCustomers : Customer[] = []
  stockItems : StockItem[] = []
  activeStockItemsCounter : number = 0
  suppliers : Supplier[] = []
  rentals : Rental[] = []
  activeRentals : Rental[] = []
  currentMonthRevenue : number = 0
  lastMonthRevenue : number = 0
  isIncrease : boolean = true
  percentValue : number = 0.10
  color : string = "primary"
  isCurrency : boolean = true
  isShowRevenue : boolean = false

  constructor(
    private customerService : CustomerService,
    private stockItemService : StockItemService,
    private supplierService : SupplierService,
    private rentalService : RentalService,
    scriptsService : ScriptsService,
    location : Location,
    router : Router,
    matSnackBar : MatSnackBar,
    authService: AuthService, 
  ) {
    super(
      scriptsService,
      location,
      router,
      matSnackBar,
      authService
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

    this.supplierService.getAllSuppliers().subscribe(
      suppliers => {
        this.suppliers = suppliers
      }
    )

    this.rentalService.getAllRentals().subscribe(
      rentals => {
        this.rentals = rentals
      }
    )

    this.customerService.getAllCustomersWithActiveContract().subscribe(
      customers => {
        this.activeCustomers = this.filterDuplicateCustomers(customers)
      }
    )

    this.rentalService.getAllActiveRentals().subscribe(
      rentals => {
        this.activeRentals = rentals
        this.getStockItemCount()
      }
    )

    this.rentalService.getRevenue().subscribe(
      revenue => {
        this.currentMonthRevenue = revenue['current_month_revenue']
        this.lastMonthRevenue = revenue['last_month_revenue']
      }
    )
  }

  getStockItemCount() {
    this.rentals.forEach((rental) => {
      if (rental.active && (rental.status !== "FINISHED")) {
        this.rentalService.getRental(rental.id).subscribe((data) => {
          let activeRental = data

          activeRental.itemRentals.forEach((itemRental) => {
            console.log(itemRental)
            if (!itemRental.returnedAt) {            
              if (this.isStockItemRented(itemRental.stockItem)) {
                this.activeStockItemsCounter = this.activeStockItemsCounter + 1
              }
            }
          })
        })
      }
    })
  }

  public isStockItemRented(stockItem : StockItem) {
    return !(stockItem.status === 'MAINTENANCE' || stockItem.status === 'INVENTORY' || stockItem.status === 'RESERVED')
  }

  filterDuplicateCustomers(customers): Customer[] {
    return customers.filter((customer, index, self) => 
      index === self.findIndex((t) => (
        t.cnpj === customer.cnpj
      ))
    )
  }
  
  public showRevenue() {
    this.isShowRevenue = true
  }

  public hideRevenue() {
    this.isShowRevenue = false
  }
}
