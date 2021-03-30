import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Customer } from '../../models/customer.model'
import { Location } from '@angular/common';
import { CustomerService } from '../../services/customer.service'
import { INITIAL_ID, SELECTED_LANGUAGE } from '../../app.constants'
import { ModelPage } from '../../interfaces/ModelPage'
import { TEXTS } from '../../ui-texts/texts'

@Component({
  selector: 'app-list-customers',
  templateUrl: './list-customers.component.html',
  styleUrls: ['./list-customers.component.scss']
})
export class ListCustomersComponent implements OnInit, ModelPage {

  TEXTS = TEXTS[SELECTED_LANGUAGE]
  customers : Customer[]
  message : string

  constructor(
    private customerService : CustomerService,
    private activatedRoute : ActivatedRoute,
    private location : Location,
    private router : Router
  ) { }

  ngOnInit(): void {
    this.customerService.getAllCustomers().subscribe(
      data => {
        this.customers = data
      }
    )
  }

  createCustomer(): void {
    this.router.navigate(['customers', INITIAL_ID])
  }

  updateCustomer(selectedCustomerId): void {
    this.router.navigate(['customers', selectedCustomerId])
  }

  deleteCustomer(selectedCustomerId): void {
    this.customerService.deleteCustomer(selectedCustomerId).subscribe(
      response => {
        this.message = `Deleted customer!`
        this.refreshCustomers()
      }
    )
  }

  refreshCustomers(): void {
    this.customerService.getAllCustomers().subscribe(
      data => {
        this.customers = data;
      }
    )
  }

  backPage(): void {
    this.location.back()
  }
}

