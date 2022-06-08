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
import  * as XLSX from 'xlsx';


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
  currentMonthInvoicedValue : number = 0
  lastMonthInvoicedValue : number = 0
  isIncrease : boolean = true
  percentValue : number = 0.10
  color : string = "primary"
  isCurrency : boolean = true
  isShowRevenue : boolean = false
  isShowInvoicedValue : boolean = false

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
        this.currentMonthRevenue = revenue['current_month_revenue'] ? revenue['current_month_revenue'] : 0
        this.lastMonthRevenue = revenue['last_month_revenue'] ? revenue['last_month_revenue'] : 0
      }
    )

    this.rentalService.getInvoicedValue().subscribe(
      response => {
        this.currentMonthInvoicedValue = response['current_month_invoiced_value'] ? response['current_month_invoiced_value'] : 0
        this.lastMonthInvoicedValue = response['last_month_invoiced_value'] ? response['last_month_invoiced_value'] : 0
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

  public showInvoicedValue() {
    this.isShowInvoicedValue = true
  }

  public hideInvoicedValue() {
    this.isShowInvoicedValue = false
  }

  public downloadCurrentMonthInvoices() {
    this.rentalService.getInvoicesFromCurrentMonth().subscribe(
      response => {
        let teste = response
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(response);

        var wscols = [
          {wch:17},
          {wch:17},
          {wch:17},
          {wch:30},
          {wch:10},
          {wch:10},
          {wch:10}
        ];
        ws['!cols'] = wscols;
        
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

        var currentDate = new Date()
        XLSX.writeFile(wb, "Faturas_" + this.getMonthLabel(currentDate) + "_" + currentDate.getFullYear() + ".xlsx")
      }
    )
  }

  public downloadLastMonthInvoices() {
    this.rentalService.getInvoicesFromLastMonth().subscribe(
      response => {
        let teste = response
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(response);

        var wscols = [
          {wch:17},
          {wch:17},
          {wch:17},
          {wch:30},
          {wch:10},
          {wch:10},
          {wch:10}
        ];
        ws['!cols'] = wscols;
        
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

        var auxDate = new Date()
        var currentDate = new Date()
        XLSX.writeFile(wb, "Faturas_" + this.getMonthLabel(new Date(auxDate.setMonth(currentDate.getMonth() - 1))) + "_" + currentDate.getFullYear() + ".xlsx")
      }
    )
  }

  getMonthLabel(date) {
    switch (date.getMonth()) {
      case 0:
        return "Janeiro"
      case 1:
        return "Fevereiro"
      case 2:
        return "Marco"
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
}
