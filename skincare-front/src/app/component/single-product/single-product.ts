import { Component, OnInit, signal, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { SingleProduct } from '../../service/single-product';
import { CartService } from '../../service/cart';
import { AuthService } from '../../service/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-single-product',
  standalone: true,
  imports: [CommonModule, RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './single-product.html',
  styleUrls: ['./single-product.css']
})
export class SingleProductComponent implements OnInit {

  product = signal<any>(null);           
  related = signal<any[]>([]);          

  constructor(
    private route: ActivatedRoute,
    private productService: SingleProduct,
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Subscribe to slug changes
    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug');
      if (!slug) return;

      this.loadProduct(slug);
      window.scroll(0,0)
    });
  }

  loadProduct(slug: string) {
    this.productService.getSingleProduct(slug).subscribe({
      next: (res: any) => {
        this.product.set(res?.data?.product || null);
        this.related.set(res?.data?.related || []);
        console.table(res.data.related)
      },
      error: (err) => console.error('Product load error', err)
    });
  }

  addToCart(productId: number): void {
    if (!this.authService.isLoggedIn()) {
      alert('Please login first!');
      return;
    }
    this.cartService.addToCart(productId).subscribe({
      next: (res) => {
        this.router.navigate(['/cart']);
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