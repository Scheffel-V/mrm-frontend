import { Component, OnInit } from '@angular/core'
import { ScriptsService } from '../services/scripts.service'
import { BaseComponent } from '../base/base.component'
import { Router } from '@angular/router'
import { Location } from '@angular/common';
import { CustomerService } from '../services/customer.service';
import { Customer } from '../models/customer.model';


const scripts = [
  //'../../assets/js/demo/chart-area-demo.js',
  //'../../assets/js/demo/chart-pie-demo.js'
]

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent extends BaseComponent implements OnInit {

  customers : Customer[] = []

  constructor(
    private customerService : CustomerService,
    scriptsService : ScriptsService,
    location : Location,
    router : Router
  ) {
    super(
      scriptsService,
      location,
      router
    )
   }

  ngOnInit(): void {
    this.customerService.getAllCustomers().subscribe(
      customers => {
        this.customers = customers
      }
    )
  }

  ngAfterContentInit(): void {
    this.loadScripts(scripts)
  }
}
