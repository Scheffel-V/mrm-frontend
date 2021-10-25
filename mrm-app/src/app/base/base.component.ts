import { Component, OnInit } from '@angular/core';
import { SELECTED_LANGUAGE, INITIAL_ID } from '../app.constants'
import { TEXTS } from '../ui-texts/texts'
import { ScriptsService } from '../services/scripts.service'
import { Location } from '@angular/common';
import { Router } from '@angular/router'
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';


const scripts = [
]

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss']
})
export class BaseComponent implements OnInit {

  public TEXTS = TEXTS[SELECTED_LANGUAGE]
  public router : Router
  protected loadAPI: Promise<any>;
  protected INITIAL_ID = INITIAL_ID
  backButtonColor : string = "basic"

  constructor(
    protected scriptsService : ScriptsService,
    protected location : Location,
    router : Router,
    private snackBar: MatSnackBar
  ) {
    this.router = router
   }

  ngOnInit(): void {
    this.loadScripts(scripts)
  }

  goToDashboard(): void {
    this.router.navigate([''])
  }

  protected loadScripts(scripts : string[]) : void {
    this.loadAPI = new Promise((resolve) => {
      console.log('Loading dynamic scripts...')
      scripts.forEach(ScriptsService.loadScript)
    });
  }

  public createCustomer(): void {
    this.router.navigate(['customers', this.INITIAL_ID])
  }

  public listCustomers(): void {
    this.router.navigate(['customers'])
  }

  public createProductModel(): void {
    this.router.navigate(['productModels', this.INITIAL_ID])
  }

  public listProductModels(): void {
    this.router.navigate(['productModels'])
  }

  public createSupplier(): void {
    this.router.navigate(['suppliers', this.INITIAL_ID])
  }

  public listSuppliers(): void {
    this.router.navigate(['suppliers'])
  }

  public createRental(): void {
    this.router.navigate(['rentals', this.INITIAL_ID])
  }

  public listRentals(): void {
    this.router.navigate(['rentals'])
  }

  public createStockItem(): void {
    this.router.navigate(['stockItems', this.INITIAL_ID])
  }

  public listStockItems(): void {
    this.router.navigate(['stockItems'])
  }

  public events(): void {
    this.router.navigate(['events'])
  }

  public inventory(): void {
    this.router.navigate(['inventory'])
  }

  public showStockItem(stockItemId) {
    this.router.navigate(['stockItems', stockItemId])
  }

  public backPage(): void {
    this.location.back()
  }

  public openSnackBar(message: string) {
    let config = new MatSnackBarConfig();
    config.panelClass = 'center';
    config.duration = 2000
    this.snackBar.open(message, null, config);
  }

  redirectTo(uri : string){
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
    this.router.navigate([uri]));
 }
}
