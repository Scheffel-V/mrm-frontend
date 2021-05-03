import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductModel } from '../../models/product-model.model'
import { Location } from '@angular/common';
import { ProductModelService } from '../../services/product-model.service'
import { ScriptsService } from 'src/app/services/scripts.service';
import { BaseComponent } from 'src/app/base/base.component';

const scripts = [
  "../../assets/js/demo/datatables-demo.js"
]

class ProductModelToDisplay {
  constructor(
    public checked : boolean,
    public productModel : ProductModel
  ) { }
}

@Component({
  selector: 'app-list-product-models',
  templateUrl: './list-product-models.component.html',
  styleUrls: ['./list-product-models.component.scss']
})
export class ListProductModelsComponent extends BaseComponent implements OnInit {

  productModelsToDisplay : ProductModelToDisplay[] = []
  message : string

  public constructor(
    private productModelService : ProductModelService,
    private activatedRoute : ActivatedRoute,
    scriptService : ScriptsService,
    router : Router,
    location : Location
  ) {
    super(scriptService, location, router)
   }

   public ngOnInit(): void {
    this.productModelService.getAllProductModels().subscribe(
      data => {
        this.displayProductModels(data)
      }
    )
  }

  public ngAfterContentInit(): void {
    this.loadScripts(scripts)
  }

  public updateProductModel(selectedProductModelId : number): void {
    this.router.navigate(['productModels', selectedProductModelId])
  }

  public deleteProductModel(selectedProductModelId : number): void {
    this.productModelService.deleteProductModel(selectedProductModelId).subscribe(
      () => {
        this.message = `Deleted ProductModel!`
        this.refreshProductModels()
      }
    )
  }

  public deleteSelectedProductModels(): void {
    new Promise((resolve) => {
     this.productModelsToDisplay
      .filter(ProductModelToDisplay => ProductModelToDisplay.checked)
      .forEach((selectedProductModel, index, array) => {
        this.productModelService.deleteProductModel(selectedProductModel.productModel.id).subscribe(
        () => {
          this.message = `Deleted!`
          if (index === array.length -1) resolve(true);
        })
      })
    }).then(() => {
      this.refreshProductModels()
    });
  }

  public refreshProductModels(): void {
    this.productModelService.getAllProductModels().subscribe(
      data => {
        this.displayProductModels(data);
      }
    )
  }

  public displayProductModels(ProductModels : ProductModel[]): void {
    this.productModelsToDisplay = []
    ProductModels.forEach((ProductModel) => {
      this.productModelsToDisplay.push(
        new ProductModelToDisplay(false, ProductModel)
      )
    })
  }

}
