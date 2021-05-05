import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Rental } from '../../models/rental.model'
import { Location } from '@angular/common';
import { RentalService } from '../../services/rental.service'
import { ScriptsService } from 'src/app/services/scripts.service';
import { BaseComponent } from 'src/app/base/base.component';
import { MatSnackBar } from '@angular/material/snack-bar';

const scripts = [
  "../../assets/js/demo/datatables-demo.js"
]

class RentalToDisplay {
  constructor(
    public checked : boolean,
    public rental : Rental
  ) { }
}

@Component({
  selector: 'app-list-rentals',
  templateUrl: './list-rentals.component.html',
  styleUrls: ['./list-rentals.component.scss']
})
export class ListRentalsComponent extends BaseComponent implements OnInit {

  rentalsToDisplay : RentalToDisplay[] = []
  message : string

  public constructor(
    private rentalService : RentalService,
    private activatedRoute : ActivatedRoute,
    scriptService : ScriptsService,
    router : Router,
    location : Location,
    matSnackBar : MatSnackBar
  ) {
    super(scriptService, location, router, matSnackBar)
   }

   public ngOnInit(): void {
    this.rentalService.getAllRentals().subscribe(
      data => {
        this.displayRentals(data)
      }
    )
  }

  public ngAfterContentInit(): void {
    this.loadScripts(scripts)
  }

  public updateRental(selectedRentalId : number): void {
    this.router.navigate(['rentals', selectedRentalId])
  }

  public deleteRental(selectedRentalId : number): void {
    this.rentalService.deleteRental(selectedRentalId).subscribe(
      () => {
        this.message = `Deleted rental!`
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
          this.message = `Deleted!`
          if (index === array.length -1) resolve(true);
        })
      })
    }).then(() => {
      this.refreshRentals()
    });
  }

  public refreshRentals(): void {
    this.rentalService.getAllRentals().subscribe(
      data => {
        this.displayRentals(data);
      }
    )
  }

  public displayRentals(rentals : Rental[]): void {
    this.rentalsToDisplay = []
    rentals.forEach((rental) => {
      this.rentalsToDisplay.push(
        new RentalToDisplay(false, rental)
      )
    })
  }
}

