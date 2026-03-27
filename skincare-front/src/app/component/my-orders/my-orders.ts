import { Component, OnInit, signal, CUSTOM_ELEMENTS_SCHEMA, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { OrderService } from '../../service/order';
import { AuthService } from '../../service/auth';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule, RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './my-orders.html',
  styleUrls: ['./my-orders.css']
})
export class MyOrdersComponent implements OnInit {

  orders = signal<any[]>([]);
  isLoading = signal<boolean>(true);

  constructor(
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
        if (!this.authService.isLoggedIn()) {
            this.router.navigate(['/account']);
            return;
        }
    } else {
        return;
    }
    this.loadOrders();
  }

  loadOrders() {
    this.orderService.getMyOrders().subscribe({
      next: (res: any) => {
        this.orders.set(res.data || []);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load orders', err);
        this.isLoading.set(false);
      }
    });
  }

  getStatusBadgeClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-warning text-dark';
      case 'confirmed': return 'bg-info text-white';
      case 'processing': return 'bg-primary text-white';
      case 'shipped': return 'bg-secondary text-white';
      case 'delivered': return 'bg-success text-white';
      case 'cancelled': return 'bg-danger text-white';
      default: return 'bg-dark text-white';
    }
  }

}
