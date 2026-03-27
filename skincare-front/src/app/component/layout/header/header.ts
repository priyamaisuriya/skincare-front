import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, CUSTOM_ELEMENTS_SCHEMA, signal, Inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CategoryService } from '../../../service/category';
import { CartService } from '../../../service/cart';
import { AuthService } from '../../../service/auth';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header implements OnInit {

  categories = signal<any[]>([]);

  settings = signal<any>({
    logo: '',
    site_name: '',
    favicon: ''
  });

  cartItems = signal<any[]>([]);
  cartCount = signal<number>(0);
  totalAmount = signal<number>(0);

  constructor(
    private category: CategoryService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private cartService: CartService,
    public authService: AuthService,
    private router: Router,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadSettings();
    if (this.authService.isLoggedIn()) {
      this.loadCart();
    }

    this.cartService.cartUpdated$.subscribe(() => {
      if (this.authService.isLoggedIn()) {
        this.loadCart();
      }
    });
  }

  loadCategories() {
    this.category.getCategories().subscribe({
      next: (res: any) => {
        this.categories.set(res?.data || []);
        this.cdr.markForCheck();
      },
      error: (err: any) => console.error(err)
    });
  }

  loadSettings() {
    this.http.get('http://127.0.0.1:8000/api/front/settings/1')
      .subscribe((res: any) => {

        const data = res.data;

        this.settings.set(data);

        if (data.favicon) {
          this.setFavicon('http://127.0.0.1:8000/storage/' + data.favicon);
        }

        this.cdr.markForCheck();
      });
  }

  setFavicon(iconUrl: string) {
    const link: HTMLLinkElement | null = this.document.querySelector('#appFavicon');

    if (link) {
      link.href = iconUrl;
    }
  }


  loadCart() {
    this.cartService.getCartItems().subscribe({
      next: (res: any) => {
        // Based on the Laravel controller output
        // res.count is total quantity
        this.cartCount.set(res.count || 0);
        this.cartItems.set(res.items || []);
        const total = (res.items || []).reduce((acc: number, item: any) => acc + (item.product?.amount * item.quantity), 0);
        this.totalAmount.set(total);
        this.cdr.markForCheck();
      },
      error: (err: any) => {
        this.cartCount.set(0);
        this.cdr.markForCheck();
      }
    });
  }

  removeFromCart(itemId: number): void {
    this.cartService.removeItem(itemId).subscribe({
      next: () => this.loadCart(),
      error: (err) => console.error('Failed to remove item', err)
    });
  }

  updateQuantity(itemId: number, quantity: any): void {
    const qty = parseInt(quantity);
    if (qty < 1) return;
    this.cartService.updateQuantity(itemId, qty).subscribe({
      next: () => this.loadCart(),
      error: (err) => console.error('Failed to update quantity', err)
    });
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/account']);
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Logout failed', err);
        // Fallback: clear local session even if API fails
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        this.router.navigate(['/account']);
      }
    });
  }

}