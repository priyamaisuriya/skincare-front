import { Component, OnInit, signal, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../service/cart';
import { AuthService } from '../../service/auth';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './wishlist.html',
  styleUrls: ['./wishlist.css']
})
export class WishlistComponent implements OnInit {

  wishlistItems = signal<any[]>([]);

  constructor(
    private cartService: CartService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.loadWishlist();
    }
  }

  loadWishlist() {
    this.cartService.getCartItems(true).subscribe({
      next: (res: any) => {
        // The server now returns items for the specific cart type
        this.wishlistItems.set(res.items || []);
      },
      error: (err) => console.error('Wishlist load error', err)
    });
  }

  addToCart(productId: number) {
    this.cartService.addToCart(productId).subscribe(() => {
      alert('Product added to cart!');
    });
  }

  removeFromWishlist(itemId: number) {
    this.cartService.removeItem(itemId).subscribe(() => {
      this.loadWishlist();
    });
  }

}
