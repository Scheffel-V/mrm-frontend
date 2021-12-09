import { Component, OnInit } from '@angular/core';
import { PORTUGUESE, ENGLISH, INITIAL_ID } from '../app.constants'
import { TEXTS } from '../ui-texts/texts'
import { ScriptsService } from '../services/scripts.service'
import { Location } from '@angular/common';
import { Router } from '@angular/router'
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { AuthService } from '../services/auth.service';


const scripts = [
]

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss']
})
export class BaseComponent implements OnInit {

  public portuguese = PORTUGUESE
  public english = ENGLISH
  public TEXTS = TEXTS[this.portuguese]
  public router : Router
  protected loadAPI: Promise<any>
  protected INITIAL_ID = INITIAL_ID
  backButtonColor : string = "basic"
  avatar = false

  constructor(
    protected scriptsService : ScriptsService,
    protected location : Location,
    router : Router,
    private snackBar: MatSnackBar,
    protected authService: AuthService 
  ) {
    this.router = router
   }

  ngOnInit(): void {
    this.loadScripts(scripts)
  }

  goToDashboard(): void {
    this.router.navigate(['dashboard'])
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

  public invoices(): void {
    this.router.navigate(['invoices'])
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

 changeLanguage(language : string) {
  this.TEXTS = TEXTS[language]
  window.location.reload()
 }

 logout() {
   this.authService.logout()
 }

 isUserLoggedIn() {
   return this.authService.isUserLoggedIn();
 }
}
