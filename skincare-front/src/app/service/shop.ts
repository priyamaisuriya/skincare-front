import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Shop {

  private apiUrl = 'http://127.0.0.1:8000/api/front/shop';

  constructor(private http: HttpClient) {}

  // All Products
  getShopData(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  // Category wise products
  getShopByCategory(slug:any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?category=${slug}`);
  }

}