import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { API_URL } from '../app.constants';
import { Observable } from 'rxjs';
import { ItemRental } from '../models/item-rental.model'

@Injectable({
  providedIn: 'root'
})
export class ItemRentalService {

  constructor(
    private http : HttpClient
  ) { }

  getAllItemRentals() : Observable<ItemRental[]> {
    return this.http.get<ItemRental[]>(`${API_URL}/itemRentals`)
  }

  getAllItemRentalsInInventory() : Observable<ItemRental[]> {
    return this.http.get<ItemRental[]>(`${API_URL}/itemRentals?status=INVENTORY`)
  }

  getItemRental(itemRentalId : number) : Observable<ItemRental> {
    return this.http.get<ItemRental>(`${API_URL}/itemRentals/${itemRentalId}`)
  }

  createItemRental(itemRental : ItemRental) : Observable<ItemRental> {
    return this.http.post<ItemRental>(
      `${API_URL}/itemRentals`,
      itemRental
    )
  }

  updateItemRental(itemRental : ItemRental) : Observable<ItemRental> {
    return this.http.put<ItemRental>(
      `${API_URL}/itemRentals/${itemRental.id}`,
      itemRental
    )
  }

  deleteItemRental(itemRentalId : number) {
    //@TODO: handle de erros
    return this.http.delete(`${API_URL}/itemRentals/${itemRentalId}`)
  }

  sendToMaintenance(itemRental : ItemRental) : Observable<ItemRental> {
    return this.http.put<ItemRental>(
      `${API_URL}/itemRentals/maintenance/send/${itemRental.id}`,
      itemRental.comment)
  }

  releaseFromMaintenance(itemRental : ItemRental) : Observable<ItemRental> {
    return this.http.put<ItemRental>(
      `${API_URL}/itemRentals/maintenance/release/${itemRental.id}`,
      itemRental.comment)
  }

  leave(itemRental : ItemRental) : Observable<ItemRental> {
    return this.http.put<ItemRental>(
      `${API_URL}/itemRentals/rental/leave/${itemRental.id}`,
      itemRental.comment)
  }

  arrive(itemRental : ItemRental) : Observable<ItemRental> {
    return this.http.put<ItemRental>(
      `${API_URL}/itemRentals/rental/arrive/${itemRental.id}`,
      itemRental.comment)
  }

  readyForLeave(itemRental : ItemRental) : Observable<ItemRental> {
    return this.http.put<ItemRental>(
      `${API_URL}/itemRentals/rental/leave/${itemRental.id}`,
      itemRental.comment)
  }
}
