import { Component, OnInit, Inject } from '@angular/core'
import { MatDialogRef } from '@angular/material/dialog'
import { RentalService } from '../../services/rental.service'
import { Rental } from '../../models/rental.model'
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ScriptsService } from 'src/app/services/scripts.service';
import { BaseComponent } from 'src/app/base/base.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InvoicePdfService } from '../../services/invoicePdf.service';
import { Additive } from '../../models/additive.model';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent extends BaseComponent implements OnInit {
  rental : Rental
  additive : Additive

  constructor(
    @Inject(MAT_DIALOG_DATA) public data : any,
    private rentalService : RentalService,
    public dialogRef : MatDialogRef<InvoiceComponent>,
    scriptsService : ScriptsService,
    router : Router,
    location : Location,
    matSnackBar : MatSnackBar,
    private invoicePdfService : InvoicePdfService,
    authService: AuthService
  ) { 
    super(scriptsService, location, router, matSnackBar, authService)
  }

  ngOnInit(): void {
    this.rental = this.data.rental
    this.additive = this.data.additive
    this.rental.installments = this.rental.installments.toString()
    this.prepareCurrenciesToDisplay()
  }

  close(invoiced) : void {
    this.dialogRef.close(invoiced)
  }

  saveRental() : void {
    this.rental.invoiceStatus = "INVOICED"
    this.rental.invoicedAt = this.rental.invoicedAt === null ? new Date() : this.rental.invoicedAt
    this.prepareCurrenciesToSaveInvoice()
    this.rentalService.updateRental(this.rental).subscribe(
      data => {
        this.rental.invoiceNumber = data.invoiceNumber
        this.prepareCurrenciesToDisplay()
        this.close(true)
      }
    )
  }

  prepareCurrenciesToDisplay() {
    this.rental.value = this.prepareCurrencyToDisplay(this.rental.value)
  }

  prepareCurrencyToDisplay(value : any) : string {
    return (typeof(value) === "string") ? value : value.toString().replace(".", ",")
  }

  prepareCurrenciesToSaveInvoice() {
    this.rental.value = this.prepareCurrencyForOperations(this.rental.value)
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

  onCancel() : void {
    this.close(false)
  }

  onExport(invoiceId: number) : void {
    this.rental.invoiceStatus = "INVOICED"
    this.rental.invoicedAt = this.rental.invoicedAt === null ? new Date() : this.rental.invoicedAt
    this.prepareCurrenciesToSaveInvoice()
    this.rentalService.updateRental(this.rental).subscribe(
      data => {
        this.rental.invoiceNumber = data.invoiceNumber
        this.invoicePdfService.generateInvoicePdfByRental(invoiceId)
        this.prepareCurrenciesToDisplay()
      }
    )
  }
}
