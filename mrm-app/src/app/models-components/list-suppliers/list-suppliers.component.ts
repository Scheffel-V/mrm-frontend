import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Supplier } from '../../models/supplier.model'
import { Location } from '@angular/common';
import { SupplierService } from '../../services/supplier.service'
import { ScriptsService } from 'src/app/services/scripts.service';
import { BaseComponent } from 'src/app/base/base.component';

const scripts = [
  "../../assets/js/demo/datatables-demo.js"
]

class SupplierToDisplay {
  constructor(
    public checked : boolean,
    public supplier : Supplier
  ) { }
}

@Component({
  selector: 'app-list-suppliers',
  templateUrl: './list-suppliers.component.html',
  styleUrls: ['./list-suppliers.component.scss']
})
export class ListSuppliersComponent extends BaseComponent implements OnInit {

  suppliersToDisplay : SupplierToDisplay[] = []
  message : string

  public constructor(
    private supplierService : SupplierService,
    private activatedRoute : ActivatedRoute,
    scriptService : ScriptsService,
    router : Router,
    location : Location
  ) {
    super(scriptService, location, router)
   }

   public ngOnInit(): void {
    this.supplierService.getAllSuppliers().subscribe(
      data => {
        this.displaySuppliers(data)
      }
    )
  }

  public ngAfterContentInit(): void {
    this.loadScripts(scripts)
  }

  public updateSupplier(selectedSupplierId : number): void {
    this.router.navigate(['suppliers', selectedSupplierId])
  }

  public deleteSupplier(selectedSupplierId : number): void {
    this.supplierService.deleteSupplier(selectedSupplierId).subscribe(
      () => {
        this.message = `Deleted Supplier!`
        this.refreshSuppliers()
      }
    )
  }

  public deleteSelectedSuppliers(): void {
    new Promise((resolve) => {
     this.suppliersToDisplay
      .filter(SupplierToDisplay => SupplierToDisplay.checked)
      .forEach((selectedSupplier, index, array) => {
        this.supplierService.deleteSupplier(selectedSupplier.supplier.id).subscribe(
        () => {
          this.message = `Deleted!`
          if (index === array.length -1) resolve(true);
        })
      })
    }).then(() => {
      this.refreshSuppliers()
    });
  }

  public refreshSuppliers(): void {
    this.supplierService.getAllSuppliers().subscribe(
      data => {
        this.displaySuppliers(data);
      }
    )
  }

  public displaySuppliers(suppliers : Supplier[]): void {
    this.suppliersToDisplay = []
    suppliers.forEach((supplier) => {
      this.suppliersToDisplay.push(
        new SupplierToDisplay(false, supplier)
      )
    })
  }

}
