import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { API_URL } from '../app.constants';
import { Observable } from 'rxjs';
import { Rental } from '../models/rental.model'

@Injectable({
  providedIn: 'root'
})
export class RentalService {

  constructor(
    private http : HttpClient
  ) { }

  getAllRentals() : Observable<Rental[]> {
    return this.http.get<Rental[]>(`${API_URL}/rentContracts`)
  }

  getRental(rentalId : number) : Observable<Rental> {
    return this.http.get<Rental>(`${API_URL}/rentContracts/${rentalId}`)
  }

  createRental(rental : Rental) : Observable<Rental> {
    return this.http.post<Rental>(
      `${API_URL}/rentContracts`,
      rental
    )
  }

  updateRental(rental : Rental) : Observable<Rental> {
    return this.http.put<Rental>(
      `${API_URL}/rentContracts/${rental.id}`,
      rental
    )
  }

  deleteRental(rentalId : number) {
    //@TODO: handle de erros
    return this.http.delete(`${API_URL}/rentContracts/${rentalId}`)
  }

  getAllActiveRentals() : Observable<Rental[]> {
    return this.http.get<Rental[]>(`${API_URL}/rentContracts/active`)
  }

  getRevenue() : Observable<Object> {
    return this.http.get<Object>(`${API_URL}/rentContracts/revenue`)
  }

  getRevenueFromDate(formattedStartDate, formattedEndDate) {
    return this.http.get<Object>(`${API_URL}/rentContracts/revenue/from/${formattedStartDate}/to/${formattedEndDate}`)
  }

  getRevenueFromLastTwelveMonths() {
    return this.http.get<Object>(`${API_URL}/rentContracts/revenue/last_twelve_months`)
  }

  getInvoicedValue() : Observable<Object> {
    return this.http.get<Object>(`${API_URL}/rentContracts/invoicedValue`)
  }
}
