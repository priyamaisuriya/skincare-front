import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

 getProducts(category:any='',search:any='',sort:any=''){
 return this.http.get(
 'http://127.0.0.1:8000/api/products?category='+category+'&search='+search+'&sort='+sort
 );
}

getCategories(){
 return this.http.get('http://127.0.0.1:8000/api/categories');
}

}