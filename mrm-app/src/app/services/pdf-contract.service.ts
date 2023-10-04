import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { API_URL } from '../app.constants';
import { Observable } from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class PdfContractService {

  constructor(private http: HttpClient) {}

  public uploadPdfContract(contractId: number, pdf: File): Observable<Object> {
    const formData = new FormData();

    formData.append('pdf', pdf);

    return this.http.post(`${API_URL}/pdfContract/${contractId}`, formData)
  }

  public getPdfContract(pdfContractId: number): Observable<Blob> {
    return this.http.get(`${API_URL}/pdfContract/${pdfContractId}`, { responseType: 'blob' });
  }
}
