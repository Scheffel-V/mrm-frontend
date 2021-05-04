import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Rental } from '../../models/rental.model'
import { Location } from '@angular/common';
import { RentalService } from '../../services/rental.service'
import { CustomerService } from '../../services/customer.service'
import { StockItemService } from '../../services/stock-item.service'
import { RENTAL_ID_PARAM , INITIAL_ID } from '../../app.constants'
import { BaseComponent } from 'src/app/base/base.component';
import { ScriptsService } from 'src/app/services/scripts.service';
import { FormGroup } from '@angular/forms';
import { Customer } from '../../models/customer.model';
import { StockItem } from '../../models/stock-item.model';


@Component({
  selector: 'app-rental',
  templateUrl: './rental.component.html',
  styleUrls: ['./rental.component.scss']
})
export class RentalComponent extends BaseComponent implements OnInit {

  id : number
  rental : Rental
  rentalForm : FormGroup
  customers : Customer[] = []
  stockItems : StockItem[] = []

  constructor(
    private rentalService : RentalService,
    private customerService : CustomerService,
    private stockItemService : StockItemService,
    private activatedRoute : ActivatedRoute,
    scriptsService : ScriptsService,
    location : Location,
    router : Router
  ) { 
    super(scriptsService, location, router)
  }

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.params[RENTAL_ID_PARAM]
    this.rental = new Rental(this.id, new Customer(-1), [])

    if (this.id != INITIAL_ID) {
      this.fetchRental()
    }

    this.fetchCustomers()
    this.fetchProductModelsInInventory()
  }

  fetchRental(): void {
    this.rentalService.getRental(this.id).subscribe(
      data => {
        this.rental = data
      }
    )
  }

  saveRental(): void {
    if (this.id == INITIAL_ID) {
      this.createRental()
      return
    }

    this.updateRental()
  }

  createRental(): void {
    delete this.rental['id']
    this.rentalService.createRental(this.rental).subscribe(
      data => {
        this.location.back()
      }
    )
  }

  updateRental(): void {
    this.rentalService.updateRental(this.rental).subscribe(
      data => {
        this.location.back()
      }
    )
  }

  deleteRental(): void {
    this.rentalService.deleteRental(this.rental.id).subscribe(
      response => {
        this.location.back()
      }
    )
  }

  fetchCustomers(): void {
    this.customerService.getAllCustomers().subscribe(
      data => {
        this.customers = data
      }
    )
  }

  fetchProductModelsInInventory(): void {
    this.stockItemService.getAllStockItemsInInventory().subscribe(
      data => {
        this.stockItems = data
      }
    )
  }
}
