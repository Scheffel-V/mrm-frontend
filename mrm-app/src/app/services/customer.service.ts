import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { API_URL } from '../app.constants';
import { Observable } from 'rxjs';
import { Customer } from '../models/customer.model'

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(
    private http : HttpClient
  ) { }

  getAllCustomers() : Observable<Customer[]> {
    return this.http.get<Customer[]>(`${API_URL}/customers`)
  }

  getCustomer(customerId : number) : Observable<Customer> {
    return this.http.get<Customer>(`${API_URL}/customers/${customerId}`)
  }

  createCustomer(customer : Customer) : Observable<Customer> {
    return this.http.post<Customer>(
      `${API_URL}/customers`,
      customer
    )
  }

  updateCustomer(customer : Customer) : Observable<Customer> {
    return this.http.put<Customer>(
      `${API_URL}/customers/${customer.id}`,
      customer
    )
  }

  deleteCustomer(customerId : number) {
    //@TODO: handle de erros
    return this.http.delete(`${API_URL}/customers/${customerId}`)
  }

  searchCnpj(cnpj : string) {
    return this.http.get(`https://api-publica.speedio.com.br/buscarcnpj?cnpj=${cnpj}`)
  }
}
