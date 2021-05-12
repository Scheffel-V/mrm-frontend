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
import { takeUntil } from 'rxjs/operators';
import { MatSelect } from '@angular/material/select';
import { MatRadioChange } from '@angular/material/radio';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ItemRental } from '../../models/item-rental.model';



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
  selectedStockItems : StockItem[] = []
  durationMode : string = "1"

  customerSelectControl : FormControl = new FormControl()
  customerFilterControl : FormControl = new FormControl()
  filteredCustomers : ReplaySubject<Customer[]> = new ReplaySubject<Customer[]>(1)
  protected _onDestroy = new Subject<void>();
  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;

  stockItemSelectControl : FormControl = new FormControl()
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
    router : Router,
    matSnackBar : MatSnackBar
  ) { 
    super(scriptsService, location, router, matSnackBar)
  }

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.params[RENTAL_ID_PARAM]
    this.rental = new Rental(this.id, null, null, [], [])

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
        this.customerSelectControl.setValue(this.rental.customer.id)
        this.stockItemSelectControl.setValue(this.getStockItemsIdsFromItemRentals(this.rental.itemRentals))
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
    this.rental.customerId = this.rental.customer.id
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
        this.customers = this.filterActiveCustomers(data)
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

  getStockItemsIdsFromItemRentals(itemRentals : ItemRental[]) {
    return itemRentals.map(({ stockItem }) => stockItem.id);
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
      this.customers.filter(customer => customer.name.toLowerCase().indexOf(search) > -1)
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
      this.stockItems.filter(stockItem => stockItem.name.toLowerCase().indexOf(search) > -1)
    );
  }

  durationRadioChange(event : MatRadioChange) {
    this.durationMode = event.value;

    switch (this.durationMode) {
      case "2":
        if (this.rental.startDate != null) {
          this.rental.endDate = new Date(this.rental.startDate)
          this.rental.endDate.setDate(this.rental.startDate.getDate() + 14)
        }
        break
      case "3":
        if (this.rental.startDate != null) {
          this.rental.endDate = new Date(this.rental.startDate)
          this.rental.endDate.setDate(this.rental.startDate.getDate() + 29)
        }
        break
    }
  }

  stockItemSelectChange(stockItemsIds : number[]) {
    this.rental.itemRentals = this.createItemRentalsFromStockItemsIds(stockItemsIds)
    this.fillTotalValue(this.rental.itemRentals)
  }

  itemRentalValueChange(value : number, currentItemRental : ItemRental) {
    let newItems : ItemRental[] = this.rental.itemRentals

    for (let i = 0; i < newItems.length; i++) {
      if (newItems[i].id === currentItemRental.id) {
        newItems[i].value = value
      }
    }

    this.fillTotalValue(newItems)
  }

  startDateChange(startDate : Date)  {
    this.rental.startDate = startDate

    if (this.durationMode === "1") {
      return
    }

    this.rental.endDate = new Date(startDate)
    this.rental.endDate.setDate(startDate.getDate() + ((this.durationMode === "2") ? 14 : 29))
  }

  fillTotalValue(items : ItemRental[]) {
    let totalValue = 0
    let itemRental : ItemRental
    
    for (itemRental of items) {
      totalValue = totalValue + (+itemRental.value)
    }

    this.rental.value = totalValue
  }

  createItemRentalsFromStockItemsIds(stockItemsIds : number[]) {
    let itemRentals = []
    let stockItem : StockItem

    for (stockItem of this.stockItems) {
      if (stockItemsIds.find(id => id === stockItem.id)) {
        itemRentals.push(new ItemRental(stockItem.id, null, null, stockItem.rentValue, stockItem, stockItem.id, this.id, ""))
      }
    }

    return itemRentals
  }

  public filterActiveCustomers(customers : Customer[]) {
    return customers.filter((customer => customer.active === true))
  }
}
