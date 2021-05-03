import { Component, OnInit } from '@angular/core'
import { ScriptsService } from '../services/scripts.service'
import { BaseComponent } from '../base/base.component'
import { Router } from '@angular/router'
import { Location } from '@angular/common';
import { CustomerService } from '../services/customer.service';
import { ProductModelService } from '../services/product-model.service';
import { SupplierService } from '../services/supplier.service';
import { Customer } from '../models/customer.model';
import { ProductModel } from '../models/product-model.model';
import { Supplier } from '../models/supplier.model';


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
  productModels : ProductModel[] = []
  suppliers : Supplier[] = []

  constructor(
    private customerService : CustomerService,
    private productModelService : ProductModelService,
    private supplierService : SupplierService,
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

    this.productModelService.getAllProductModels().subscribe(
      productModels => {
        this.productModels = productModels
      }
    )

    /**this.supplierService.getAllSuppliers().subscribe(
      suppliers => {
        this.suppliers = suppliers
      }
    )**/
  }

  ngAfterContentInit(): void {
    this.loadScripts(scripts)
  }
}
