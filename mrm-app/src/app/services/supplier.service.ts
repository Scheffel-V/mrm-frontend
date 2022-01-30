import { Injectable } from '@angular/core';
import { HttpClient, HttpBackend} from '@angular/common/http';
import { API_URL } from '../app.constants';
import { Observable } from 'rxjs';
import { Supplier } from '../models/supplier.model'


@Injectable({
  providedIn: 'root'
})
export class SupplierService {

  private httpClientWithoutInterceptor : HttpClient

  constructor(
    private http : HttpClient,
    private httpBackend: HttpBackend
  ) { 
    this.httpClientWithoutInterceptor = new HttpClient(httpBackend)
  }

  getAllSuppliers() : Observable<Supplier[]> {
    return this.http.get<Supplier[]>(`${API_URL}/suppliers`)
  }

  getAllActiveSuppliers() : Observable<Supplier[]> {
    return this.http.get<Supplier[]>(`${API_URL}/suppliers?active=true`)
  }

  getSupplier(supplierId : number) : Observable<Supplier> {
    return this.http.get<Supplier>(`${API_URL}/suppliers/${supplierId}`)
  }

  createSupplier(supplier : Supplier) : Observable<Supplier> {
    return this.http.post<Supplier>(
      `${API_URL}/suppliers`,
      supplier
    )
  }

  updateSupplier(supplier : Supplier) : Observable<Supplier> {
    return this.http.put<Supplier>(
      `${API_URL}/suppliers/${supplier.id}`,
      supplier
    )
  }

  deleteSupplier(supplierId : number) {
    //@TODO: handle de erros
    return this.http.delete(`${API_URL}/suppliers/${supplierId}`)
  }

  searchCnpj(cnpj : string) {
    return this.httpClientWithoutInterceptor.get(`https://api-publica.speedio.com.br/buscarcnpj?cnpj=${cnpj}`)
  }
}
