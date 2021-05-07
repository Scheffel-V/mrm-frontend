import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { StockItem } from '../../models/stock-item.model'
import { Location } from '@angular/common';
import { StockItemService } from '../../services/stock-item.service'
import { ScriptsService } from 'src/app/services/scripts.service';
import { BaseComponent } from 'src/app/base/base.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';


class StockItemToDisplay {
  constructor(
    public checked : boolean,
    public stockItem : StockItem,
    public trashButtonColor : string = "basic",
    public infoButtonColor : string = "basic"
  ) { }
}

@Component({
  selector: 'app-list-stock-items',
  templateUrl: './list-stock-items.component.html',
  styleUrls: ['./list-stock-items.component.scss']
})
export class ListStockItemsComponent extends BaseComponent implements OnInit, AfterViewInit {

  stockItemsToDisplay : StockItemToDisplay[] = []
  stockItems : StockItem[] = []
  public displayedColumns = ['select', 'actions', 'name', 'type', 'power', 'model', 'active'];
  public dataSource = new MatTableDataSource<StockItemToDisplay>();
  showOnlyActive : boolean = true
  message : string
  saveButtonColor = "primary"
  deleteSelectedButtonColor = "basic"
  topStockItemsButtonColor = "basic"
  exportButtonColor = "basic"

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  public constructor(
    private stockItemService : StockItemService,
    private activatedRoute : ActivatedRoute,
    scriptsService : ScriptsService,
    router : Router,
    location : Location,
    matSnackBar : MatSnackBar
  ) {
    super(scriptsService, location, router, matSnackBar)
   }

  public ngOnInit(): void {
    this.stockItemService.getAllStockItems().subscribe(
      data => {
        this.stockItems = data
        this.displayStockItems(data)
      }
    )
  }

  public ngAfterViewInit(): void {
    this.setPaginator()
    this.setSorter()
    this.setFilter()
  }

  private setPaginator() {
    this.dataSource.paginator = this.paginator;
  }

  private setSorter() {
    this.dataSource.sortingDataAccessor = (item, property) => {
      return item['stockItem'][property]
    }
  }

  private setFilter() {
    this.dataSource.filterPredicate = (data, filter: string)  => {
      const accumulator = (currentTerm, key) => {
        return key === 'stockItem' ? currentTerm + data.stockItem.productModel.name + data.stockItem.productModel.type + data.stockItem.productModel.model + data.stockItem.productModel.brand + + data.stockItem.productModel.power : currentTerm + data[key];
      };
      const dataStr = Object.keys(data).reduce(accumulator, '').toLowerCase();
      const transformedFilter = filter.trim().toLowerCase();
      return dataStr.indexOf(transformedFilter) !== -1;
    };
  }

  public updateStockItem(selectedStockItemId : number): void {
    this.router.navigate(['stockItems', selectedStockItemId])
  }

  public deleteStockItem(selectedStockItemId : number): void {
    let stockItem = this.getStockItem(selectedStockItemId)
    if (stockItem.active) {
      stockItem.active = false
      this.stockItemService.updateStockItem(stockItem).subscribe(
        data => {
          this.openSnackBar("StockItem set to inactive.")
          this.refreshStockItems()
        }
      )

      return
    }

    this.stockItemService.deleteStockItem(stockItem.id).subscribe(
      response => {
        this.openSnackBar("StockItem deleted.")
        this.refreshStockItems()
      }
    )
  }

  public deleteSelectedStockItems(): void {
    new Promise((resolve) => {
     this.stockItemsToDisplay
      .filter(stockItemToDisplay => stockItemToDisplay.checked)
      .forEach((selectedStockItem, index, array) => {
        if (selectedStockItem.stockItem.active) {
          selectedStockItem.stockItem.active = false
          this.stockItemService.updateStockItem(selectedStockItem.stockItem).subscribe(
            () => {
              if (index === array.length -1) resolve(true);
            }
          )
        } else {
          this.stockItemService.deleteStockItem(selectedStockItem.stockItem.id).subscribe(
            () => {
              if (index === array.length -1) resolve(true);
            }
          )
        }
      })
    }).then(() => {
      this.openSnackBar("StockItems deleted.")
      this.refreshStockItems()
    });
  }

  public refreshStockItems(): void {
    this.stockItemService.getAllStockItems().subscribe(
      data => {
        this.stockItems = data
        this.displayStockItems(data);
      }
    )
  }

  public displayStockItems(stockItems : StockItem[]): void {
    this.stockItemsToDisplay = []
    stockItems.forEach((stockItem) => {
      this.stockItemsToDisplay.push(
        new StockItemToDisplay(false, stockItem)
      )
    })
    this.dataSource.data = this.stockItemsToDisplay
  }

  public getStockItem(stockItemId : number) {
    let stockItems = this.stockItemsToDisplay.filter((stockItemToDisplay => stockItemToDisplay.stockItem.id === stockItemId))
    return stockItems.length > 0 ? stockItems[0].stockItem : null
  }

  public filterActiveStockItems() {
    return this.showOnlyActive ? this.stockItems.filter((stockItem => stockItem.active === this.showOnlyActive)) : this.stockItems
  }

  public doFilter(value : string) {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  public showOnlyActiveToggleChange(event : MatSlideToggleChange) {
    this.showOnlyActive = event.checked
    this.displayStockItems(this.filterActiveStockItems())
  }
}

