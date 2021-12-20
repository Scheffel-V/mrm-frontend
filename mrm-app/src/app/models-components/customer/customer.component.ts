import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Customer } from '../../models/customer.model'
import { Location } from '@angular/common';
import { CustomerService } from '../../services/customer.service'
import { CUSTOMER_ID_PARAM , INITIAL_ID } from '../../app.constants'
import { BaseComponent } from 'src/app/base/base.component';
import { ScriptsService } from 'src/app/services/scripts.service';
import { FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Rental } from '../../models/rental.model';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from '../../services/auth.service';


class RentalToDisplay {
  constructor(
    public checked : boolean,
    public rental : Rental,
    public trashButtonColor : string = "basic",
    public infoButtonColor : string = "basic"
  ) { }
}

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent extends BaseComponent implements OnInit {

  id : number
  customer : Customer
  rentals : Rental[] = []
  displayedColumns = ['actions', 'status', 'invoice', 'invoiceNumber', 'period', 'startDate', 'endDate', 'totalValue'];
  rentalsToDisplay : RentalToDisplay[] = []
  customerForm : FormGroup
  searchCnpjButtonColor : string = "basic"

  public dataSource = new MatTableDataSource<RentalToDisplay>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private customerService : CustomerService,
    private activatedRoute : ActivatedRoute,
    scriptsService : ScriptsService,
    location : Location,
    router : Router,
    matSnackBar : MatSnackBar,
    authService: AuthService
  ) { 
    super(scriptsService, location, router, matSnackBar, authService)
  }

  ngOnInit(): void {
    this.id = +this.activatedRoute.snapshot.params[CUSTOMER_ID_PARAM]
    this.customer = new Customer(this.id)

    if (this.id != INITIAL_ID) {
      this.fetchCustomer()
    }
  }

  public ngAfterViewInit(): void {
    this.setPaginator()
    this.setSorter()
    this.setFilter()
  }

  fetchCustomer(): void {
    this.customerService.getCustomer(this.id).subscribe(
      data => {
        this.customer = data
        this.rentals = this.customer.rentContracts
        this.setRentalsPeriods()
        this.prepareRentalsCurrenciesToDisplay()
        this.displayRentals(this.rentals)
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
    this.customerService.createCustomer(this.customer).subscribe(
      data => {
        this.openSnackBar("Cliente criado!")
        this.listCustomers()
      }
    )
  }

  updateCustomer(): void {
    this.customerService.updateCustomer(this.customer).subscribe(
      data => {
        this.openSnackBar("Cliente atualizado!")
        this.listCustomers()
      }
    )
  }

  deleteCustomer(): void {
    if (this.customer.active) {
      this.customer.active = false
      this.customerService.updateCustomer(this.customer).subscribe(
        data => {
          this.openSnackBar("Cliente posto como inativo.")
          this.listCustomers()
        }
      )

      return
    }

    this.customerService.deleteCustomer(this.customer.id).subscribe(
      response => {
        this.openSnackBar("Cliente deletado.")
        this.listCustomers()
      }
    )
  }

  searchCnpj() {
    if (this.customer.cnpj) {
      this.customerService.searchCnpj(this.customer.cnpj).subscribe(
        data => {
          if (data['error']) {
            this.openSnackBar("CNPJ/CPF não encontrado.")
            return
          }
          this.customer.name = data['RAZAO SOCIAL']
          this.customer.commercialName = data['NOME FANTASIA']
          this.customer.email = data['EMAIL']
          this.customer.mobilePhone = data['DDD'] + data['TELEFONE']
          this.customer.address.cep = data['CEP']
          this.customer.address.street = data['TIPO LOGRADOURO'] + data['LOGRADOURO']
          this.customer.address.city = data['MUNICIPIO']
          this.customer.address.number = data['NUMERO']
          this.customer.address.neighborhood = data['BAIRRO']
        }
      )
    }
  }

  public displayRentals(rentals : Rental[]): void {
    this.rentalsToDisplay = []
    rentals.forEach((rental) => {
      this.rentalsToDisplay.push(
        new RentalToDisplay(false, rental)
      )
    })
    this.dataSource.data = this.rentalsToDisplay
  }

  public updateRental(selectedRentalId : number): void {
    this.router.navigate(['rentals', selectedRentalId])
  }


  prepareRentalsCurrenciesToDisplay() {
    this.rentals.forEach((rental) => {
      this.prepareCurrenciesToDisplay(rental)
    })
  }

  prepareCurrenciesToDisplay(rental) {
    rental.value = this.prepareCurrencyToDisplay(rental.value)
  }

  prepareCurrencyToDisplay(value : any) : string {
    return (typeof(value) === "string") ? value : value.toString().replace(".", ",")
  }

  setRentalsPeriods() {
    let rental : Rental

    for (rental of this.rentals) {
      rental.startDate = new Date(rental.startDate)
      rental.endDate = new Date(rental.endDate)
      rental.period = Math.ceil(Math.abs(rental.endDate.getTime() - rental.startDate.getTime()) / (1000 * 60 * 60 * 24))
      rental.paymentDueDate = rental.paymentDueDate ? new Date(rental.paymentDueDate) : null
      rental.paidAt = rental.paidAt ? new Date(rental.paidAt) : null
    }
  }

  private setPaginator() {
    this.dataSource.paginator = this.paginator;
  }

  private setSorter() {
    this.dataSource.sortingDataAccessor = (item, property) => {
      return item['rental'][property]
    }
  }

  private setFilter() {
    this.dataSource.filterPredicate = (data, filter: string)  => {
      const accumulator = (currentTerm, key) => {
        return key === 'rental' ? currentTerm + data.rental.customer.name + data.rental.invoiceNumber + data.rental.status : currentTerm + data[key];
      };
      const dataStr = Object.keys(data).reduce(accumulator, '').toLowerCase();
      const transformedFilter = filter.trim().toLowerCase();
      return dataStr.indexOf(transformedFilter) !== -1;
    };
  }

  isInvoiceOverdue(rental : Rental) {
    return rental.paymentDueDate ? new Date().getTime() > rental.paymentDueDate.getTime() : false
  } 
}
