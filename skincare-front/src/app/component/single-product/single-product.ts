import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { SingleProduct } from '../../service/single-product';

@Component({
  selector: 'app-single-product',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './single-product.html',
  styleUrls: ['./single-product.css']
})
export class SingleProductComponent implements OnInit {

  product = signal<any>(null);
  related: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private productService: SingleProduct
  ) {}

  ngOnInit(): void {

    const slug = this.route.snapshot.paramMap.get('slug');

    if (slug) {

      this.productService.getSingleProduct(slug).subscribe({
        next: (res: any) => {

          console.log('API Response:', res);

          this.product.set(res.data.product);
          console.log(this.product)
          if(res.data.related){
            this.related = res.data.related;
          }

        },
        error: (err) => {
          console.error('Product load error', err);
        }
      });

    }

  }
}