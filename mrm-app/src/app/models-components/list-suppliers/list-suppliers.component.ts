import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Supplier } from '../../models/supplier.model'
import { Location } from '@angular/common';
import { SupplierService } from '../../services/supplier.service'
import { ScriptsService } from 'src/app/services/scripts.service';
import { BaseComponent } from 'src/app/base/base.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { AuthService } from '../../services/auth.service';


const scripts = [
  "../../assets/js/demo/datatables-demo.js"
]

class SupplierToDisplay {
  constructor(
    public checked : boolean,
    public supplier : Supplier,
    public trashButtonColor : string = "basic",
    public infoButtonColor : string = "basic"
  ) { }
}

@Component({
  selector: 'app-list-suppliers',
  templateUrl: './list-suppliers.component.html',
  styleUrls: ['./list-suppliers.component.scss']
})
export class ListSuppliersComponent extends BaseComponent implements OnInit {

  suppliersToDisplay : SupplierToDisplay[] = []
  suppliers : Supplier[] = []
  public displayedColumns = ['select', 'actions', 'companyName', 'cnpj', 'city', 'phoneNumber', 'email', 'active'];
  public dataSource = new MatTableDataSource<SupplierToDisplay>();
  showOnlyActive : boolean = true
  message : string
  saveButtonColor = "primary"
  deleteSelectedButtonColor = "basic"
  exportButtonColor = "basic"

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  public constructor(
    private supplierService : SupplierService,
    private activatedRoute : ActivatedRoute,
    scriptService : ScriptsService,
    router : Router,
    location : Location,
    matSnackBar : MatSnackBar,
    authService: AuthService
  ) {
    super(scriptService, location, router, matSnackBar, authService)
   }

   public ngOnInit(): void {
    this.supplierService.getAllSuppliers().subscribe(
      data => {
        this.suppliers = data
        this.displaySuppliers(this.filterActiveSuppliers())
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
      return item['supplier'][property]
    }
  }

  private setFilter() {
    this.dataSource.filterPredicate = (data, filter: string)  => {
      const accumulator = (currentTerm, key) => {
        return key === 'supplier' ? currentTerm + data.supplier.name + data.supplier.cnpj : currentTerm + data[key];
      };
      const dataStr = Object.keys(data).reduce(accumulator, '').toLowerCase();
      const transformedFilter = filter.trim().toLowerCase();
      return dataStr.indexOf(transformedFilter) !== -1;
    };
  }

  public updateSupplier(selectedSupplierId : number): void {
    this.router.navigate(['suppliers', selectedSupplierId])
  }

  deleteSupplier(selectedSupplierId : number): void {
    let selectedSupplier = this.getSupplier(selectedSupplierId)
    if (selectedSupplier.active) {
      selectedSupplier.active = false
      this.supplierService.updateSupplier(selectedSupplier).subscribe(
        data => {
          this.openSnackBar("Fornecedor posto como inativo.")
          this.refreshSuppliers()
        }
      )

      return
    }

    this.supplierService.deleteSupplier(selectedSupplier.id).subscribe(
      response => {
        this.openSnackBar("Fornecedor deletado.")
        this.refreshSuppliers()
      }
    )
  }

  public deleteSelectedSuppliers(): void {
    new Promise((resolve) => {
     this.suppliersToDisplay
      .filter(supplierToDisplay => supplierToDisplay.checked)
      .forEach((selectedSupplier, index, array) => {
        if (selectedSupplier.supplier.active) {
          selectedSupplier.supplier.active = false
          this.supplierService.updateSupplier(selectedSupplier.supplier).subscribe(
            () => {
              if (index === array.length -1) resolve(true);
            }
          )
        } else {
          this.supplierService.deleteSupplier(selectedSupplier.supplier.id).subscribe(
            () => {
              if (index === array.length -1) resolve(true);
            }
          )
        }
      })
    }).then(() => {
      this.openSnackBar("Fornecedores deletados.")
      this.refreshSuppliers()
    });
  }

  public getSupplier(supplierId : number) {
    let suppliers = this.suppliersToDisplay.filter((supplierToDisplay => supplierToDisplay.supplier.id === supplierId))
    return suppliers.length > 0 ? suppliers[0].supplier : null
  }

  public refreshSuppliers(): void {
    this.supplierService.getAllSuppliers().subscribe(
      data => {
        this.suppliers = data
        this.displaySuppliers(this.filterActiveSuppliers());
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
    this.dataSource.data = this.suppliersToDisplay
  }

  public filterActiveSuppliers() {
    return this.showOnlyActive ? this.suppliers.filter((supplier => supplier.active === this.showOnlyActive)) : this.suppliers
  }

  public doFilter(value : string) {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  public showOnlyActiveToggleChange(event : MatSlideToggleChange) {
    this.showOnlyActive = event.checked
    this.displaySuppliers(this.filterActiveSuppliers())
  }
}
