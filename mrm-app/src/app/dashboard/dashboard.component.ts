import { Component, OnInit } from '@angular/core'
import { ScriptsService } from '../services/scripts.service'
import { BaseComponent } from '../base/base.component'
import { Router } from '@angular/router'
import { Location } from '@angular/common';
import { CustomerService } from '../services/customer.service';
import { Customer } from '../models/customer.model';


const scripts = [
  //'../../assets/js/demo/chart-area-demo.js',
  //'../../assets/js/demo/chart-pie-demo.js',
  "../../assets/js/sb-admin-2.js"
]

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent extends BaseComponent implements OnInit {

  customers : Customer[] = []

  constructor(
    scriptsService : ScriptsService,
    location : Location,
    private router : Router,
    private customerService : CustomerService
  ) {
    super(
      scriptsService,
      location
    )
   }

  ngOnInit(): void {
    this.loadScripts(scripts) 
 
    this.customerService.getAllCustomers().subscribe(
      customers => {
        this.customers = customers
      }
    )
  }

  createCustomer(): void {
    this.router.navigate(['customers', this.INITIAL_ID])
  }

  listCustomers(): void {
    this.router.navigate(['customers'])
  }
}
