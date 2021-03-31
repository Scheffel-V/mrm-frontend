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

class CustomerToDisplay {
  constructor(
    public checked : boolean,
    public customer : Customer
  ) { }
}

@Component({
  selector: 'app-list-customers',
  templateUrl: './list-customers.component.html',
  styleUrls: ['./list-customers.component.scss']
})
export class ListCustomersComponent extends BaseComponent implements OnInit {

  customersToDisplay : CustomerToDisplay[] = []
  message : string

  public constructor(
    private customerService : CustomerService,
    private activatedRoute : ActivatedRoute,
    scriptService : ScriptsService,
    router : Router,
    location : Location
  ) {
    super(scriptService, location, router)
   }

   public ngOnInit(): void {
    this.customerService.getAllCustomers().subscribe(
      data => {
        this.displayCustomers(data)
      }
    )
  }

  public ngAfterContentInit(): void {
    this.loadScripts(scripts)
  }

  public updateCustomer(selectedCustomerId : number): void {
    this.router.navigate(['customers', selectedCustomerId])
  }

  public deleteCustomer(selectedCustomerId : number): void {
    this.customerService.deleteCustomer(selectedCustomerId).subscribe(
      () => {
        this.message = `Deleted customer!`
        this.refreshCustomers()
      }
    )
  }

  public deleteSelectedCustomers(): void {
    new Promise((resolve) => {
     this.customersToDisplay
      .filter(customerToDisplay => customerToDisplay.checked)
      .forEach((selectedCustomer, index, array) => {
        this.customerService.deleteCustomer(selectedCustomer.customer.id).subscribe(
        () => {
          this.message = `Deleted!`
          if (index === array.length -1) resolve(true);
        })
      })
    }).then(() => {
      this.refreshCustomers()
    });
  }

  public refreshCustomers(): void {
    this.customerService.getAllCustomers().subscribe(
      data => {
        this.displayCustomers(data);
      }
    )
  }

  public displayCustomers(customers : Customer[]): void {
    this.customersToDisplay = []
    customers.forEach((customer) => {
      this.customersToDisplay.push(
        new CustomerToDisplay(false, customer)
      )
    })
  }
}

