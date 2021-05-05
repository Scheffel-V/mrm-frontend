import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { StockItem } from '../../models/stock-item.model'
import { Location } from '@angular/common';
import { StockItemService } from '../../services/stock-item.service'
import { ScriptsService } from 'src/app/services/scripts.service';
import { BaseComponent } from 'src/app/base/base.component';
import { MatSnackBar } from '@angular/material/snack-bar';

const scripts = [
  "../../assets/js/demo/listStockItemsDataTable.js"
]

declare  var $:any;

class StockItemToDisplay {
  constructor(
    public checked : boolean,
    public stockItem : StockItem
  ) { }
}

@Component({
  selector: 'app-list-stock-items',
  templateUrl: './list-stock-items.component.html',
  styleUrls: ['./list-stock-items.component.scss']
})
export class ListStockItemsComponent extends BaseComponent implements OnInit {

  stockItemsToDisplay : StockItemToDisplay[] = []
  message : string

  public constructor(
    private stockItemService : StockItemService,
    private activatedRoute : ActivatedRoute,
    scriptService : ScriptsService,
    router : Router,
    location : Location,
    matSnackBar : MatSnackBar
  ) {
    super(scriptService, location, router, matSnackBar)
   }

   public ngOnInit(): void {
    this.stockItemService.getAllStockItems().subscribe(
      data => {
        this.displayStockItems(data)
      }
    )
  }

  public ngAfterViewInit(): void {
    this.loadStockItemsTableScript(scripts)
  }

  private loadStockItemsTableScript(scripts) {
    $(document).ready(function() {
      console.log(1)
      var listStockItemsDataTable = $('#listStockItemsDataTable').DataTable( {
        "order": [[ 2, "asc" ]]
      });
    
      console.log(2)
      $('#listStockItemsDataTable tbody').on( 'mouseenter', 'td', function () {
          var colIdx = listStockItemsDataTable.cell(this).index().column;
          var rowIdx = listStockItemsDataTable.cell(this).index().row;
    
          $( listStockItemsDataTable.cells().nodes() ).removeClass( 'highlight' );
          $( listStockItemsDataTable.rows().nodes() ).removeClass( 'highlight' );
          $( listStockItemsDataTable.column( colIdx ).nodes() ).addClass( 'highlight' );
          $( listStockItemsDataTable.row( rowIdx ).nodes() ).addClass( 'highlight' );
      } );
      console.log(3)
    });
  }

  public updateStockItem(selectedStockItemId : number): void {
    this.router.navigate(['stockItems', selectedStockItemId])
  }

  public deleteStockItem(selectedStockItemId : number): void {
    this.stockItemService.deleteStockItem(selectedStockItemId).subscribe(
      () => {
        this.message = `Deleted StockItem!`
        this.refreshStockItems()
      }
    )
  }

  public deleteSelectedStockItems(): void {
    new Promise((resolve) => {
     this.stockItemsToDisplay
      .filter(StockItemToDisplay => StockItemToDisplay.checked)
      .forEach((selectedStockItem, index, array) => {
        this.stockItemService.deleteStockItem(selectedStockItem.stockItem.id).subscribe(
        () => {
          this.message = `Deleted!`
          if (index === array.length -1) resolve(true);
        })
      })
    }).then(() => {
      this.refreshStockItems()
    });
  }

  public refreshStockItems(): void {
    this.stockItemService.getAllStockItems().subscribe(
      data => {
        this.displayStockItems(data);
      }
    )
  }

  public displayStockItems(StockItems : StockItem[]): void {
    this.stockItemsToDisplay = []
    StockItems.forEach((StockItem) => {
      this.stockItemsToDisplay.push(
        new StockItemToDisplay(false, StockItem)
      )
    })
  }

}
