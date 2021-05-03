import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { API_URL } from '../app.constants';
import { Observable } from 'rxjs';
import { ProductModel } from '../models/product-model.model'


@Injectable({
  providedIn: 'root'
})
export class ProductModelService {

  constructor(
    private http : HttpClient
  ) { }

  getAllProductModels() : Observable<ProductModel[]> {
    return this.http.get<ProductModel[]>(`${API_URL}/productModels`)
  }

  getProductModel(productModelId : number) : Observable<ProductModel> {
    return this.http.get<ProductModel>(`${API_URL}/productModels/${productModelId}`)
  }

  createProductModel(productModel : ProductModel) : Observable<ProductModel> {
    return this.http.post<ProductModel>(
      `${API_URL}/productModels`,
      productModel
    )
  }

  updateProductModel(productModel : ProductModel) : Observable<ProductModel> {
    return this.http.put<ProductModel>(
      `${API_URL}/productModels/${productModel.id}`,
      productModel
    )
  }

  deleteProductModel(productModelId : number) {
    //@TODO: handle de erros
    return this.http.delete(`${API_URL}/productModels/${productModelId}`)
  }
}
