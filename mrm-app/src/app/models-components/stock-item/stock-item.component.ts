import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { StockItem } from '../../models/stock-item.model';
import { Location } from '@angular/common';
import { StockItemService } from '../../services/stock-item.service'
import { SupplierService } from '../../services/supplier.service'
import { ImageService } from '../../services/image.service'
import { STOCK_ITEM_ID_PARAM , INITIAL_ID } from '../../app.constants'
import { BaseComponent } from 'src/app/base/base.component';
import { ScriptsService } from 'src/app/services/scripts.service';
import { FormGroup, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReplaySubject, Subject } from 'rxjs';
import { Supplier } from '../../models/supplier.model';
import { MatSelect } from '@angular/material/select';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';


class ImageSnippet {
  pending: boolean = false
  status: string = 'init'
  constructor(public src: string, public file: File) {}
}
  

@Component({
  selector: 'app-stock-item',
  templateUrl: './stock-item.component.html',
  styleUrls: ['./stock-item.component.scss']
})
export class StockItemComponent extends BaseComponent implements OnInit {

  id : number
  stockItem : StockItem
  stockItemForm : FormGroup
  suppliers : Supplier[] = []
  selectedFile : any
  imageToShow: any
  isImageLoading: boolean
  supplierFilterControl : FormControl = new FormControl()
  supplierSelectControl : FormControl = new FormControl()
  filteredSuppliers : ReplaySubject<Supplier[]> = new ReplaySubject<Supplier[]>(1)
  protected _onDestroy = new Subject<void>();
  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;
  hover = false

  constructor(
    private stockItemService : StockItemService,
    private supplierService : SupplierService,
    private imageService : ImageService,
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
    this.id = this.activatedRoute.snapshot.params[STOCK_ITEM_ID_PARAM]
    this.stockItem = new StockItem(this.id)

    if (this.id != INITIAL_ID) {
      this.fetchStockItem()
    }

    this.fetchSuppliers()
  }

  fetchStockItem(): void {
    this.stockItemService.getStockItem(this.id).subscribe(
      data => {
        this.stockItem = data
        this.stockItem.acquisitionDate = this.stockItem.acquisitionDate == null ? null : new Date(this.stockItem.acquisitionDate)
        this.stockItem.lastMaintenance = this.stockItem.lastMaintenance == null ? null : new Date(this.stockItem.lastMaintenance)
        this.prepareCurrenciesToDisplay()
        this.getImageFromService()
        this.supplierSelectControl.setValue(this.stockItem.supplier.id)
      }
    )
  }

  saveStockItem(): void {
    this.prepareCurrenciesToSaveStockItem()
    if (this.id == INITIAL_ID) {
      this.createStockItem()
      return
    }

    this.updateStockItem()
  }

  createStockItem(): void {
    delete this.stockItem['id']
    this.stockItem.rentValue = +this.stockItem.rentValue
    this.stockItem.replacementCost = +this.stockItem.replacementCost
    this.stockItemService.createStockItem(this.stockItem).subscribe(
      data => {
        this.stockItem = data
        this.uploadFile()
        this.listStockItems()
      },
      error => {
        if (error.error.error.name === "SequelizeUniqueConstraintError") {
          this.openSnackBar("Já existe um produto com este Código!")
          return
        }
        this.openSnackBar("Erro ao criar produto!")
      }
    )
  }

  updateStockItem(): void {
    if (!this.stockItem.supplierId) {
      this.stockItem.supplierId = null
    }

    this.stockItemService.updateStockItem(this.stockItem).subscribe(
      data => {
        this.stockItem = data
        this.uploadFile()
        this.listStockItems()
      },
      error => {
        if (error.error.error.name === "SequelizeUniqueConstraintError") {
          this.openSnackBar("Já existe um produto com este Código!")
          return
        }
        this.openSnackBar("Erro ao criar produto!")
      }
    )
  }

  deleteStockItem(): void {
    this.stockItemService.deleteStockItem(this.stockItem.id).subscribe(
      response => {
        this.listStockItems()
      }
    )
  }

  sendToMaintenance() : void {
    this.stockItemService.sendToMaintenance(this.stockItem).subscribe(
      data => {
        this.listStockItems()
      }
    )
  }

  releaseFromMaintenance() : void {
    this.stockItemService.releaseFromMaintenance(this.stockItem).subscribe(
      data => {
        this.listStockItems()
      }
    )
  }

  leave() : void {
    this.stockItemService.leave(this.stockItem).subscribe(
      data => {
        this.listStockItems()
      }
    )
  }

  arrive() : void {
    this.stockItemService.arrive(this.stockItem).subscribe(
      data => {
        this.listStockItems()
      }
    )
  }

  readyForLeave() : void {
    this.stockItemService.readyForLeave(this.stockItem).subscribe(
      data => {
        this.listStockItems()
      }
    )
  }

  fetchSuppliers(): void {
    this.supplierService.getAllActiveSuppliers().subscribe(
      data => {
        this.suppliers = this.filterActiveSuppliers(data)
        this.filteredSuppliers.next(this.suppliers.slice())

        this.supplierFilterControl.valueChanges
          .pipe(takeUntil(this._onDestroy))
          .subscribe(() => {
            this.filterSuppliers();
          });
      }
    )
  }

  public filterActiveSuppliers(suppliers : Supplier[]) {
    return suppliers.filter((supplier => supplier.active === true))
  }

  filterSuppliers() {
    if (!this.suppliers) {
      return;
    }
    
    let search = this.supplierFilterControl.value;
    if (!search) {
      this.filteredSuppliers.next(this.suppliers.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    
    this.filteredSuppliers.next(
      this.suppliers.filter(supplier => supplier.name.toLowerCase().indexOf(search) > -1)
    );
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  prepareCurrenciesToSaveStockItem() {
    this.stockItem.rentValue = this.prepareCurrencyForOperations(this.stockItem.rentValue)
    this.stockItem.replacementCost = this.prepareCurrencyForOperations(this.stockItem.replacementCost)
  }

  prepareCurrenciesToDisplay() {
    this.stockItem.rentValue = this.prepareCurrencyToDisplay(this.stockItem.rentValue)
    this.stockItem.replacementCost = this.prepareCurrencyToDisplay(this.stockItem.replacementCost)
  }

  formatCurrency(value : string) : string {
    return value.replace(".", ",")
  }

  prepareCurrencyToDisplay(value : any) : string {
    return value ? ((typeof(value) === "string") ? value : value.toString().replace(".", ",")) : null
  }

  prepareCurrencyForOperations(value : any) : number {
    return value ? ((typeof(value) === "number") ? value : +(value.replace(",", "."))) : null
  }

  processFile(imageInput: any) {
    const file: File = imageInput.files[0];
    const reader = new FileReader();

    reader.addEventListener('load', (event: any) => {

      this.selectedFile = new ImageSnippet(event.target.result, file);

      this.selectedFile.pending = true
      this.imageToShow = event.target.result
    })

    reader.readAsDataURL(file);
  }

  uploadFile() {
    if (!this.selectedFile || !this.selectedFile.file) {
      return
    }

    this.imageService.uploadImage(this.stockItem.id, this.selectedFile.file).subscribe(
      (res) => {
        this.stockItem.imageURL = res['path']
        this.onImageUploadSuccess();
      },
      (err) => {
        this.onImageUploadError();
      })
  }

  createImageFromBlob(image: Blob) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
       this.imageToShow = reader.result;
    }, false);
 
    if (image) {
       reader.readAsDataURL(image);
    }
 }

 getImageFromService() {
    this.isImageLoading = true;
    this.imageService.getImage(this.stockItem.id).subscribe(data => {
      this.createImageFromBlob(data);
      this.isImageLoading = false;
    }, error => {
      this.isImageLoading = false;
      console.log(error);
    });
  }

  private onImageUploadSuccess() {
    this.selectedFile.pending = false;
    this.selectedFile.status = 'ok';
  }

  private onImageUploadError() {
    this.selectedFile.pending = false;
    this.selectedFile.status = 'fail';
    this.selectedFile.src = '';
  }
}