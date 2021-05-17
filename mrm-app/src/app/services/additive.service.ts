import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { API_URL } from '../app.constants';
import { Observable } from 'rxjs';
import { Additive } from '../models/additive.model'

@Injectable({
  providedIn: 'root'
})
export class AdditiveService {

  constructor(
    private http : HttpClient
  ) { }

  getAllAdditives() : Observable<Additive[]> {
    return this.http.get<Additive[]>(`${API_URL}/additives`)
  }

  getAdditive(additiveId : number) : Observable<Additive> {
    return this.http.get<Additive>(`${API_URL}/additives/${additiveId}`)
  }

  createAdditive(additive : Additive) : Observable<Additive> {
    return this.http.post<Additive>(
      `${API_URL}/additives`,
      additive
    )
  }

  updateAdditive(additive : Additive) : Observable<Additive> {
    return this.http.put<Additive>(
      `${API_URL}/additives/${additive.id}`,
      additive
    )
  }

  deleteAdditive(additiveId : number) {
    //@TODO: handle de erros
    return this.http.delete(`${API_URL}/additives/${additiveId}`)
  }

  searchCnpj(cnpj : string) {
    return this.http.get(`https://api-publica.speedio.com.br/buscarcnpj?cnpj=${cnpj}`)
  }
}
