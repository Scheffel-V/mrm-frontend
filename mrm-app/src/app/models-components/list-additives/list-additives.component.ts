import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Additive } from '../../models/additive.model'
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
import { AdditiveInvoiceComponent } from '../additive-invoice/additive-invoice.component';
import { Rental } from '../../models/rental.model';
import { RENTAL_ID_PARAM } from '../../app.constants';
import { CreateAdditiveComponent } from '../create-additive/create-additive.component';
import { AdditiveService } from '../../services/additive.service';


class AdditiveToDisplay {
  constructor(
    public checked : boolean,
    public additive : Additive,
    public invoiceValue : string = null,
    public progressIndicatorValue : number = null,
    public progressIndicatorColor : string = "warn",
    public trashButtonColor : string = "basic",
    public infoButtonColor : string = "basic"
  ) { }
}

@Component({
  selector: 'app-list-additives',
  templateUrl: './list-additives.component.html',
  styleUrls: ['./list-additives.component.scss']
})
export class ListAdditivesComponent extends BaseComponent implements OnInit, AfterViewInit {

  id : number = null
  rental : Rental = null  
  additivesToDisplay : AdditiveToDisplay[] = []
  additives : Additive[] = []
  public displayedColumns = ['select', 'actions', 'status', 'invoice', 'invoiceNumber', 'period', 'startDate', 'endDate', 'progress', 'totalValue'];
  public dataSource = new MatTableDataSource<AdditiveToDisplay>();
  showOnlyActive : boolean = true
  message : string
  saveButtonColor = "primary"
  deleteSelectedButtonColor = "basic"
  topAdditivesButtonColor = "basic"
  exportButtonColor = "basic"

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
    matSnackBar : MatSnackBar
  ) {
    super(scriptsService, location, router, matSnackBar)
   }

  public ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.params[RENTAL_ID_PARAM]
    this.rental = new Rental(this.id, null, null, [], [])
    
    if (this.id.toString() !== "-1") {
      this.fetchRental()
    }
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
        this.setAdditivesPeriods()
        this.setOverdueInvoices()
        this.prepareAdditivesCurrenciesToDisplay()
        this.displayAdditives(this.rental.additives)
      }
    )
  }

  public ngAfterViewInit(): void {
    this.setPaginator()
    this.setSorter()
  }

  prepareAdditivesCurrenciesToDisplay() {
    this.rental.additives.forEach((additive) => {
      this.prepareCurrenciesToDisplay(additive)
    })
  }

  prepareCurrenciesToDisplay(additive) {
    additive.value = this.prepareCurrencyToDisplay(additive.value)
  }

  prepareCurrencyToDisplay(value : any) : string {
    return (typeof(value) === "string") ? value : value.toString().replace(".", ",")
  }

  setAdditivesPeriods() {
    let additive : Additive

    for (additive of this.rental.additives) {
      additive.startDate = new Date(additive.startDate)
      additive.endDate = new Date(additive.endDate)
      additive.period = Math.ceil(Math.abs(additive.endDate.getTime() - additive.startDate.getTime()) / (1000 * 60 * 60 * 24))
      additive.paymentDueDate = additive.paymentDueDate ? new Date(additive.paymentDueDate) : null
      additive.paidAt = additive.paidAt ? new Date(additive.paidAt) : null
    }
  }

  setOverdueInvoices() {
    this.rental.additives.forEach((additive) => {
      if (additive.invoiceStatus == "INVOICED" && (new Date().getTime() > additive.paymentDueDate.getTime())) {
        additive.invoiceStatus = "OVERDUE"
        this.rentalService.updateRental(this.rental).subscribe()
      }
    })
  }

  private setPaginator() {
    this.dataSource.paginator = this.paginator;
  }

  private setSorter() {
    this.dataSource.sortingDataAccessor = (item, property) => {
      return item['additive'][property]
    }
  }

  public updateAdditive(selectedAdditiveId : number): void {
    this.openSnackBar("Not implemented.")
  }

  public deleteAdditive(selectedAdditiveId : number): void {
    this.additiveService.deleteAdditive(selectedAdditiveId).subscribe(
      response => {
        this.openSnackBar("Additive deleted.")
        this.refreshAdditives()
      }
    )
  }

  public deleteSelectedAdditives(): void {
    new Promise((resolve) => {
      this.additivesToDisplay
       .filter(additiveToDisplay => additiveToDisplay.checked)
       .forEach((selectedAdditive, index, array) => {
           this.additiveService.deleteAdditive(selectedAdditive.additive.id).subscribe(
             () => {
               if (index === array.length -1) resolve(true);
             }
           )
       })
     }).then(() => {
       this.openSnackBar("Additives deleted.")
       this.refreshAdditives()
     });
  }

  public refreshAdditives(): void {
    this.rentalService.getRental(this.id).subscribe(
      data => {
        this.rental = data
        this.rental.startDate = new Date(this.rental.startDate)
        this.rental.endDate = new Date(this.rental.endDate)
        this.rental.approvalDate = this.rental.approvalDate == null ? null : new Date(this.rental.approvalDate)
        this.rental.paymentDueDate = this.rental.paymentDueDate == null ? null : new Date(this.rental.paymentDueDate)
        this.rental.paidAt = this.rental.paidAt == null ? null : new Date(this.rental.paidAt)
        this.displayAdditives(this.rental.additives)
        this.prepareAdditivesCurrenciesToDisplay()
      }
    )
  }

  public displayAdditives(additives : Additive[]): void {
    this.additivesToDisplay = []
    additives.forEach((additive) => {
      additive.startDate = new Date(additive.startDate)
      additive.endDate = new Date(additive.endDate)
      additive.approvalDate = additive.approvalDate == null ? null : new Date(additive.approvalDate)
      additive.paymentDueDate = additive.paymentDueDate == null ? null : new Date(additive.paymentDueDate)
      additive.paidAt = additive.paidAt == null ? null : new Date(additive.paidAt)
      this.additivesToDisplay.push(
        new AdditiveToDisplay(false, additive, this.getAdditiveInvoiceValue(additive), this.getAdditiveProgressIndicatorValue(additive), this.getAdditiveProgressIndicatorColor(additive))
      )
    })
    this.dataSource.data = this.additivesToDisplay
  }

  public getAdditive(additiveId : number) {
    let additives = this.additivesToDisplay.filter((additiveToDisplay => additiveToDisplay.additive.id === additiveId))
    return additives.length > 0 ? additives[0].additive : null
  }

  public filterActiveAdditives() {
    return this.showOnlyActive ? this.rental.additives : this.rental.additives
  }

  public doFilter(value : string) {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  getAdditiveProgressIndicatorValue(additive : Additive) {
    return new Date().getTime() <= additive.startDate.getTime() ? 
      0 : Math.ceil(((Math.ceil(Math.abs(new Date().getTime() - additive.startDate.getTime()) / (1000 * 60 * 60 * 24))) / additive.period) * 100)
  }

  getAdditiveProgressIndicatorColor(additive : Additive) {
    return (this.getAdditiveProgressIndicatorValue(additive) >= 75) ? "warn" : "primary"
  }

  getAdditiveInvoiceValue(additive : Additive) : string {
    if(additive.paidAt) {
      return "PAID"
    }

    if (!additive.paymentDueDate) {
      return "PENDING"
    }

    if (!additive.paidAt) {
      if (this.isInvoiceOverdue(additive)) {
        return "OVERDUE"
      }

      return "INVOICED"
    }

    return "PAID"
  }

  isInvoiceOverdue(additive : Additive) {
    return additive.paymentDueDate ? new Date().getTime() > additive.paymentDueDate.getTime() : false
  } 

  public showOnlyActiveToggleChange(event : MatSlideToggleChange) {
    this.showOnlyActive = event.checked
    this.displayAdditives(this.filterActiveAdditives())
  }

  public openInvoice(additiveId : number) : void {
    const dialogConfig = new MatDialogConfig()
    dialogConfig.disableClose = true
    dialogConfig.autoFocus = false
    dialogConfig.width = "60%"
    dialogConfig.data = {
      additive : this.getAdditive(additiveId)
    }
    this.matDialog.open(AdditiveInvoiceComponent, dialogConfig)
  }

  public openCreateAdditive() : void {
    const dialogConfig = new MatDialogConfig()
    dialogConfig.disableClose = true
    dialogConfig.autoFocus = false
    dialogConfig.width = "60%"
    dialogConfig.data = {
      dataKey : this.rental
    }
    this.matDialog.open(CreateAdditiveComponent, dialogConfig).afterClosed().subscribe(
      data => {
        this.refreshAdditives()
      }
    )
  }

  spinnerValue(value) {
    return value + "%";
  }

  payInvoice(additiveId : number) {
    let additive = this.getAdditive(additiveId)

    additive.paidAt = new Date()
    additive.invoiceStatus = "PAID"

    this.additiveService.updateAdditive(additive).subscribe(
      data => {
        this.refreshAdditives()
        this.openSnackBar("Invoice paid!")
      }
    )
  }

  createAdditive() {
    this.openCreateAdditive()
  }
}

