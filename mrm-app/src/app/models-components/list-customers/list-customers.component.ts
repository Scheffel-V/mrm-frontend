import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Customer } from '../../models/customer.model'
import { Location } from '@angular/common';
import { CustomerService } from '../../services/customer.service'
import { ScriptsService } from 'src/app/services/scripts.service';
import { BaseComponent } from 'src/app/base/base.component';

const scripts = [
  "../../assets/js/demo/datatables-demo.js"
]

@Component({
  selector: 'app-list-customers',
  templateUrl: './list-customers.component.html',
  styleUrls: ['./list-customers.component.scss']
})
export class ListCustomersComponent extends BaseComponent implements OnInit {

  customers : Customer[] = []
  message : string

  constructor(
    private customerService : CustomerService,
    private activatedRoute : ActivatedRoute,
    scriptService : ScriptsService,
    router : Router,
    location : Location
  ) {
    super(scriptService, location, router)
   }

  ngOnInit(): void {
    this.customerService.getAllCustomers().subscribe(
      data => {
        this.customers = data
      }
    )
  }

  ngAfterContentInit(): void {
    this.loadScripts(scripts)
  }

  createCustomer(): void {
    this.router.navigate(['customers', this.INITIAL_ID])
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
}

