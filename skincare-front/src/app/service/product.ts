import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

  // All Products
  getProducts(category:any='', search:any='', sort:any=''){
    return this.http.get(
      'http://127.0.0.1:8000/api/products?category='+category+'&search='+search+'&sort='+sort
    );
  }

  // Categories
  getCategories(){
    return this.http.get('http://127.0.0.1:8000/api/categories');
  }

  // Single Product by ID
  getSingleProduct(id:any){
    return this.http.get('http://127.0.0.1:8000/api/products/' + id);
  }

}