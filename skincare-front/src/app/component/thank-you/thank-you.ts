import { Component, OnInit, signal, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-thank-you',
  standalone: true,
  imports: [CommonModule, RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './thank-you.html',
  styleUrls: ['./thank-you.css']
})
export class ThankYouComponent implements OnInit {

  orderId = signal<string | null>(null);
  order = signal<any>(null);

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['order_id']) {
        this.orderId.set(params['order_id']);
        this.loadOrderDetails(params['order_id']);
      }
    });
  }

  loadOrderDetails(id: string) {
    this.http.get(`http://127.0.0.1:8000/api/front/orders/${id}`).subscribe({
      next: (res: any) => {
        if (res.status === 'success') {
          this.order.set(res.data);
        }
      },
      error: (err) => console.error('Failed to load order details', err)
    });
  }

}
