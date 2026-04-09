import { Component, OnInit, signal, CUSTOM_ELEMENTS_SCHEMA, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { OrderService } from '../../service/order';
import { AuthService } from '../../service/auth';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './order-details.html',
  styleUrls: ['./order-details.css']
})
export class OrderDetailsComponent implements OnInit {

  orderId = signal<string | null>(null);
  order = signal<any>(null);
  isLoading = signal<boolean>(true);

  constructor(
    private route: ActivatedRoute,
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
    }

    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.orderId.set(id);
        this.loadOrderDetails(id);
      }
    });
  }

  loadOrderDetails(id: string) {
    this.isLoading.set(true);
    this.orderService.getOrderDetails(id).subscribe({
      next: (res: any) => {
        if (res.status === 'success') {
          this.order.set(res.data);
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load order details', err);
        this.isLoading.set(false);
      }
    });
  }

  getStatusBadgeClass(status: string): string {
    if (!status) return 'bg-dark text-white';
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
