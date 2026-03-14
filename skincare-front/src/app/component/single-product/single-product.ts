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

  product = signal<any>(null);           
  related = signal<any[]>([]);          

  constructor(
    private route: ActivatedRoute,
    private productService: SingleProduct
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

  addToCart(product: any) {
    console.log('Added to cart:', product);
  }
}