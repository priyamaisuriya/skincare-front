import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NewArrivalsService {

  private apiUrl = 'http://127.0.0.1:8000/api/front';

  constructor(private http: HttpClient) {}

  getNewProducts() {
    return this.http.get(`${this.apiUrl}/new-products`);
  }
}