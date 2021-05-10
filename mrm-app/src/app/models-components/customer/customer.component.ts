import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Customer } from '../../models/customer.model'
import { Location } from '@angular/common';
import { CustomerService } from '../../services/customer.service'
import { CUSTOMER_ID_PARAM , INITIAL_ID } from '../../app.constants'
import { BaseComponent } from 'src/app/base/base.component';
import { ScriptsService } from 'src/app/services/scripts.service';
import { FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent extends BaseComponent implements OnInit {

  id : number
  customer : Customer
  customerForm : FormGroup
  searchCnpjButtonColor : string = "basic"

  constructor(
    private customerService : CustomerService,
    private activatedRoute : ActivatedRoute,
    scriptsService : ScriptsService,
    location : Location,
    router : Router,
    matSnackBar : MatSnackBar
  ) { 
    super(scriptsService, location, router, matSnackBar)
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
    //@TODO
    this.customer["cep"] = this.customer.address.cep
    this.customer["street"] = this.customer.address.street
    this.customer["city"] = this.customer.address.city
    this.customer["number"] = this.customer.address.number
    delete this.customer["address"]
    this.customerService.createCustomer(this.customer).subscribe(
      data => {
        this.openSnackBar("Customer created!")
        this.listCustomers()
      }
    )
  }

  updateCustomer(): void {
    this.customerService.updateCustomer(this.customer).subscribe(
      data => {
        this.openSnackBar("Customer updated!")
        this.listCustomers()
      }
    )
  }

  deleteCustomer(): void {
    if (this.customer.active) {
      this.customer.active = false
      this.customerService.updateCustomer(this.customer).subscribe(
        data => {
          this.openSnackBar("Customer set to inactive.")
          this.listCustomers()
        }
      )

      return
    }

    this.customerService.deleteCustomer(this.customer.id).subscribe(
      response => {
        this.openSnackBar("Customer deleted.")
        this.listCustomers()
      }
    )
  }

  searchCnpj() {
    if (this.customer.cnpj) {
      this.customerService.searchCnpj(this.customer.cnpj).subscribe(
        data => {
          if (data['error']) {
            this.openSnackBar("CNPJ/CPF not found.")
            return
          }
          this.customer.companyName = data['RAZAO SOCIAL']
          this.customer.commercialName = data['NOME FANTASIA']
          this.customer.companyName = data['RAZAO SOCIAL']
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
}
