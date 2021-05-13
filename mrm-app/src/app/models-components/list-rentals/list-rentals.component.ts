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


class RentalToDisplay {
  constructor(
    public checked : boolean,
    public rental : Rental,
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
  public displayedColumns = ['select', 'actions', 'status', 'customer', 'period', 'startDate', 'endDate', 'fiscalNote', 'totalValue'];
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
    router : Router,
    location : Location,
    matSnackBar : MatSnackBar
  ) {
    super(scriptsService, location, router, matSnackBar)
   }

  public ngOnInit(): void {
    this.rentalService.getAllRentals().subscribe(
      data => {
        this.rentals = data
        this.setRentalsPeriods()
        this.displayRentals(this.rentals)
      }
    )
  }

  public ngAfterViewInit(): void {
    this.setPaginator()
    this.setSorter()
    this.setFilter()
  }

  private setRentalsPeriods() {
    let rental : Rental

    for (rental of this.rentals) {
      rental.startDate = new Date(rental.startDate)
      rental.endDate = new Date(rental.endDate)
      rental.period = rental.endDate.getDate() - rental.startDate.getDate() + 1
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
        return key === 'rental' ? currentTerm + data.rental.customer.name + data.rental.fiscalNote + data.rental.status : currentTerm + data[key];
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
      this.rentalService.updateRental(rental).subscribe(
        data => {
          this.openSnackBar("Rental set to inactive.")
          this.refreshRentals()
        }
      )

      return
    }

    this.rentalService.deleteRental(rental.id).subscribe(
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
        if (selectedRental.rental.active) {
          selectedRental.rental.active = false
          this.rentalService.updateRental(selectedRental.rental).subscribe(
            () => {
              if (index === array.length -1) resolve(true);
            }
          )
        } else {
          this.rentalService.deleteRental(selectedRental.rental.id).subscribe(
            () => {
              if (index === array.length -1) resolve(true);
            }
          )
        }
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
        this.displayRentals(this.filterActiveRentals());
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
    this.dataSource.data = this.rentalsToDisplay
  }

  public getRental(rentalId : number) {
    let rentals = this.rentalsToDisplay.filter((rentalToDisplay => rentalToDisplay.rental.id === rentalId))
    return rentals.length > 0 ? rentals[0].rental : null
  }

  public filterActiveRentals() {
    return this.showOnlyActive ? this.rentals.filter((rental => rental.active === this.showOnlyActive)) : this.rentals
  }

  public doFilter(value : string) {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  public showOnlyActiveToggleChange(event : MatSlideToggleChange) {
    this.showOnlyActive = event.checked
    this.displayRentals(this.filterActiveRentals())
  }
}

