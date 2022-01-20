import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpBackend} from '@angular/common/http';
import { API_URL } from '../app.constants';
import { Observable } from 'rxjs';
import { Customer } from '../models/customer.model'

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private httpClientWithoutInterceptor : HttpClient

  constructor(
    private http : HttpClient,
    private httpBackend: HttpBackend
  ) { 
    this.httpClientWithoutInterceptor = new HttpClient(httpBackend)
  }

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
    return this.httpClientWithoutInterceptor.get(`https://api-publica.speedio.com.br/buscarcnpj?cnpj=${cnpj}`)
  }

  getAllCustomersWithActiveContract() : Observable<Customer[]> {
    return this.http.get<Customer[]>(`${API_URL}/customers/with_active_contracts`)
  }
}
