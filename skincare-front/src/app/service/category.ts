import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  api = "http://127.0.0.1:8000/api/front/";

  constructor(private http: HttpClient) {}

  // Get all categories
  getCategories(): Observable<any> {
    return this.http.get(this.api + 'categories');
  }

  // Get menu categories (optional)
  getMenuCategories(): Observable<any> {
    return this.http.get(this.api + 'categories/menu');
  }

  // Get products by category slug
  getCategoryProducts(slug: string): Observable<any> {
    return this.http.get(`${this.api}categories/${slug}`);
  }
}