import { Component, OnInit, Inject } from '@angular/core'
import { MatDialogRef } from '@angular/material/dialog'
import { AdditiveService } from '../../services/additive.service'
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ScriptsService } from 'src/app/services/scripts.service';
import { BaseComponent } from 'src/app/base/base.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Additive } from '../../models/additive.model';


@Component({
  selector: 'app-additive-invoice',
  templateUrl: './additive-invoice.component.html',
  styleUrls: ['./additive-invoice.component.scss']
})
export class AdditiveInvoiceComponent extends BaseComponent implements OnInit {
  additive : Additive

  constructor(
    @Inject(MAT_DIALOG_DATA) public data : any,
    private additiveService : AdditiveService,
    public dialogRef : MatDialogRef<AdditiveInvoiceComponent>,
    scriptsService : ScriptsService,
    router : Router,
    location : Location,
    matSnackBar : MatSnackBar
  ) { 
    super(scriptsService, location, router, matSnackBar)
  }

  ngOnInit(): void {
    this.additive = this.data.additive
    this.additive = this.data.additive
    this.additive.installments = this.additive.installments.toString()
    this.prepareCurrenciesToDisplay()
  }

  close() : void {
    this.dialogRef.close()
  }

  saveAdditive() : void {
    this.additive.invoiceStatus = "INVOICED"
    this.prepareCurrenciesToSaveInvoice()
    this.additiveService.updateAdditive(this.additive).subscribe(
      data => {
        this.close()
      }
    )
  }

  prepareCurrenciesToDisplay() {
    this.additive.value = this.prepareCurrencyToDisplay(this.additive.value)
  }

  prepareCurrencyToDisplay(value : any) : string {
    return (typeof(value) === "string") ? value : value.toString().replace(".", ",")
  }

  prepareCurrenciesToSaveInvoice() {
    this.additive.value = (typeof(this.additive.value) === "number") ? this.additive.value : +(this.additive.value.replace(",", "."))
  }

  prepareCurrencyForOperations(value : any) : number {
    return (typeof(value) === "number") ? value : +(value.replace(".", "").replace(",", "."))
  }

  onCancel() : void {
    this.close()
  }
}
