import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { SingleProduct } from '../../service/single-product';

@Component({
  selector: 'app-single-product',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './single-product.html',
  styleUrls: ['./single-product.css']
})
export class SingleProductComponent implements OnInit {

  product = signal<any>(null);          // Holds single product data
  related = signal<any[]>([]);          // Holds related products array

  constructor(
    private route: ActivatedRoute,
    private productService: SingleProduct
  ) {}

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (!slug) return;

    this.productService.getSingleProduct(slug).subscribe({
      next: (res: any) => {
        this.product.set(res?.data?.product || null);
        this.related.set(res?.data?.related || []); 
      },
      error: (err) => console.error('Product load error', err)
    });
  }

  // Add to cart function
  addToCart(product: any) {
    console.log('Added to cart:', product);
    // TODO: Call your CartService here
  }
}