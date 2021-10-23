import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { API_URL } from '../app.constants';
import { Observable } from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private http: HttpClient) {}

  public uploadImage(stockItemId : number, image: File): Observable<Object> {
    const formData = new FormData();

    formData.append('image', image);

    return this.http.post(`${API_URL}/image/${stockItemId}`, formData)
  }

  public getImage(stockItemId : number): Observable<Blob> {
    return this.http.get(`${API_URL}/image/${stockItemId}`, { responseType: 'blob' });
  }
}