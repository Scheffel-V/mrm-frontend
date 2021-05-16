import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Rental } from '../../models/rental.model'
import { Location } from '@angular/common';
import { RentalService } from '../../services/rental.service'
import { ScriptsService } from 'src/app/services/scripts.service';
import { BaseComponent } from 'src/app/base/base.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog'
import { InvoiceComponent } from '../invoice/invoice.component';
import { ContractPDFService } from '../../services/contract-pdf.service';


class RentalToDisplay {
  constructor(
    public checked : boolean,
    public rental : Rental,
    public invoiceValue : string = null,
    public progressIndicatorValue : number = null,
    public progressIndicatorColor : string = "warn",
    public trashButtonColor : string = "basic",
    public infoButtonColor : string = "basic"
  ) { }
}

@Component({
  selector: 'app-list-rentals',
  templateUrl: './list-rentals.component.html',
  styleUrls: ['./list-rentals.component.scss']
})
export class ListRentalsComponent extends BaseComponent implements OnInit, AfterViewInit {

  rentalsToDisplay : RentalToDisplay[] = []
  rentals : Rental[] = []
  public displayedColumns = ['select', 'actions', 'status', 'invoice', 'customer', 'period', 'startDate', 'endDate', 'progress', 'totalValue'];
  public dataSource = new MatTableDataSource<RentalToDisplay>();
  showOnlyActive : boolean = true
  message : string
  saveButtonColor = "primary"
  deleteSelectedButtonColor = "basic"
  topRentalsButtonColor = "basic"
  exportButtonColor = "basic"

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  public constructor(
    private rentalService : RentalService,
    private activatedRoute : ActivatedRoute,
    scriptsService : ScriptsService,
    private matDialog : MatDialog,
    router : Router,
    location : Location,
    matSnackBar : MatSnackBar,
    private contractPDFService : ContractPDFService
  ) {
    super(scriptsService, location, router, matSnackBar)
   }

  public ngOnInit(): void {
    this.rentalService.getAllRentals().subscribe(
      data => {
        this.rentals = data
        this.setRentalsPeriods()
        this.prepareRentalsCurrenciesToDisplay()
        this.displayRentals(this.rentals)
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

    for (rental of this.rentals) {
      rental.startDate = new Date(rental.startDate)
      rental.endDate = new Date(rental.endDate)
      rental.period = Math.ceil(Math.abs(rental.endDate.getTime() - rental.startDate.getTime()) / (1000 * 60 * 60 * 24))
      rental.paymentDueDate = rental.paymentDueDate ? new Date(rental.paymentDueDate) : null
      rental.paidAt = rental.paidAt ? new Date(rental.paidAt) : null
    }
  }

  private setPaginator() {
    this.dataSource.paginator = this.paginator;
  }

  private setSorter() {
    this.dataSource.sortingDataAccessor = (item, property) => {
      return item['rental'][property]
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
    this.rentalService.deleteRental(selectedRentalId).subscribe(
      response => {
        this.openSnackBar("Rental deleted.")
        this.refreshRentals()
      }
    )
  }

  public deleteSelectedRentals(): void {
    new Promise((resolve) => {
     this.rentalsToDisplay
      .filter(rentalToDisplay => rentalToDisplay.checked)
      .forEach((selectedRental, index, array) => {
          this.rentalService.deleteRental(selectedRental.rental.id).subscribe(
            () => {
              if (index === array.length -1) resolve(true);
            }
          )
      })
    }).then(() => {
      this.openSnackBar("Rentals deleted.")
      this.refreshRentals()
    });
  }

  public refreshRentals(): void {
    this.rentalService.getAllRentals().subscribe(
      data => {
        this.rentals = data
        this.setRentalsPeriods()
        this.displayRentals(this.filterActiveRentals());
      }
    )
  }

  public displayRentals(rentals : Rental[]): void {
    this.rentalsToDisplay = []
    rentals.forEach((rental) => {
      this.rentalsToDisplay.push(
        new RentalToDisplay(false, rental, this.getRentalInvoiceValue(rental), this.getRentalProgressIndicatorValue(rental), this.getRentalProgressIndicatorColor(rental))
      )
    })
    this.dataSource.data = this.rentalsToDisplay
  }

  public getRental(rentalId : number) {
    let rentals = this.rentalsToDisplay.filter((rentalToDisplay => rentalToDisplay.rental.id === rentalId))
    return rentals.length > 0 ? rentals[0].rental : null
  }

  public filterActiveRentals() {
    return this.showOnlyActive ? this.rentals : this.rentals
  }

  public doFilter(value : string) {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  getRentalProgressIndicatorValue(rental : Rental) {
    return new Date().getTime() <= rental.startDate.getTime() ? 
      0 : Math.ceil(((Math.ceil(Math.abs(new Date().getTime() - rental.startDate.getTime()) / (1000 * 60 * 60 * 24))) / rental.period) * 100)
  }

  getRentalProgressIndicatorColor(rental : Rental) {
    return (this.getRentalProgressIndicatorValue(rental) >= 75) ? "warn" : "primary"
  }

  getRentalInvoiceValue(rental : Rental) : string {
    if(rental.paidAt) {
      return "paid"
    }

    if (!rental.paymentDueDate) {
      return "notInvoiced"
    }

    if (!rental.paidAt) {
      if (this.isInvoiceOverdue(rental)) {
        return "overdue"
      }

      return "invoiced"
    }

    return "paid"
  }

  isInvoiceOverdue(rental : Rental) {
    return rental.paymentDueDate ? new Date().getTime() > rental.paymentDueDate.getTime() : false
  } 

  public showOnlyActiveToggleChange(event : MatSlideToggleChange) {
    this.showOnlyActive = event.checked
    this.displayRentals(this.filterActiveRentals())
  }

  public openInvoice(rentalId : number) : void {
    const dialogConfig = new MatDialogConfig()
    dialogConfig.disableClose = true
    dialogConfig.autoFocus = false
    dialogConfig.width = "60%"
    dialogConfig.data = {
      dataKey : this.getRental(rentalId)
    }
    this.matDialog.open(InvoiceComponent, dialogConfig)
  }

  spinnerValue(value) {
    return value + "%";
  }
}

