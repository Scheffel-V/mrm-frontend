import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Customer } from '../../models/customer.model'
import { Location } from '@angular/common';
import { CustomerService } from '../../services/customer.service'
import { ScriptsService } from 'src/app/services/scripts.service';
import { BaseComponent } from 'src/app/base/base.component';
import { MatSnackBar } from '@angular/material/snack-bar';

const scripts = [
  "../../assets/js/demo/listCustomersDataTable.js"
]

declare  var $:any;

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
    scriptsService : ScriptsService,
    router : Router,
    location : Location,
    matSnackBar : MatSnackBar
  ) {
    super(scriptsService, location, router, matSnackBar)
   }

   public ngOnInit(): void {
    this.customerService.getAllCustomers().subscribe(
      data => {
        this.displayCustomers(data)
      }
    )
  }

  public ngAfterContentInit(): void {
    this.loadCustomerTableScript(scripts)
  }

  private loadCustomerTableScript(scripts) {
    // Call the dataTables jQuery plugin

    $(document).ready(function() {
      console.log(1)
      var listCustomersDataTable = $('#listCustomersDataTable').DataTable( {
        "order": [[ 2, "asc" ]]
      });
      console.log(2)

      console.log("BINDING CJSGOMET")
      $('#listCustomersDataTable tbody').on( 'mouseenter', 'td', function () {
          var colIdx = listCustomersDataTable.cell(this).index().column;
          var rowIdx = listCustomersDataTable.cell(this).index().row;

          $( listCustomersDataTable.cells().nodes() ).removeClass( 'highlight' );
          $( listCustomersDataTable.rows().nodes() ).removeClass( 'highlight' );
          $( listCustomersDataTable.column( colIdx ).nodes() ).addClass( 'highlight' );
          $( listCustomersDataTable.row( rowIdx ).nodes() ).addClass( 'highlight' );
      } );
      console.log(3)
    });
  }

  public updateCustomer(selectedCustomerId : number): void {
    this.router.navigate(['customers', selectedCustomerId])
  }

  deleteCustomer(selectedCustomerId : number): void {
    let customer = this.getCustomer(selectedCustomerId)
    if (customer.active) {
      customer.active = false
      this.customerService.updateCustomer(customer).subscribe(
        data => {
          this.openSnackBar("Customer set to inactive.")
          this.refreshCustomers()
        }
      )

      return
    }

    this.customerService.deleteCustomer(customer.id).subscribe(
      response => {
        this.openSnackBar("Customer deleted.")
        this.refreshCustomers()
      }
    )
  }

  public deleteSelectedCustomers(): void {
    new Promise((resolve) => {
     this.customersToDisplay
      .filter(customerToDisplay => customerToDisplay.checked)
      .forEach((selectedCustomer, index, array) => {
        if (selectedCustomer.customer.active) {
          selectedCustomer.customer.active = false
          this.customerService.updateCustomer(selectedCustomer.customer).subscribe(
            () => {
              if (index === array.length -1) resolve(true);
            }
          )
        } else {
          this.customerService.deleteCustomer(selectedCustomer.customer.id).subscribe(
            () => {
              if (index === array.length -1) resolve(true);
            }
          )
        }
      })
    }).then(() => {
      this.openSnackBar("Customers deleted.")
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

  public isCustomerActive(customerId : number) {
    let customers = this.customersToDisplay.filter((customerToDisplay => customerToDisplay.customer.id === customerId))
    if (customers.length > 0) {
      return customers[0].customer.active
    }

    return false
  }

  public getCustomer(customerId : number) {
    let customers = this.customersToDisplay.filter((customerToDisplay => customerToDisplay.customer.id === customerId))
    if (customers.length > 0) {
      return customers[0].customer
    }

    return null
  }
}

