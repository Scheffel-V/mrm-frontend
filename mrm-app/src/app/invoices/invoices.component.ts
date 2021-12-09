import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Rental } from '../models/rental.model'
import { Location } from '@angular/common';
import { RentalService } from '../services/rental.service'
import { ScriptsService } from 'src/app/services/scripts.service';
import { BaseComponent } from 'src/app/base/base.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog'
import { InvoiceComponent } from '../models-components/invoice/invoice.component';
import { ContractPDFService } from '../services/contract-pdf.service';
import { Additive } from '../models/additive.model';
import { AdditiveService } from '../services/additive.service';
import { AdditiveInvoiceComponent } from '../models-components/additive-invoice/additive-invoice.component';
import { AuthService } from '../services/auth.service';


class RentalToDisplay {
  constructor(
    public isAdditive : boolean,
    public rental : Rental,
    public additive : Additive,
    public additiveNumber : number = 0,
    public invoiceNumber : number,
    public invoiceCost : string,
    public invoiceStartDate : Date,
    public invoiceEndDate : Date,
    public invoicePeriod : number,
    public invoiceStatus : string = null,
    public progressIndicatorValue : number = null,
    public progressIndicatorColor : string = "warn",
    public trashButtonColor : string = "basic",
    public infoButtonColor : string = "basic"
  ) { }
}

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.scss']
})
export class InvoicesComponent extends BaseComponent implements OnInit, AfterViewInit {

  rentalsToDisplay : RentalToDisplay[] = []
  rentals : Rental[] = []
  public displayedColumns = ['actions', 'invoice', 'invoiceNumber', 'contract', 'additiveNumber', 'customer', 'totalValue', 'startDate', 'endDate', 'period', 'progress'];
  public dataSource = new MatTableDataSource<RentalToDisplay>();
  showOnlyActive : boolean = true
  message : string
  saveButtonColor = "primary"
  deleteSelectedButtonColor = "basic"
  topRentalsButtonColor = "basic"
  exportButtonColor = "basic"
  rentalStatusSelectValue = ""
  invoiceStatusSelectValue = ""
  searchBarValue = ""
  selectedInvoiceStatusValue = "PENDING"

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  public constructor(
    private rentalService : RentalService,
    private additiveService : AdditiveService,
    private activatedRoute : ActivatedRoute,
    scriptsService : ScriptsService,
    private matDialog : MatDialog,
    router : Router,
    location : Location,
    matSnackBar : MatSnackBar,
    private contractPDFService : ContractPDFService,
    authService: AuthService
  ) {
    super(scriptsService, location, router, matSnackBar, authService)
   }

  public ngOnInit(): void {
    this.rentalService.getAllActiveRentals().subscribe(
      data => {
        this.rentals = data
        this.rentals = this.rentals.reverse()
        this.setRentalsPeriods()
        this.setOverdueInvoices()
        this.prepareRentalsCurrenciesToDisplay()
        this.displayRentals(this.rentals)
        this.invoiceStatusSelectValue = 'PENDING'.trim().toLocaleLowerCase()
        this.dataSource.filter = this.invoiceStatusSelectValue
      }
    )
  }

  public ngAfterViewInit(): void {
    this.setPaginator()
    this.setSorter()
    this.setFilter()
  }

  exportContract(rentalId: number): void {
    this.contractPDFService.generateContract(rentalId);
  }

  prepareRentalsCurrenciesToDisplay() {
    this.rentals.forEach((rental) => {
      this.prepareCurrenciesToDisplay(rental)
    })
  }

  prepareCurrenciesToDisplay(rental) {
    rental.value = this.prepareCurrencyToDisplay(rental.value)
  }

  prepareCurrencyToDisplay(value : any) : string {
    return (typeof(value) === "string") ? value : value.toString().replace(".", ",")
  }

  private setRentalsPeriods() {
    let rental : Rental
    let additive : Additive

    for (rental of this.rentals) {
      rental.startDate = new Date(rental.startDate)
      rental.endDate = new Date(rental.endDate)
      rental.period = Math.ceil(Math.abs(rental.endDate.getTime() - rental.startDate.getTime()) / (1000 * 60 * 60 * 24))
      rental.paymentDueDate = rental.paymentDueDate ? new Date(rental.paymentDueDate) : null
      rental.paidAt = rental.paidAt ? new Date(rental.paidAt) : null

      for (additive of rental.additives) {
        additive.startDate = new Date(additive.startDate)
        additive.endDate = new Date(additive.endDate)
        additive.period = Math.ceil(Math.abs(additive.endDate.getTime() - additive.startDate.getTime()) / (1000 * 60 * 60 * 24))
        additive.paymentDueDate = additive.paymentDueDate ? new Date(additive.paymentDueDate) : null
        additive.paidAt = additive.paidAt ? new Date(additive.paidAt) : null
      }
    }
  }

  setOverdueInvoices() {
    this.rentals.forEach((rental) => {
      if (rental.invoiceStatus == "INVOICED" && (new Date() > rental.paymentDueDate)) {
        rental.invoiceStatus = "OVERDUE"
        this.rentalService.updateRental(rental).subscribe()
      }

      rental.additives.forEach(additive => {
        if (additive.invoiceStatus == "INVOICED" && (new Date() > additive.paymentDueDate)) {
          additive.invoiceStatus = "OVERDUE"
          this.additiveService.updateAdditive(additive).subscribe()
        }
      })
    })
  }

  private setPaginator() {
    this.dataSource.paginator = this.paginator
  }

  private setSorter() {
    this.dataSource.sort = this.sort
    this.dataSource.sortingDataAccessor = (item, property) => {
      if (property === 'customer') {
        return item['rental']['customer']['name']
      }

      return item[property]
    }
  }

  private setFilter() {
    this.dataSource.filterPredicate = (data, filter: string)  => {
      const accumulator = (currentTerm, key) => {
        return key === 'rental' ? currentTerm + data.rental.customer.name + data.rental.invoiceNumber + data.rental.status : currentTerm + data[key];
      };
      const dataStr = Object.keys(data).reduce(accumulator, '').toLowerCase();
      const transformedFilter = filter.trim().toLowerCase();
      return dataStr.indexOf(transformedFilter) !== -1;
    };
  }

  public updateRental(selectedRentalId : number): void {
    this.router.navigate(['rentals', selectedRentalId])
  }

  public deleteRental(selectedRentalId : number): void {
    let rental = this.getRental(selectedRentalId)
    if (rental.active) {
      rental.active = false
      this.prepareCurrenciesToSaveRental(rental)
      this.rentalService.updateRental(rental).subscribe(
        data => {
          this.openSnackBar("Locação posta como inativa.")
          this.refreshRentals()
        }
      )

      return
    }

    this.rentalService.deleteRental(selectedRentalId).subscribe(
      response => {
        this.openSnackBar("Locação deletada.")
        this.refreshRentals()
      }
    )
  }

  public refreshRentals(): void {
    this.rentalService.getAllActiveRentals().subscribe(
      data => {
        this.rentals = data
        this.setRentalsPeriods()
        this.displayRentals(this.rentals);
      }
    )
  }

  public displayRentals(rentals : Rental[]): void {
    this.rentalsToDisplay = []
    let additiveNumber = 0

    rentals.forEach((rental) => {
      additiveNumber = 0
      this.rentalsToDisplay.push(
        new RentalToDisplay(false, rental, null, 0, rental.invoiceNumber, rental.value, rental.startDate, rental.endDate, rental.period, rental.invoiceStatus, this.getRentalProgressIndicatorValue(rental), this.getRentalProgressIndicatorColor(rental))
      )

      rental.additives.forEach(additive => {
        additiveNumber = additiveNumber + 1
        this.rentalsToDisplay.push(
          new RentalToDisplay(true, rental, additive, additiveNumber, additive.invoiceNumber, additive.value, additive.startDate, additive.endDate, additive.period, additive.invoiceStatus, this.getAdditiveProgressIndicatorValue(additive), this.getAdditiveProgressIndicatorColor(additive))
        )
      })
    })
    this.dataSource.data = this.rentalsToDisplay
  }

  public getRental(rentalId : number) {
    let rentals = this.rentalsToDisplay.filter((rentalToDisplay => rentalToDisplay.rental.id === rentalId))
    return rentals.length > 0 ? rentals[0].rental : null
  }

  public doFilter(value : string) {
    this.searchBarValue = value.trim().toLocaleLowerCase()
    this.dataSource.filter = this.searchBarValue + this.invoiceStatusSelectValue
  }

  public doFilterForInvoiceStatus(value : string) {
    this.invoiceStatusSelectValue = value ? value.trim().toLocaleLowerCase() : ""
    this.dataSource.filter = this.invoiceStatusSelectValue + this.searchBarValue
  }

  getRentalProgressIndicatorValue(rental : Rental) {
    return new Date().getTime() <= rental.startDate.getTime() ? 
      0 : Math.ceil(((Math.ceil(Math.abs(new Date().getTime() - rental.startDate.getTime()) / (1000 * 60 * 60 * 24))) / rental.period) * 100)
  }

  getRentalProgressIndicatorColor(rental : Rental) {
    return (this.getRentalProgressIndicatorValue(rental) >= 75) ? "warn" : "primary"
  }

  getAdditiveProgressIndicatorValue(additive : Additive) {
    return new Date().getTime() <= additive.startDate.getTime() ? 
      0 : Math.ceil(((Math.ceil(Math.abs(new Date().getTime() - additive.startDate.getTime()) / (1000 * 60 * 60 * 24))) / additive.period) * 100)
  }

  getAdditiveProgressIndicatorColor(additive : Additive) {
    return (this.getAdditiveProgressIndicatorValue(additive) >= 75) ? "warn" : "primary"
  }

  isInvoiceOverdue(rental : Rental) {
    return rental.paymentDueDate ? new Date().getTime() > rental.paymentDueDate.getTime() : false
  } 

  isAdditiveInvoiceOverdue(additive : Additive) {
    return additive.paymentDueDate ? new Date().getTime() > additive.paymentDueDate.getTime() : false
  } 

  public openInvoice(rentalId : number, additive : Additive) : void {
    const dialogConfig = new MatDialogConfig()
    dialogConfig.disableClose = true
    dialogConfig.autoFocus = false
    dialogConfig.width = "60%"

    if (additive === undefined || additive === null) {
      dialogConfig.data = {
        rental : this.getRental(rentalId),
        additive : null
      }
      this.matDialog.open(InvoiceComponent, dialogConfig).afterClosed().subscribe(
        data => {
          this.prepareRentalsCurrenciesToDisplay()
        }
      )
    } else {
      dialogConfig.data = {
        additive : additive
      }
      this.matDialog.open(AdditiveInvoiceComponent, dialogConfig)
    }
  }

  prepareCurrenciesToSaveRental(rental) {
    rental.value = this.prepareCurrencyForOperations(rental.value)
  }

  prepareCurrencyForOperations(value : any) : number {
    return (typeof(value) === "number") ? value : +(value.replace(".", "").replace(",", "."))
  }

  spinnerValue(value) {
    return value + "%";
  }

  payInvoice(rentalId : number, additive : Additive) {
    if (additive !== undefined || additive !== null) {
      this.payAdditiveInvoice(additive)
      return
    }

    let rental = this.getRental(rentalId)

    rental.paidAt = new Date()
    rental.invoiceStatus = "PAID"
    this.prepareCurrenciesToSaveRental(rental)

    this.rentalService.updateRental(rental).subscribe(
      data => {
        rental = data
        this.openSnackBar("Invoice paid!")
        this.prepareRentalsCurrenciesToDisplay()
      }
    )
  }

  payAdditiveInvoice(additive : Additive) {
    additive.paidAt = new Date()
    additive.invoiceStatus = "PAID"

    this.additiveService.updateAdditive(additive).subscribe(
      data => {
        this.refreshRentals()
        this.openSnackBar("Invoice paid!")
      }
    )
  }
}

