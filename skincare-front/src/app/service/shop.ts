import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class Shop {
  private apiUrl = 'http://127.0.0.1:8000/api/front/shop'; 

  constructor(private http: HttpClient) {}

  getShopData(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
