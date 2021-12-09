import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Customer } from '../../models/customer.model'
import { Location } from '@angular/common';
import { CustomerService } from '../../services/customer.service'
import { ScriptsService } from 'src/app/services/scripts.service';
import { BaseComponent } from 'src/app/base/base.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { AuthService } from '../../services/auth.service';


class CustomerToDisplay {
  constructor(
    public checked : boolean,
    public customer : Customer,
    public trashButtonColor : string = "basic",
    public infoButtonColor : string = "basic"
  ) { }
}

@Component({
  selector: 'app-list-customers',
  templateUrl: './list-customers.component.html',
  styleUrls: ['./list-customers.component.scss']
})
export class ListCustomersComponent extends BaseComponent implements OnInit, AfterViewInit {

  customersToDisplay : CustomerToDisplay[] = []
  customers : Customer[] = []
  public displayedColumns = ['select', 'actions', 'companyName', 'commercialName', 'cnpj', 'city', 'phoneNumber', 'active'];
  public dataSource = new MatTableDataSource<CustomerToDisplay>();
  showOnlyActive : boolean = true
  message : string
  saveButtonColor = "primary"
  deleteSelectedButtonColor = "basic"
  topCustomersButtonColor = "basic"
  exportButtonColor = "basic"

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  public constructor(
    private customerService : CustomerService,
    private activatedRoute : ActivatedRoute,
    scriptsService : ScriptsService,
    router : Router,
    location : Location,
    matSnackBar : MatSnackBar,
    authService: AuthService
  ) {
    super(scriptsService, location, router, matSnackBar, authService)
   }

  public ngOnInit(): void {
    this.customerService.getAllCustomers().subscribe(
      data => {
        this.customers = data
        this.displayCustomers(this.filterActiveCustomers())
      }
    )
  }

  public ngAfterViewInit(): void {
    this.setPaginator()
    this.setSorter()
    this.setFilter()
  }

  private setPaginator() {
    this.dataSource.paginator = this.paginator;
  }

  private setSorter() {
    this.dataSource.sortingDataAccessor = (item, property) => {
      return item['customer'][property]
    }
  }

  private setFilter() {
    this.dataSource.filterPredicate = (data, filter: string)  => {
      const accumulator = (currentTerm, key) => {
        return key === 'customer' ? currentTerm + data.customer.name + data.customer.commercialName + data.customer.cnpj : currentTerm + data[key];
      };
      const dataStr = Object.keys(data).reduce(accumulator, '').toLowerCase();
      const transformedFilter = filter.trim().toLowerCase();
      return dataStr.indexOf(transformedFilter) !== -1;
    };
  }

  public updateCustomer(selectedCustomerId : number): void {
    this.router.navigate(['customers', selectedCustomerId])
  }

  public deleteCustomer(selectedCustomerId : number): void {
    let customer = this.getCustomer(selectedCustomerId)
    if (customer.active) {
      customer.active = false
      this.customerService.updateCustomer(customer).subscribe(
        data => {
          this.openSnackBar("Cliente posto como inativo.")
          this.refreshCustomers()
        }
      )

      return
    }

    this.customerService.deleteCustomer(customer.id).subscribe(
      response => {
        this.openSnackBar("Cliente deletado.")
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
      this.openSnackBar("Clientes deletados.")
      this.refreshCustomers()
    });
  }

  public refreshCustomers(): void {
    this.customerService.getAllCustomers().subscribe(
      data => {
        this.customers = data
        this.displayCustomers(this.filterActiveCustomers());
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
    this.dataSource.data = this.customersToDisplay
  }

  public getCustomer(customerId : number) {
    let customers = this.customersToDisplay.filter((customerToDisplay => customerToDisplay.customer.id === customerId))
    return customers.length > 0 ? customers[0].customer : null
  }

  public filterActiveCustomers() {
    return this.showOnlyActive ? this.customers.filter((customer => customer.active === this.showOnlyActive)) : this.customers
  }

  public doFilter(value : string) {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  public showOnlyActiveToggleChange(event : MatSlideToggleChange) {
    this.showOnlyActive = event.checked
    this.displayCustomers(this.filterActiveCustomers())
  }
}

