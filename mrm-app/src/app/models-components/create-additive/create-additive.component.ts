import { Component, OnInit, Inject } from '@angular/core'
import { MatDialogRef } from '@angular/material/dialog'
import { Rental } from '../../models/rental.model'
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ScriptsService } from 'src/app/services/scripts.service';
import { BaseComponent } from 'src/app/base/base.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatRadioChange } from '@angular/material/radio';
import { Additive } from '../../models/additive.model';
import { AdditiveService } from '../../services/additive.service';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-create-additive',
  templateUrl: './create-additive.component.html',
  styleUrls: ['./create-additive.component.scss']
})
export class CreateAdditiveComponent extends BaseComponent implements OnInit {
  rental : Rental
  additive : Additive = new Additive(-1)
  durationMode : string = "CUSTOM"
  isPeriodEditable = false


  constructor(
    @Inject(MAT_DIALOG_DATA) public data : any,
    private additiveService : AdditiveService,
    public dialogRef : MatDialogRef<CreateAdditiveComponent>,
    scriptsService : ScriptsService,
    router : Router,
    location : Location,
    matSnackBar : MatSnackBar,
    authService: AuthService
  ) { 
    super(scriptsService, location, router, matSnackBar, authService)
  }

  ngOnInit(): void {
    this.rental = this.data.dataKey
    let mostRecentAdditive = this.getMostRecentAdditive(this.rental.additives)
    this.additive.startDate = new Date(mostRecentAdditive ? mostRecentAdditive.endDate : this.rental.endDate)
    this.additive.endDate = new Date(mostRecentAdditive ? mostRecentAdditive.endDate : this.rental.endDate)
    this.additive.endDate.setDate(this.additive.endDate.getDate() + this.rental.period)
    this.additive.value = this.rental.value - (this.rental.deliveryCost ? this.rental.deliveryCost : 0) - (this.rental.laborAndDisplacementPrice ? this.rental.laborAndDisplacementPrice : 0)
    this.prepareCurrenciesToDisplay()
    this.additive.period = this.rental.period
  }

  close() : void {
    this.dialogRef.close()
  }

  saveRental() : void {
    this.additive.value = this.prepareCurrenciesToSaveAdditive(this.additive.value)
    this.additive.rentContractId = this.rental.id
    this.additiveService.createAdditive(this.additive).subscribe(
      data => {
        this.close()
      }
    )
  }

  onCancel() : void {
    this.close()
  }

  durationRadioChange(event : MatRadioChange) {
    this.durationMode = event.value;

    switch (this.durationMode) {
      case "CUSTOM":
        this.isPeriodEditable = true
        break
      case "15DAYS":
        this.isPeriodEditable = false
        if (this.additive.startDate != null) {
          this.additive.endDate = new Date(this.additive.startDate)
          this.additive.endDate.setDate(this.additive.startDate.getDate() + 15)
        }
        break
      case "30DAYS":
        this.isPeriodEditable = false
        if (this.additive.startDate != null) {
          this.additive.endDate = new Date(this.additive.startDate)
          this.additive.endDate.setDate(this.additive.startDate.getDate() + 30)
        }
        break
    }

    this.updatePeriod()
  }

  prepareCurrenciesToSaveAdditive(value : any) {
    if (typeof(value) === "number") {
      return value
    }

    return (value.match(/,/g) || []).length == 0 ? +value : +(value.replace(".", "").replace(",", "."))
  }

  prepareCurrenciesToDisplay() {
    this.additive.value = this.prepareCurrencyToDisplay(this.additive.value)
  }

  startDateChange(startDate : Date)  {
    this.additive.startDate = startDate

    if (this.durationMode === "CUSTOM") {
      this.updatePeriod()
      return
    }

    this.additive.endDate = new Date(startDate)
    this.additive.endDate.setDate(startDate.getDate() + ((this.durationMode === "2") ? 15 : 30))
    this.updatePeriod()
  }

  endDateChange(endDate : Date) {
    this.additive.endDate = endDate

    if (this.durationMode === "CUSTOM") {
      this.updatePeriod()
      return
    }

    this.additive.startDate = new Date(endDate)
    this.additive.startDate.setDate(endDate.getDate() - ((this.durationMode === "2") ? 15 : 30))
    this.updatePeriod()
  }

  updatePeriod(): void {
    if (this.additive.endDate && this.additive.startDate) {
      this.additive.period = Math.ceil(Math.abs(this.additive.endDate.getTime() - this.additive.startDate.getTime()) / (1000 * 60 * 60 * 24))
    }
  }

  formatCurrency(value : string) : string {
    return value.replace(".", ",")
  }

  prepareCurrencyToDisplay(value : any) : string {
    return value ? ((typeof(value) === "string") ? value : value.toString().replace(".", ",")) : null
  }

  prepareCurrencyForOperations(value : any) : number {
    return (typeof(value) === "number") ? value : +(value.replace(".", "").replace(",", "."))
  }

  getMostRecentAdditive(additives : Additive[]) {
    if (!additives || additives.length === 0) {
      return null
    }

    let mostRecentAdditive : Additive = additives[0]
    additives.forEach((additive) => {
      if (additive.endDate > mostRecentAdditive.endDate) {
        mostRecentAdditive = additive
      }
    })

    return mostRecentAdditive
  }
}
