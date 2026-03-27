import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private apiUrl = 'http://127.0.0.1:8000/api/front/orders';

  constructor(private http: HttpClient) { }

  getMyOrders(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getOrderDetails(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

}
