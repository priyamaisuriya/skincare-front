import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private apiUrl = 'http://127.0.0.1:8000/api/cart-items';
  private cartUpdated = new Subject<void>();

  constructor(private http: HttpClient) {}

  get cartUpdated$() {
    return this.cartUpdated.asObservable();
  }

  getCartItems(isWishlist: boolean = false): Observable<any> {
    return this.http.get(`${this.apiUrl}?is_wishlist=${isWishlist ? 1 : 0}`);
  }

  addToCart(productId: number, isWishlist: boolean = false): Observable<any> {
    const payload = {
      product_id: productId,
      quantity: 1,
      is_wishlist: isWishlist ? 1 : 0
    };
    return this.http.post(this.apiUrl, payload).pipe(
      tap(() => this.cartUpdated.next())
    );
  }

  updateQuantity(itemId: number, quantity: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${itemId}`, { quantity }).pipe(
      tap(() => this.cartUpdated.next())
    );
  }

  removeItem(itemId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${itemId}`).pipe(
      tap(() => this.cartUpdated.next())
    );
  }

}
