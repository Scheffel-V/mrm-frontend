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
    private invoicePdfService : InvoicePdfService
  ) { 
    super(scriptsService, location, router, matSnackBar)
  }

  ngOnInit(): void {
    this.rental = this.data.rental
    this.additive = this.data.additive
    this.rental.installments = this.rental.installments.toString()
    this.prepareCurrenciesToDisplay()
  }

  close() : void {
    this.dialogRef.close()
  }

  saveRental() : void {
    this.rental.invoiceStatus = "INVOICED"
    this.prepareCurrenciesToSaveInvoice()
    this.rentalService.updateRental(this.rental).subscribe(
      data => {
        this.close()
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
    this.rental.value = (typeof(this.rental.value) === "number") ? this.rental.value : +(this.rental.value.replace(",", "."))
  }

  prepareCurrencyForOperations(value : any) : number {
    return (typeof(value) === "number") ? value : +(value.replace(".", "").replace(",", "."))
  }

  onCancel() : void {
    this.close()
  }

  onExport(invoiceId: number) : void {
    this.rental.invoiceStatus = "INVOICED"
    this.prepareCurrenciesToSaveInvoice()
    this.rentalService.updateRental(this.rental).subscribe(
      data => {
        this.invoicePdfService.generateInvoicePdfByRental(invoiceId)
      }
    )
  }
}
