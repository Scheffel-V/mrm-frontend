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
import {ContractPDFService} from "../../services/contract-pdf.service";


@Component({
  selector: 'app-create-rental',
  templateUrl: './create-rental.component.html',
  styleUrls: ['./create-rental.component.scss']
})
export class CreateRentalComponent extends BaseComponent implements OnInit {

  id : number
  rental : Rental = new Rental(-1, null, null, [], [])
  rentalForm : FormGroup
  customers : Customer[] = []
  stockItems : StockItem[] = []
  selectedStockItems : StockItem[] = []
  durationMode : string = "CUSTOM"
  isPeriodEditable = false
  displayedColumns = ['name', 'status', 'type', 'power', 'value']
  public dataSource = new MatTableDataSource<ItemRental>();

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
    authService: AuthService,
    private contractPDFService: ContractPDFService
  ) {
    super(scriptsService, location, router, matSnackBar, authService)
  }

  ngOnInit(): void {
    this.id = -1
    this.rental = new Rental(this.id, null, null, [], [])

    this.fetchCustomers()
    this.fetchStockItemsInInventory()
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
        this.prepareCurrenciesToDisplay()
        this.updatePeriod()
        this.customerSelectControl.setValue(this.rental.customer.id)
        this.stockItemSelectControl.setValue(this.getStockItemsIdsFromItemRentals(this.rental.itemRentals))
        this.dataSource.data = this.rental.itemRentals
      }
    )
  }

  saveRental(): void {
    this.prepareCurrenciesToSaveRental()
    if (this.id == INITIAL_ID) {
      this.createRental()
      return
    }

    this.updateRental()
  }

  createRental(): void {
    this.removeIdFromItemsRentals()
    this.rentalService.createRental(this.rental).subscribe(
      rental => {
        this.openSnackBar("Locação criada!")
        this.addFirstPdfContractHistory(rental);
        this.listRentals()
      }
    )
  }

  updateRental(): void {
    this.updateItemRentals()
    this.rentalService.updateRental(this.rental).subscribe(
      data => {
        this.openSnackBar("Locação atualizada!")
        this.listRentals()
      }
    )
  }

  deleteRental(): void {
    this.rentalService.deleteRental(this.rental.id).subscribe(
      response => {
        this.openSnackBar("Locação deletada.")
        this.listRentals()
      }
    )
  }

  updateItemRentals(): void {
    this.rental.itemRentals.forEach(
      (itemRental) => {
        this.itemRentalService.updateItemRental(itemRental).subscribe()
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
    this.stockItemService.getAllStockItemsInInventory().subscribe(
      data => {
        this.stockItems = this.getStockItemsInInventory(data)
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
      stockItem.status === "INVENTORY" || stockItem.status === "READY_FOR_RENTAL")
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
    this.rental.itemRentals = this.createItemRentalsFromStockItemsIds(stockItemsIds)
    this.dataSource.data = this.rental.itemRentals
    this.fillTotalValue()
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
    this.rental.period = Math.ceil(Math.abs(this.rental.endDate.getTime() - this.rental.startDate.getTime()) / (1000 * 60 * 60 * 24))
  }

  fillTotalValue() {
    let totalValue = 0
    let itemRental : ItemRental

    for (itemRental of this.rental.itemRentals) {
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
    return value ? ((typeof(value) === "string") ? value : value.toString().replace(".", ",")) : null
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

  public async addFirstPdfContractHistory(rental: Rental) {
      const builder = await this.contractPDFService.getContractBlob(rental.id);
      builder.getBlob((blob) => {
        this.contractPDFService.uploadPdfContract(rental.id, blob).subscribe();
      });
  }
}
