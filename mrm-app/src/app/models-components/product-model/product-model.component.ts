import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductModel } from '../../models/product-model.model'
import { StockItem } from '../../models/stock-item.model'
import { Location } from '@angular/common';
import { ProductModelService } from '../../services/product-model.service'
import { StockItemService } from '../../services/stock-item.service'
import { PRODUCT_MODEL_ID_PARAM , INITIAL_ID } from '../../app.constants'
import { BaseComponent } from 'src/app/base/base.component';
import { ScriptsService } from 'src/app/services/scripts.service';
import { FormGroup } from '@angular/forms';


@Component({
  selector: 'app-product-model',
  templateUrl: './product-model.component.html',
  styleUrls: ['./product-model.component.scss']
})
export class ProductModelComponent extends BaseComponent implements OnInit {
  
  id : number
  productModel : ProductModel
  productModelForm : FormGroup

  constructor(
    private productModelService : ProductModelService,
    private stockItemService : StockItemService,
    private activatedRoute : ActivatedRoute,
    scriptsService : ScriptsService,
    location : Location,
    router : Router
  ) { 
    super(scriptsService, location, router)
  }

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.params[PRODUCT_MODEL_ID_PARAM]
    this.productModel = new ProductModel(this.id)

    if (this.id != INITIAL_ID) {
      this.fetchProductModel()
    }
  }

  fetchProductModel(): void {
    this.productModelService.getProductModel(this.id).subscribe(
      data => {
        this.productModel = data
      }
    )
  }

  saveProductModel(): void {
    if (this.id == INITIAL_ID) {
      this.createProductModel()
      return
    }

    this.updateProductModel()
  }

  createProductModel(): void {
    delete this.productModel['id']
    this.productModelService.createProductModel(this.productModel).subscribe(
      data => {
        this.productModel = data
        let stockItem = new StockItem(-1, this.productModel.id)
        delete stockItem['id']
        this.stockItemService.createStockItem(stockItem).subscribe(
          data => {
            this.location.back()
          }
        )
      }
    )
  }

  updateProductModel(): void {
    this.productModelService.updateProductModel(this.productModel).subscribe(
      data => {
        this.location.back()
      }
    )
  }

  deleteProductModel(): void {
    this.productModelService.deleteProductModel(this.productModel.id).subscribe(
      response => {
        this.location.back()
      }
    )
  }

}
