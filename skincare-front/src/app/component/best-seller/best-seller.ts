import { Component, OnInit, signal, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CartService } from '../../service/cart';
import { AuthService } from '../../service/auth';

@Component({
  selector: 'app-best-seller',
  standalone: true,
  imports: [CommonModule, RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './best-seller.html',
  styleUrls: ['./best-seller.css']
})

export class BestSeller implements OnInit {

  products = signal<any[]>([]);
  categories = signal<any[]>([]);
  allProducts:any[] = [];

  apiUrl = 'http://127.0.0.1:8000/api/front';

  constructor(
    private http:HttpClient,
    private cartService: CartService,
    private authService: AuthService
  ){}

  ngOnInit(): void {

    this.loadProducts();
    this.loadCategories();

  }

  // BEST SELLER PRODUCTS
  loadProducts(){

    this.http.get<any>(`${this.apiUrl}/best-sellers`)
    .subscribe(res=>{

      const data = res.data ?? res;

      this.products.set(data);
      this.allProducts = data;

    });

  }

  // LOAD CATEGORIES
  loadCategories(){

    this.http.get<any>(`${this.apiUrl}/categories`)
    .subscribe(res=>{

      const data = res.data ?? res;

      this.categories.set(data);

    });

  }

  // SORT PRODUCTS
  sortProduct(event:any){

    const value = event.target.value;
    let sorted = [...this.products()];

    if(value === 'name_asc'){
      sorted.sort((a,b)=>a.name.localeCompare(b.name));
    }

    if(value === 'name_desc'){
      sorted.sort((a,b)=>b.name.localeCompare(a.name));
    }

    if(value === 'price_low'){
      sorted.sort((a,b)=>a.amount - b.amount);
    }

    if(value === 'price_high'){
      sorted.sort((a,b)=>b.amount - a.amount);
    }

    if(value === ''){
      sorted = [...this.allProducts];
    }

    this.products.set(sorted);

  }

  // SEARCH PRODUCT
  searchProduct(event:any){

    const text = event.target.value.toLowerCase();

    if(!text){
      this.products.set(this.allProducts);
      return;
    }

    const filtered = this.allProducts.filter(p =>
      p.name?.toLowerCase().includes(text)
    );

    this.products.set(filtered);

  }

  // CATEGORY FILTER
  categoryFilter(id:any){

    if(!id){
      this.products.set(this.allProducts);
      return;
    }

    const filtered = this.allProducts.filter(p =>
      p.category_id === id || p.category?.id === id
    );

    this.products.set(filtered);

  }

  // PRICE FILTER
  priceFilter(min:number,max:number){

    const filtered = this.allProducts.filter(p=>{

      if(max === 0){
        return p.amount >= min;
      }

      return p.amount >= min && p.amount <= max;

    });

    this.products.set(filtered);

  }

  addToCart(productId: number): void {
    if (!this.authService.isLoggedIn()) {
      alert('Please login first!');
      return;
    }
    this.cartService.addToCart(productId).subscribe({
      next: (res) => {
        alert('Product added to cart!');
      },
      error: (err) => {
        console.error('Add to cart failed', err);
      }
    });
  }

  addToWishlist(productId: number): void {
    if (!this.authService.isLoggedIn()) {
      alert('Please login first!');
      return;
    }
    this.cartService.addToCart(productId, true).subscribe({
      next: (res) => {
        alert('Product added to wishlist!');
      },
      error: (err) => {
        console.error('Add to wishlist failed', err);
      }
    });
  }

}