import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SingleProduct {

  private apiUrl = 'http://127.0.0.1:8000/api/front/products';

  constructor(private http: HttpClient) {}

  getSingleProduct(slug: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${slug}`);
  }

}