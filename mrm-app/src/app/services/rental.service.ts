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
    return this.http.get<Rental[]>(`${API_URL}/rentals`)
  }

  getRental(rentalId : number) : Observable<Rental> {
    return this.http.get<Rental>(`${API_URL}/rentals/${rentalId}`)
  }

  createRental(rental : Rental) : Observable<Rental> {
    return this.http.post<Rental>(
      `${API_URL}/rentals`,
      rental
    )
  }

  updateRental(rental : Rental) : Observable<Rental> {
    return this.http.put<Rental>(
      `${API_URL}/rentals/${rental.id}`,
      rental
    )
  }

  deleteRental(rentalId : number) {
    //@TODO: handle de erros
    return this.http.delete(`${API_URL}/rentals/${rentalId}`)
  }
}