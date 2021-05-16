import { Component, OnInit, Inject } from '@angular/core'
import { MatDialogRef } from '@angular/material/dialog'
import { RentalService } from '../../services/rental.service'
import { Rental } from '../../models/rental.model'
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ScriptsService } from 'src/app/services/scripts.service';
import { BaseComponent } from 'src/app/base/base.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog'
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InvoicePdfService } from '../../services/invoicePdf.service';


@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent extends BaseComponent implements OnInit {
  rental : Rental

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
    this.rental = this.data.dataKey
    this.rental.invoiceNumber = "1"
  }

  close() : void {
    this.dialogRef.close()
  }

  saveRental() : void {
    this.rentalService.updateRental(this.rental).subscribe(
      data => {
        this.close()
      }
    )
  }

  onCancel() : void {
    this.close()
  }

  onExport(invoiceId: number) : void {
    this.invoicePdfService.generateInvoicePdf(invoiceId);
  }
}
