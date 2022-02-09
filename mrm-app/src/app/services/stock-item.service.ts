import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse} from '@angular/common/http';
import { API_URL } from '../app.constants';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { StockItem } from '../models/stock-item.model'

@Injectable({
  providedIn: 'root'
})
export class StockItemService {

  constructor(
    private http : HttpClient
  ) { }

  getAllStockItems() : Observable<StockItem[]> {
    return this.http.get<StockItem[]>(`${API_URL}/stockItems`)
  }

  getAllStockItemsInInventory() : Observable<StockItem[]> {
    return this.http.get<StockItem[]>(`${API_URL}/stockItems?status=INVENTORY`)
  }

  getStockItem(stockItemId : number) : Observable<StockItem> {
    return this.http.get<StockItem>(`${API_URL}/stockItems/${stockItemId}`)
  }

  createStockItem(stockItem : StockItem) : Observable<StockItem> {
    return this.http.post<StockItem>(
      `${API_URL}/stockItems`,
      stockItem
    ).pipe(
      catchError((err: HttpErrorResponse) => {
        return throwError(err);  
      })
    )
  }

  updateStockItem(stockItem : StockItem) : Observable<StockItem> {
    return this.http.put<StockItem>(
      `${API_URL}/stockItems/${stockItem.id}`,
      stockItem
    ).pipe(
      catchError((err: HttpErrorResponse) => {
        return throwError(err);  
      })
    )
  }

  deleteStockItem(stockItemId : number) {
    //@TODO: handle de erros
    return this.http.delete(`${API_URL}/stockItems/${stockItemId}`)
  }

  sendToMaintenance(stockItem : StockItem) : Observable<StockItem> {
    return this.http.put<StockItem>(
      `${API_URL}/stockItems/maintenance/send/${stockItem.id}`,
      stockItem.comment)
  }

  releaseFromMaintenance(stockItem : StockItem) : Observable<StockItem> {
    return this.http.put<StockItem>(
      `${API_URL}/stockItems/maintenance/release/${stockItem.id}`,
      stockItem.comment)
  }

  leave(stockItem : StockItem) : Observable<StockItem> {
    return this.http.put<StockItem>(
      `${API_URL}/stockItems/rental/leave/${stockItem.id}`,
      stockItem.comment)
  }

  arrive(stockItem : StockItem) : Observable<StockItem> {
    return this.http.put<StockItem>(
      `${API_URL}/stockItems/rental/arrive/${stockItem.id}`,
      stockItem.comment)
  }

  readyForLeave(stockItem : StockItem) : Observable<StockItem> {
    return this.http.put<StockItem>(
      `${API_URL}/stockItems/rental/leave/${stockItem.id}`,
      stockItem.comment)
  }
}
