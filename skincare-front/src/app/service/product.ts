import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) {}

  // All Products / Category Products
  getProducts(category:any='', search:any='', sort:any=''){
    return this.http.get(
      `http://127.0.0.1:8000/api/front/shop?category=${category}&search=${search}&sort=${sort}`
    );
  }

  // New Products
  getNewProducts(){
    return this.getProducts('', '', 'new');
  }

  // Categories
  getCategories(){
    return this.http.get(
      'http://127.0.0.1:8000/api/categories'
    );
  }

  // Single Product
  getSingleProduct(slug:any){
    return this.http.get(
      `http://127.0.0.1:8000/api/front/products/${slug}`
    );
  }

}