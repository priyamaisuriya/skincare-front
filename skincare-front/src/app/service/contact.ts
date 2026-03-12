import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  api = "http://127.0.0.1:8000/api/front/contact"; // Laravel API endpoint

  constructor(private http: HttpClient) { }

  saveContact(data: any): Observable<any> {
    return this.http.post(this.api, data);
  }
}