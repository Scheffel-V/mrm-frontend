import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Supplier } from '../../models/supplier.model'
import { Location } from '@angular/common';
import { SupplierService } from '../../services/supplier.service'
import { SUPPLIER_ID_PARAM , INITIAL_ID } from '../../app.constants'
import { BaseComponent } from 'src/app/base/base.component';
import { ScriptsService } from 'src/app/services/scripts.service';
import { FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-create-supplier',
  templateUrl: './create-supplier.component.html',
  styleUrls: ['./create-supplier.component.scss']
})
export class CreateSupplierComponent extends BaseComponent implements OnInit {

  id : number
  supplier : Supplier
  supplierForm : FormGroup
  searchCnpjButtonColor : string = "basic"

  constructor(
    private supplierService : SupplierService,
    private activatedRoute : ActivatedRoute,
    scriptsService : ScriptsService,
    location : Location,
    router : Router,
    matSnackBar : MatSnackBar
  ) { 
    super(scriptsService, location, router, matSnackBar)
  }

  ngOnInit(): void {
    this.id = -1
    this.supplier = new Supplier(this.id)
  }

  fetchSupplier(): void {
    this.supplierService.getSupplier(this.id).subscribe(
      data => {
        this.supplier = data
        // @TODO
        this.supplier.address = data[0].address
      }
    )
  }

  saveSupplier(): void {
    if (this.id == INITIAL_ID) {
      this.createSupplier()
      return
    }

    this.updateSupplier()
  }

  createSupplier(): void {
    this.supplierService.createSupplier(this.supplier).subscribe(
      data => {
        this.listSuppliers()
      }
    )
  }

  updateSupplier(): void {
    this.supplierService.updateSupplier(this.supplier).subscribe(
      data => {
        this.listSuppliers()
      }
    )
  }

  deleteSupplier(): void {
    if (this.supplier.active) {
      this.supplier.active = false
      this.supplierService.updateSupplier(this.supplier).subscribe(
        data => {
          this.openSnackBar("Fornecedor posto como inativo.")
          this.listSuppliers()
        }
      )

      return
    }

    this.supplierService.deleteSupplier(this.supplier.id).subscribe(
      response => {
        this.openSnackBar("Fornecedor deletado.")
        this.listSuppliers()
      }
    )
  }

  searchCnpj() {
    if (this.supplier.cnpj) {
      this.supplierService.searchCnpj(this.supplier.cnpj).subscribe(
        data => {
          if (data['error']) {
            this.openSnackBar("CNPJ/CPF não encontrado.")
            return
          }
          this.supplier.name = data['RAZAO SOCIAL']
          this.supplier.commercialName = data['NOME FANTASIA']
          this.supplier.email = data['EMAIL']
          this.supplier.mobilePhone = data['DDD'] + data['TELEFONE']
          this.supplier.address.cep = data['CEP']
          this.supplier.address.street = data['TIPO LOGRADOURO'] + data['LOGRADOURO']
          this.supplier.address.city = data['MUNICIPIO']
          this.supplier.address.number = data['NUMERO']
          this.supplier.address.neighborhood = data['BAIRRO']
        }
      )
    }
  }
}
