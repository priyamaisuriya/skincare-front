import { Component, OnInit, signal, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../service/cart';
import { StateService } from '../../service/state';
import { AuthService } from '../../service/auth';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './checkout.html',
  styleUrls: ['./checkout.css']
})
export class CheckoutComponent implements OnInit {

  checkoutForm: FormGroup;
  cartItems = signal<any[]>([]);
  totalAmount = signal<number>(0);
  states = signal<any[]>([]);
  
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private stateService: StateService,
    private authService: AuthService,
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    const user = this.authService.currentUser();
    
    this.checkoutForm = this.fb.group({
      firstname: [user?.first_name || '', Validators.required],
      lastname: [user?.last_name || '', Validators.required],
      address: [user?.address || '', Validators.required],
      city: [user?.city || '', Validators.required],
      state: [user?.state || '', Validators.required],
      zip: [user?.postal_code || '', Validators.required],
      email: [user?.email || '', [Validators.required, Validators.email]],
      phone: [user?.phone_number || '', Validators.required],
      payment_method: ['cod', Validators.required]
    });
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      if (!this.authService.isLoggedIn()) {
        alert('Please login to proceed to checkout.');
        this.router.navigate(['/account']);
        return;
      }
    } else {
      // On server, we don't know the login status yet, so we don't redirect.
      // This prevents hard-refresh redirection issues.
    }

    this.loadCart();
    this.loadStates();
  }

  loadCart() {
    this.cartService.getCartItems().subscribe({
      next: (res: any) => {
        const items = res.items || [];
        this.cartItems.set(items);
        this.calculateTotal(items);
      },
      error: (err) => console.error('Failed to load cart', err)
    });
  }

  loadStates() {
    this.stateService.getStates().subscribe({
      next: (res: any) => {
        this.states.set(res.data || []);
      },
      error: (err) => console.error('Failed to load states', err)
    });
  }

  calculateTotal(items: any[]) {
    let total = 0;
    items.forEach(item => {
      total += item.quantity * item.product.amount;
    });
    this.totalAmount.set(total);
  }

  onOrder() {
    this.errorMessage.set(null);
    if (this.checkoutForm.valid) {
      if (this.checkoutForm.value.payment_method === 'online_payment') {
        // Here we could integrate Razorpay
        this.errorMessage.set("Online payment is not yet implemented. Please use COD.");
        return;
      }

      this.http.post('http://127.0.0.1:8000/api/front/checkout', this.checkoutForm.value).subscribe({
        next: (res: any) => {
          if (isPlatformBrowser(this.platformId)) {
            alert('Order placed successfully!');
          }
          this.router.navigate(['/thank-you'], { queryParams: { order_id: res.order.id } });
        },
        error: (err) => {
          this.errorMessage.set(err.error?.error || 'Order placement failed');
        }
      });
    } else {
      this.errorMessage.set('Please fill in all required fields.');
    }
  }
}
