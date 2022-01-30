import { Component, OnInit } from '@angular/core';
import { StockItem } from '../models/stock-item.model';
import { MatTableDataSource } from '@angular/material/table';
import { StockItemService } from '../services/stock-item.service';
import { ImageService } from '../services/image.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ScriptsService } from 'src/app/services/scripts.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BaseComponent } from 'src/app/base/base.component';
import { Rental } from '../models/rental.model';
import { RentalService } from '../services/rental.service';
import { AuthService } from '../services/auth.service';


class StockItemToDisplay {
  constructor(
    public checked : boolean,
    public stockItem : StockItem,
    public image: any,
    public customerName : string = "",
    public customerId : string = "",
    public rentalId : string = "",
    public trashButtonColor : string = "basic",
    public infoButtonColor : string = "basic"
  ) { }
}

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent extends BaseComponent implements OnInit {

  stockItemsToDisplay : StockItemToDisplay[] = []
  stockItemsToDisplayHash : {}
  stockItems : StockItem[] = []
  public dataSource = new MatTableDataSource<StockItemToDisplay>()
  imageToShow: any;
  isImageLoading: boolean
  showOnlyActive = true
  breakpoint: number;
  stockItemStatusSelectValue: any = "";
  searchBarValue: any = "";

  constructor(
    private stockItemService : StockItemService,
    private rentalService : RentalService,
    private imageService : ImageService,
    scriptsService : ScriptsService,
    router : Router,
    location : Location,
    matSnackBar : MatSnackBar,
    authService: AuthService
  ) {
    super(scriptsService, location, router, matSnackBar, authService)
   }

  ngOnInit(): void {
    this.breakpoint = (window.innerWidth <= 400) ? 1 : 4
    this.stockItemService.getAllStockItems().subscribe(
      data => {
        this.stockItems = data
        this.stockItems = this.stockItems.reverse()
        this.displayStockItems(this.filterActiveStockItems())
        this.setCustomersToStockItems()
      }
    )
  }

  public ngAfterViewInit(): void {
    this.setFilter()
  }

  private setFilter() {
    this.dataSource.filterPredicate = (data, filter: string)  => {
      const accumulator = (currentTerm, key) => {
        if (key === 'checked' || key === 'image') {
          return currentTerm
        }

        return key === 'stockItem' ? currentTerm + data.stockItem.name + data.stockItem.code + data.stockItem.model + data.stockItem.power + data.stockItem.status : currentTerm;
      };
      const dataStr = Object.keys(data).reduce(accumulator, '').toLowerCase();
      const transformedFilter = filter.trim().toLowerCase();
      return dataStr.indexOf(transformedFilter) !== -1;
    };
  }

  public doFilter(value : string) {
    this.searchBarValue = value.trim().toLocaleLowerCase()
    this.dataSource.filter = this.searchBarValue + this.stockItemStatusSelectValue
  }

  public doFilterForStockItemStatus(value : string) {
    this.stockItemStatusSelectValue = value ? value.trim().toLocaleLowerCase() : ""
    this.dataSource.filter = this.stockItemStatusSelectValue + this.searchBarValue
  }

  setCustomersToStockItems() {
    this.rentalService.getAllActiveRentals().subscribe(data => {
      let rentals : Rental[] = data
      rentals.forEach(rental => {
        rental.itemRentals.forEach(itemRental => {
          this.updateStockItemToDisplayList(itemRental.stockItemId, rental.customer, rental.id)
        })
      })
    })
  }

  public displayStockItems(stockItems : StockItem[]): void {
    this.stockItemsToDisplay = []
    stockItems.forEach((stockItem) => {
      this.getImageFromService(stockItem)
      this.stockItemsToDisplay.push(
        new StockItemToDisplay(false, stockItem, null)
      )
      this.dataSource.data = this.stockItemsToDisplay
    })
  }

  public filterActiveStockItems() {
    return this.showOnlyActive ? this.stockItems.filter((stockItem => stockItem.active === this.showOnlyActive)) : this.stockItems
  }

  getImageFromService(stockItem) {
    this.isImageLoading = true;
    this.imageService.getImage(stockItem.id).subscribe(data => {
      this.createImageFromBlob(data, stockItem);
      this.isImageLoading = false;
    }, error => {
      this.isImageLoading = false;
      console.log(error);
    });
  }

  createImageFromBlob(image: Blob, stockItem) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
        stockItem.imageURL = reader.result
        this.updateStockItemList(stockItem)
    }, false);
 
    if (image) {
       reader.readAsDataURL(image);
    }
 }

 updateStockItemList(stockItem: StockItem) {
  this.stockItemsToDisplay.forEach(stockItemToDisplay => {
    if (stockItemToDisplay.stockItem.id === stockItem.id) {
      stockItemToDisplay.image = stockItem.imageURL
    }
  })
  this.dataSource.data = this.stockItemsToDisplay
 }

 updateStockItemToDisplayList(stockItemId, customer, rentalId) {
  this.stockItemsToDisplay.forEach(stockItemToDisplay => {
    if (stockItemToDisplay.stockItem.id === stockItemId) {
      stockItemToDisplay.customerName = customer.name
      stockItemToDisplay.customerId = customer.id
      stockItemToDisplay.rentalId = rentalId
    }
  })
  this.dataSource.data = this.stockItemsToDisplay
 }

  public trackItem (index: number, stockItemToDisplay: StockItemToDisplay) {
    return `${index}-${stockItemToDisplay.stockItem.id}`;
  }

  onResize(event) {
    this.breakpoint = (event.target.innerWidth <= 400) ? 1 : 4;
  }

  seeStockItem(stockItemId : number) {
    this.router.navigate(['stockItems', stockItemId])
  }

  seeRental(stockItemToDisplay : StockItemToDisplay) {
    if (!(stockItemToDisplay.stockItem.status === 'MAINTENANCE' || stockItemToDisplay.stockItem.status === 'INVENTORY')) {
      this.router.navigate(['rentals', stockItemToDisplay.rentalId])
    }
  }

  seeCustomer(stockItemToDisplay : StockItemToDisplay) {
    if (!(stockItemToDisplay.stockItem.status === 'MAINTENANCE' || stockItemToDisplay.stockItem.status === 'INVENTORY')) {
      this.router.navigate(['customers', stockItemToDisplay.customerId])
    }
  }
}
