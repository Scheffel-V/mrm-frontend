import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Customer } from '../../models/customer.model'
import { Location } from '@angular/common';
import { CustomerService } from '../../services/customer.service'
import { CUSTOMER_ID_PARAM , INITIAL_ID } from '../../app.constants'
import { BaseComponent } from 'src/app/base/base.component';
import { ScriptsService } from 'src/app/services/scripts.service';
import { FormGroup } from '@angular/forms';


@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent extends BaseComponent implements OnInit {

  id : number
  customer : Customer
  customerForm : FormGroup

  constructor(
    private customerService : CustomerService,
    private activatedRoute : ActivatedRoute,
    scriptsService : ScriptsService,
    location : Location,
    router : Router
  ) { 
    super(scriptsService, location, router)
  }

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
        // @TODO
        //this.customer.address = data[0].Address
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
    //delete this.customer['id']
    //@TODO
    this.customer["cep"] = this.customer.address.cep
    this.customer["street"] = this.customer.address.street
    this.customer["city"] = this.customer.address.city
    this.customer["number"] = this.customer.address.number
    delete this.customer["address"]
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
    this.customerService.deleteCustomer(this.customer.id).subscribe(
      response => {
        this.location.back()
      }
    )
  }
}
