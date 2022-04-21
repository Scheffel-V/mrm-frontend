import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Rental } from '../../models/rental.model'
import { Location } from '@angular/common';
import { RentalService } from '../../services/rental.service'
import { CustomerService } from '../../services/customer.service'
import { StockItemService } from '../../services/stock-item.service'
import { ItemRentalService } from '../../services/item-rental.service'
import { RENTAL_ID_PARAM , INITIAL_ID } from '../../app.constants'
import { BaseComponent } from 'src/app/base/base.component';
import { ScriptsService } from 'src/app/services/scripts.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Customer } from '../../models/customer.model';
import { StockItem } from '../../models/stock-item.model';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatSelect } from '@angular/material/select';
import { MatRadioChange } from '@angular/material/radio';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ItemRental } from '../../models/item-rental.model';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from '../../services/auth.service';


class ItemRentalToDisplay {
  constructor(
    public checked : boolean,
    public itemRental : ItemRental,
    public trashButtonColor : string = "basic",
    public infoButtonColor : string = "basic"
  ) { }
}

@Component({
  selector: 'app-rental',
  templateUrl: './rental.component.html',
  styleUrls: ['./rental.component.scss']
})
export class RentalComponent extends BaseComponent implements OnInit {

  id : number
  rental : Rental = new Rental(-1, null, null, [], [])
  rentalForm : FormGroup
  customers : Customer[] = []
  stockItems : StockItem[] = []
  selectedStockItems : StockItem[] = []
  durationMode : string = "CUSTOM"
  isPeriodEditable = false
  displayedColumns = ['actions', 'name', 'status', 'type', 'power', 'value']
  historyTableDisplayedColumns = ['name', 'status', 'type', 'leftAt', 'returnedAt', 'value']
  totalValueWithAdditives : any = 0
  public dataSource = new MatTableDataSource<ItemRentalToDisplay>();
  public historyTableDataSource = new MatTableDataSource<ItemRentalToDisplay>();
  historyItemRentalsToDisplay : ItemRentalToDisplay[] = []
  itemRentalsToDisplay : ItemRentalToDisplay[] = []
  itemRentalsSelectedToRemove : ItemRental[] = []
  alreadyRentedItemRentalsInInventory : ItemRental[] = []

  customerSelectControl : FormControl = new FormControl(this.rental.customerId, [Validators.required])
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
    private itemRentalService : ItemRentalService,
    private activatedRoute : ActivatedRoute,
    scriptsService : ScriptsService,
    location : Location,
    router : Router,
    matSnackBar : MatSnackBar,
    authService: AuthService
  ) { 
    super(scriptsService, location, router, matSnackBar, authService)
  }

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.params[RENTAL_ID_PARAM]
    this.rental = new Rental(this.id, null, null, [], [])

    if (this.id != INITIAL_ID) {
      this.fetchRental()
    }

    this.fetchCustomers()
  }

  fetchRental(): void {
    this.rentalService.getRental(this.id).subscribe(
      data => {
        this.rental = data
        this.rental.startDate = new Date(this.rental.startDate)
        this.rental.endDate = new Date(this.rental.endDate)
        this.rental.approvalDate = this.rental.approvalDate == null ? null : new Date(this.rental.approvalDate)
        this.rental.paymentDueDate = this.rental.paymentDueDate == null ? null : new Date(this.rental.paymentDueDate)
        this.rental.paidAt = this.rental.paidAt == null ? null : new Date(this.rental.paidAt)
        this.rental.invoicedAt = this.rental.invoicedAt == null ? null : new Date(this.rental.invoicedAt)
        this.setTotalValueWithAdditives()
        this.prepareCurrenciesToDisplay()
        this.updatePeriod()
        this.customerSelectControl.setValue(this.rental.customer.id)
        this.alreadyRentedItemRentalsInInventory = this.getAlreadyRentedItemRentalsInInventory()
        this.stockItemSelectControl.setValue(this.getStockItemsIdsFromItemRentals(this.getActualItemRentals(this.rental.itemRentals)))
        this.displayItemRentals(this.rental.itemRentals)
        this.displayItemRentalsHistory(this.rental.itemRentals)
        this.fetchStockItemsInInventory()
      }
    )
  }

  saveRental(): void {
    this.prepareCurrenciesToSaveRental()

    this.itemRentalsSelectedToRemove.forEach(itemRentalToRemove => {
      this.itemRentalService.deleteItemRental(itemRentalToRemove.id).subscribe()
      this.stockItemService.updateStockItem(itemRentalToRemove.stockItem).subscribe()
    })

    if (this.id == INITIAL_ID) {
      this.createRental()
      return
    }

    this.updateRental()
  }

  createRental(): void {
    this.removeIdFromItemsRentals()
    this.rentalService.createRental(this.rental).subscribe(
      data => {
        this.listRentals()
      }
    )
  }

  updateRental(): void {
    this.updateItemRentals()
    this.updatePaidAt()
    this.rentalService.updateRental(this.rental).subscribe(
      data => {
        this.listRentals()
      }
    )
  }

  deleteRental(): void {
    this.rentalService.deleteRental(this.rental.id).subscribe(
      response => {
        this.listRentals()
      }
    )
  }

  updateItemRentals(): void {
    let newItemRentals = this.getNewItemRentals()
    let oldItemRentals = this.getOldItemRentals()

    oldItemRentals.forEach(
      (itemRental) => {
        if (this.isItemRentalAlreadyRentedInThePast(itemRental)) {
          this.stockItemService.updateStockItem(itemRental.stockItem).subscribe()
        }
        this.itemRentalService.updateItemRental(itemRental).subscribe()
    })

    newItemRentals.forEach(
      (itemRental) => {
        this.itemRentalService.createItemRental(itemRental).subscribe()
    })
  }

  updatePaidAt(): void {
    if (this.rental.invoiceStatus !== "PAID") {
      this.rental.paidAt = null
    }
  }

  getNewItemRentals(): ItemRental[] {
    return this.rental.itemRentals.filter(itemRental => {
      return this.stockItems.map(({ id }) => id).indexOf(itemRental.id) !== -1
    })
  }

  getOldItemRentals(): ItemRental[] {
    return this.rental.itemRentals.filter(itemRental => {
      return this.stockItems.map(({ id }) => id).indexOf(itemRental.id) === -1
    })
  }

  setTotalValueWithAdditives() {
    this.totalValueWithAdditives = this.rental.value

    this.rental.additives.forEach(additive => {
      this.totalValueWithAdditives += additive.value
    })
  }

  prepareCurrenciesToSaveRental() {
    this.rental.value = this.prepareCurrencyForOperations(this.rental.value)
    this.rental.itemRentals.forEach((itemRental) => {
      itemRental.value = this.prepareCurrencyForOperations(itemRental.value)
    })
    this.rental.deliveryCost = this.prepareCurrencyForOperations(this.rental.deliveryCost)
    this.rental.laborAndDisplacementPrice = this.prepareCurrencyForOperations(this.rental.laborAndDisplacementPrice)    
  }

  prepareCurrenciesToDisplay() {
    this.rental.value = this.prepareCurrencyToDisplay(this.rental.value)
    this.rental.itemRentals.forEach((itemRental) => {
      itemRental.value = this.prepareCurrencyToDisplay(itemRental.value)
    })
    this.totalValueWithAdditives = this.prepareCurrencyToDisplay(this.totalValueWithAdditives)
    this.rental.deliveryCost = this.prepareCurrencyToDisplay(this.rental.deliveryCost)
    this.rental.laborAndDisplacementPrice = this.prepareCurrencyToDisplay(this.rental.laborAndDisplacementPrice)
  }

  removeIdFromItemsRentals(): void {
    let itemRental : ItemRental
    
    for (itemRental of this.rental.itemRentals) {
      delete itemRental['id']
    }
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
    this.stockItemService.getAllStockItems().subscribe(
      data => {
        this.stockItems = this.removeDuplicateStockItems(this.getStockItemsInInventory(data))
        this.filteredStockItems.next(this.stockItems.slice())

        this.stockItemFilterControl.valueChanges
          .pipe(takeUntil(this._onDestroy))
          .subscribe(() => {
            this.filterStockItems();
          });
      }
    )
  }

  getStockItemsInInventory(stockItems : StockItem[]) {
    return stockItems.filter(stockItem =>
      stockItem.status === "INVENTORY")
  }

  removeDuplicateStockItems(stockItems) {
    let test = stockItems.filter(stockItem => 
      !(this.getStockItemsIdsFromItemRentals(this.getActualItemRentals(this.rental.itemRentals)).includes(stockItem.id))
    )

    return test
  }

  public getActualItemRentals(itemRentals : ItemRental[]) {
    let actualItemRentals = itemRentals.filter(itemRental => 
      itemRental.returnedAt === null
    )
    return actualItemRentals
  }

  getStockItemsIdsFromItemRentals(itemRentals : ItemRental[]) {
    return itemRentals.map(({ stockItem }) => stockItem ? stockItem.id : null);
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
      case "CUSTOM":
        this.isPeriodEditable = true
        break
      case "15DAYS":
        this.isPeriodEditable = false
        if (this.rental.startDate != null) {
          this.rental.endDate = new Date(this.rental.startDate)
          this.rental.endDate.setDate(this.rental.startDate.getDate() + 15)
        }
        break
      case "30DAYS":
        this.isPeriodEditable = false
        if (this.rental.startDate != null) {
          this.rental.endDate = new Date(this.rental.startDate)
          this.rental.endDate.setDate(this.rental.startDate.getDate() + 30)
        }
        break
    }

    this.updatePeriod()
  }

  stockItemSelectChange(stockItemsIds : number[]) {
    let newItemRentals = this.createItemRentalsFromStockItemsIds(stockItemsIds)

    this.itemRentalsSelectedToRemove.forEach(itemRentalToRemove => {
      if (newItemRentals.find(itemRental => {
        return itemRental.stockItem.id === itemRentalToRemove.stockItem.id
      })) {
        if (itemRentalToRemove.stockItem.status === 'INVENTORY') {
          itemRentalToRemove.stockItem.status = 'RENTED'
          this.stockItems = this.stockItems.filter(stockItem => stockItem.id !== itemRentalToRemove.stockItem.id)
        }
    
        this.itemRentalsSelectedToRemove = this.itemRentalsSelectedToRemove.filter(itemRentalToRemoveAux => itemRentalToRemoveAux.stockItem.id !== itemRentalToRemove.stockItem.id)
        this.rental.itemRentals.push(itemRentalToRemove)
        newItemRentals = newItemRentals.filter(itemRental => itemRental.stockItem.id !== itemRentalToRemove.stockItem.id)
        this.stockItemSelectControl.setValue(this.getStockItemsIdsFromItemRentals(this.rental.itemRentals))
        this.filterStockItems()
      }
   })

    this.rental.itemRentals = this.joinNewAndOldItemRentals(newItemRentals)
    this.displayItemRentals(this.rental.itemRentals)
    this.fillTotalValue()
  }

  joinNewAndOldItemRentals(newItemRentals : ItemRental[]) : ItemRental[] {
    let oldItemRentals : ItemRental[] = this.rental.itemRentals.filter(itemRental => {
      return this.stockItems.map(({ id }) => id).indexOf(itemRental.id) === -1
    })

    return oldItemRentals.concat(newItemRentals)
  }

  itemRentalValueChange(value : string, currentItemRental : ItemRental) {
    for (let i = 0; i < this.rental.itemRentals.length; i++) {
      if (this.rental.itemRentals[i].id === currentItemRental.id) {
        this.rental.itemRentals[i].value = this.formatCurrency(value)
      }
    }

    this.fillTotalValue()
  }

  shippingCostChange(value : string) {
    this.rental.deliveryCost = this.formatCurrency(value)
    this.fillTotalValue()
  }

  laborAndDisplacementPriceChange(value : string) {
    this.rental.laborAndDisplacementPrice = this.formatCurrency(value)
    this.fillTotalValue()
  }

  startDateChange(startDate : Date)  {
    this.rental.startDate = startDate

    if (this.durationMode === "CUSTOM") {
      this.updatePeriod()
      return
    }

    this.rental.endDate = new Date(startDate)
    this.rental.endDate.setDate(startDate.getDate() + ((this.durationMode === "2") ? 15 : 30))
    this.updatePeriod()
  }

  endDateChange(endDate : Date) {
    this.rental.endDate = endDate

    if (this.durationMode === "CUSTOM") {
      this.updatePeriod()
      return
    }

    this.rental.startDate = new Date(endDate)
    this.rental.startDate.setDate(endDate.getDate() - ((this.durationMode === "2") ? 15 : 30))
    this.updatePeriod()
  }

  updatePeriod(): void {
    if (this.rental.endDate && this.rental.startDate) {
      this.rental.period = Math.ceil(Math.abs(this.rental.endDate.getTime() - this.rental.startDate.getTime()) / (1000 * 60 * 60 * 24))
    }
  }

  fillTotalValue() {
    let totalValue = 0
    let itemRental : ItemRental
    
    for (itemRental of this.getActualItemRentals(this.rental.itemRentals)) {
      totalValue = totalValue + this.prepareCurrencyForOperations(itemRental.value)
    }

    totalValue = totalValue 
      + (this.rental.deliveryCost ? this.prepareCurrencyForOperations(this.rental.deliveryCost) : 0)
      + (this.rental.laborAndDisplacementPrice ? this.prepareCurrencyForOperations(this.rental.laborAndDisplacementPrice) : 0)

    this.rental.value = this.prepareCurrencyToDisplay(Math.round(totalValue * 100) / 100)
  }

  createItemRentalsFromStockItemsIds(stockItemsIds : number[]) {
    let itemRentals = []
    let stockItem : StockItem

    for (stockItem of this.stockItems) {
      if (stockItemsIds.find(id => id === stockItem.id)) {
        itemRentals.push(this.createItemRentalOrReturnExisting(stockItem))
      }
    }

    return itemRentals
  }

  createItemRentalOrReturnExisting(stockItem : StockItem) : ItemRental {
    let itemRental = this.findItemRentalById(stockItem.id)
    return itemRental ? itemRental : new ItemRental(stockItem.id, null, null, this.prepareCurrencyToDisplay(stockItem.rentValue), stockItem, stockItem.id, this.id, "")
  }

  findItemRentalById(itemRentalId : number) : ItemRental {
    let itemRental : ItemRental

    for (itemRental of this.rental.itemRentals) {
      if (itemRental.id === itemRentalId) {
        return itemRental
      }
    }

    return null
  }

  formatCurrency(value : string) : string {
    return typeof(value) === "number" ? value : value.replace(".", ",")
  }

  prepareCurrencyToDisplay(value : any) : string {
    if (value == null) {
      return null
    }

    return typeof(value) === "string" ? value : value.toString().replace(".", ",")
  }

  prepareCurrencyForOperations(value : any) : number {
    if (!value) {
      return 0
    }

    if (typeof(value) === "number") {
      return value
    }

    return (value.match(/,/g) || []).length == 0 ? +value : +(value.replace(".", "").replace(",", "."))
  }

  removeStockItemFromRental(itemRental : ItemRental) {
    itemRental.stockItem.status = 'INVENTORY'
    this.stockItems.push(itemRental.stockItem)
    this.itemRentalsSelectedToRemove.push(itemRental)
    
    this.rental.itemRentals = this.rental.itemRentals.filter(itemRentalAux => itemRentalAux.id !== itemRental.id)
    this.displayItemRentals(this.rental.itemRentals)
    this.stockItemSelectControl.setValue(this.getStockItemsIdsFromItemRentals(this.rental.itemRentals))
    this.filterStockItems()
    this.fillTotalValue()
  }
  
  public displayItemRentals(itemRentals : ItemRental[]): void {
    this.itemRentalsToDisplay = []
    itemRentals.forEach((itemRental) => {
      if (itemRental.returnedAt === null) {
        this.itemRentalsToDisplay.push(
          new ItemRentalToDisplay(false, itemRental)
        )
      }
    })
    this.dataSource.data = this.itemRentalsToDisplay
  }

  public displayItemRentalsHistory(itemRentals : ItemRental[]) : void {
    this.historyItemRentalsToDisplay = []
    itemRentals.forEach((itemRental) => {
      if (itemRental.returnedAt) {
        this.historyItemRentalsToDisplay.push(
          new ItemRentalToDisplay(false, itemRental)
        )
      }
    })
    this.historyTableDataSource.data = this.historyItemRentalsToDisplay
  }

  public filterActiveCustomers(customers : Customer[]) {
    return customers.filter((customer => customer.active === true))
  }

  public workingHoursChanged(event) {
    if (!event.value) {
      this.rental.workingHours = "";
      return;
    }

    this.rental.workingHours = event.value;
  }

  public getAlreadyRentedItemRentalsInInventory() : ItemRental[] {
    return this.rental.itemRentals.filter(itemRental =>
      itemRental.stockItem.status === 'INVENTORY'
    )
  }

  public isItemRentalAlreadyRentedInThePast(itemRental) : boolean {
    return this.alreadyRentedItemRentalsInInventory.filter(alreadyRentedItemRental => 
      alreadyRentedItemRental.id === itemRental.id
    ).length !== 0
  }
}
