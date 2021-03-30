import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Customer } from '../../models/customer.model'
import { Location } from '@angular/common';
import { CustomerService } from '../../services/customer.service'
import { CUSTOMER_ID_PARAM , INITIAL_ID, SELECTED_LANGUAGE} from '../../app.constants'
import { ModelPage } from '../../interfaces/ModelPage'
import { TEXTS } from '../../ui-texts/texts'

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit, ModelPage {

  TEXTS = TEXTS[SELECTED_LANGUAGE]
  id : number
  customer : Customer
  message : string

  constructor(
    private customerService : CustomerService,
    private activatedRoute : ActivatedRoute,
    private location : Location
  ) { }

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.params[CUSTOMER_ID_PARAM]
    this.customer = new Customer(this.id)
    
    if (this.id != INITIAL_ID) {
      this.fetchCustomer()
    }
  }

  fetchCustomer(): void {
    this.customerService.getCustomer(this.id).subscribe(
      data => {
        this.customer = data
      }
    )
  }

  saveCustomer(): void {
    if (this.id == INITIAL_ID) {
      this.createCustomer()
      return
    }

    this.updateCustomer()
  }

  createCustomer(): void {
    delete this.customer['id']
    this.customerService.createCustomer(this.customer).subscribe(
      data => {
        this.location.back()
      }
    )
  }

  updateCustomer(): void {
    this.customerService.updateCustomer(this.customer).subscribe(
      data => {
        this.location.back()
      }
    )
  }

  deleteCustomer(): void {
    this.customerService.deleteCustomer(this.customer.id).subscribe()
  }

  backPage(): void {
    this.location.back()
  }
}
