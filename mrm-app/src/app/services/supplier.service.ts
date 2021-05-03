import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { API_URL } from '../app.constants';
import { Observable } from 'rxjs';
import { Supplier } from '../models/supplier.model'


@Injectable({
  providedIn: 'root'
})
export class SupplierService {

  constructor(
    private http : HttpClient
  ) { }

  getAllSuppliers() : Observable<Supplier[]> {
    return this.http.get<Supplier[]>(`${API_URL}/suppliers`)
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
    return this.http.delete(`${API_URL}/Suppliers/${supplierId}`)
  }
}
