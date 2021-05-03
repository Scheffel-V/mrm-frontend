import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Supplier } from '../../models/supplier.model'
import { Location } from '@angular/common';
import { SupplierService } from '../../services/supplier.service'
import { SUPPLIER_ID_PARAM , INITIAL_ID } from '../../app.constants'
import { BaseComponent } from 'src/app/base/base.component';
import { ScriptsService } from 'src/app/services/scripts.service';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.scss']
})
export class SupplierComponent extends BaseComponent implements OnInit {

  id : number
  supplier : Supplier
  supplierForm : FormGroup

  constructor(
    private supplierService : SupplierService,
    private activatedRoute : ActivatedRoute,
    scriptsService : ScriptsService,
    location : Location,
    router : Router
  ) { 
    super(scriptsService, location, router)
  }

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.params[SUPPLIER_ID_PARAM]
    this.supplier = new Supplier(this.id)

    if (this.id != INITIAL_ID) {
      this.fetchSupplier()
    }
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
    delete this.supplier['id']
    //@TODO
    this.supplier["cep"] = this.supplier.address.cep
    this.supplier["street"] = this.supplier.address.street
    this.supplier["city"] = this.supplier.address.city
    this.supplier["number"] = this.supplier.address.number
    delete this.supplier["address"]
    this.supplierService.createSupplier(this.supplier).subscribe(
      data => {
        this.location.back()
      }
    )
  }

  updateSupplier(): void {
    this.supplierService.updateSupplier(this.supplier).subscribe(
      data => {
        this.location.back()
      }
    )
  }

  deleteSupplier(): void {
    this.supplierService.deleteSupplier(this.supplier.id).subscribe(
      response => {
        this.location.back()
      }
    )
  }
}
