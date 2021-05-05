import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Rental } from '../../models/rental.model'
import { Location } from '@angular/common';
import { RentalService } from '../../services/rental.service'
import { CustomerService } from '../../services/customer.service'
import { StockItemService } from '../../services/stock-item.service'
import { RENTAL_ID_PARAM , INITIAL_ID } from '../../app.constants'
import { BaseComponent } from 'src/app/base/base.component';
import { ScriptsService } from 'src/app/services/scripts.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Customer } from '../../models/customer.model';
import { StockItem } from '../../models/stock-item.model';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { MatRadioChange } from '@angular/material/radio';



@Component({
  selector: 'app-rental',
  templateUrl: './rental.component.html',
  styleUrls: ['./rental.component.scss']
})
export class RentalComponent extends BaseComponent implements OnInit {

  id : number
  rental : Rental
  rentalForm : FormGroup
  customers : Customer[] = []
  stockItems : StockItem[] = []
  durationMode : string = "1"

  customerFilterControl : FormControl = new FormControl()
  filteredCustomers : ReplaySubject<Customer[]> = new ReplaySubject<Customer[]>(1)
  protected _onDestroy = new Subject<void>();
  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;

  stockItemFilterControl : FormControl = new FormControl()
  filteredStockItems : ReplaySubject<StockItem[]> = new ReplaySubject<StockItem[]>(1)
  @ViewChild('multiSelect', { static: true }) multiSelect: MatSelect;

  constructor(
    private rentalService : RentalService,
    private customerService : CustomerService,
    private stockItemService : StockItemService,
    private activatedRoute : ActivatedRoute,
    scriptsService : ScriptsService,
    location : Location,
    router : Router
  ) { 
    super(scriptsService, location, router)
  }

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.params[RENTAL_ID_PARAM]
    this.rental = new Rental(this.id, null, [])

    if (this.id != INITIAL_ID) {
      this.fetchRental()
    }

    this.fetchCustomers()
    this.fetchStockItemsInInventory()
  }

  fetchRental(): void {
    this.rentalService.getRental(this.id).subscribe(
      data => {
        this.rental = data
      }
    )
  }

  saveRental(): void {
    if (this.id == INITIAL_ID) {
      this.createRental()
      return
    }

    this.updateRental()
  }

  createRental(): void {
    delete this.rental['id']
    this.rentalService.createRental(this.rental).subscribe(
      data => {
        this.location.back()
      }
    )
  }

  updateRental(): void {
    this.rentalService.updateRental(this.rental).subscribe(
      data => {
        this.location.back()
      }
    )
  }

  deleteRental(): void {
    this.rentalService.deleteRental(this.rental.id).subscribe(
      response => {
        this.location.back()
      }
    )
  }

  fetchCustomers(): void {
    this.customerService.getAllCustomers().subscribe(
      data => {
        this.customers = data
        this.filteredCustomers.next(this.customers.slice())

        this.customerFilterControl.valueChanges
          .pipe(takeUntil(this._onDestroy))
          .subscribe(() => {
            this.filterCustomers();
          });
      }
    )
  }

  fetchStockItemsInInventory(): void {
    this.stockItemService.getAllStockItemsInInventory().subscribe(
      data => {
        this.stockItems = data
        this.filteredStockItems.next(this.stockItems.slice())

        this.stockItemFilterControl.valueChanges
          .pipe(takeUntil(this._onDestroy))
          .subscribe(() => {
            this.filterStockItems();
          });
      }
    )
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  filterCustomers() {
    if (!this.customers) {
      return;
    }
    
    let search = this.customerFilterControl.value;
    if (!search) {
      this.filteredCustomers.next(this.customers.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    
    this.filteredCustomers.next(
      this.customers.filter(customer => customer.companyName.toLowerCase().indexOf(search) > -1)
    );
  }

  filterStockItems() {
    if (!this.stockItems) {
      return;
    }
    
    let search = this.stockItemFilterControl.value;
    if (!search) {
      this.filteredStockItems.next(this.stockItems.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    
    this.filteredStockItems.next(
      this.stockItems.filter(stockItem => stockItem.productModel.name.toLowerCase().indexOf(search) > -1)
    );
  }

  durationRadioChange(event : MatRadioChange) {
    this.durationMode = event.value;

    switch (this.durationMode) {
      case "2":
        if (this.rental.startDate != null) {
          this.rental.endDate = new Date()
          this.rental.endDate.setDate(this.rental.startDate.getDate() + 15)
        }
        break
      case "3":
        if (this.rental.startDate != null) {
          this.rental.endDate = new Date()
          this.rental.endDate.setDate(this.rental.startDate.getDate() + 30)
        }
        break
    }
  }

  stockItemSelectChange(stockItems : StockItem[]) {
    this.rental.stockItems = stockItems

    this.fillTotalValue(stockItems)
  }

  stockItemValueChange(value : number, currentStockItem : StockItem) {
    let newStockItems : StockItem[] = this.rental.stockItems

    for (let i = 0; i < newStockItems.length; i++) {
      if (newStockItems[i].id === currentStockItem.id) {
        newStockItems[i].productModel.standardRentalValue = value
      }
    }

    this.fillTotalValue(newStockItems)
  }

  startDateChange(startDate : Date)  {
    this.rental.startDate = startDate

    if (this.durationMode === "1") {
      return
    }

    this.rental.endDate = new Date()
    this.rental.endDate.setDate(startDate.getDate() + ((this.durationMode === "2") ? 15 : 30))
  }

  fillTotalValue(stockItems : StockItem[]) {
    let totalValue = 0
    let stockItem : StockItem
    
    for (stockItem of stockItems) {
      totalValue = totalValue + stockItem.productModel.standardRentalValue
    }

    this.rental.totalValue = totalValue
  }
}
