import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { API_URL } from '../app.constants';
import { Observable } from 'rxjs';
import { StockItemEvent } from '../models/stock-item-event.model'

@Injectable({
  providedIn: 'root'
})
export class StockItemEventService {

  constructor(
    private http : HttpClient
  ) { }

  getAllStockItemEvents() : Observable<StockItemEvent[]> {
    return this.http.get<StockItemEvent[]>(`${API_URL}/stockItemEvents`)
  }

  getStockItemEvent(stockItemEventId : number) : Observable<StockItemEvent> {
    return this.http.get<StockItemEvent>(`${API_URL}/stockItemEvents/${stockItemEventId}`)
  }
}
