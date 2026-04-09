import { Component, OnInit, signal, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CartService } from '../../service/cart';
import { AuthService } from '../../service/auth';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class CartComponent implements OnInit {

  cartItems = signal<any[]>([]);
  totalAmount = signal<number>(0);

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.cartService.getCartItems().subscribe({
      next: (res) => {
        const items = res.items || [];
        this.cartItems.set(items);
        this.calculateTotal(items);
      },
      error: (err) => console.error('Failed to load cart', err)
    });
  }

  calculateTotal(items: any[]): void {
    const total = items.reduce((acc, item) => acc + (item.quantity * (item.product?.amount || 0)), 0);
    this.totalAmount.set(total);
  }

  increaseQty(itemId: number, currentQty: number): void {
    const items = this.cartItems();
    const item = items.find(i => i.id === itemId);
    if (item) {
      item.quantity = currentQty + 1;
      this.cartItems.set(items);
    }
    this.cartService.updateQuantity(itemId, currentQty + 1).subscribe({
      next: () => this.loadCart()
    });
  }

  decreaseQty(itemId: number, currentQty: number): void {
    if (currentQty <= 1) return;
    const items = this.cartItems();
    const item = items.find(i => i.id === itemId);
    if (item) {
      item.quantity = currentQty - 1;
      this.cartItems.set(items);
    }
    this.cartService.updateQuantity(itemId, currentQty - 1).subscribe({
      next: () => this.loadCart()
    });
  }

  removeCartItem(id: number): void {
    if (!confirm('Remove this item from cart?')) return;
    this.cartService.removeItem(id).subscribe({
      next: () => this.loadCart()
    });
  }

  proceedToCheckout(): void {
    this.router.navigate(['/checkout']);
  }
}
