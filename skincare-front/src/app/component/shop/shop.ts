import { Component, OnInit, Inject, PLATFORM_ID, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../service/category';
import { ProductService } from '../../service/product';
import { RouterModule, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './shop.html',
  styleUrls: ['./shop.css']
})
export class ShopComponent implements OnInit {

  categories = signal<any>(null);
  products = signal<any[]>([]);
  allProducts = signal<any[]>([]);

  selectedCategory: any = '';
  minPrice: number = 0;
  maxPrice: number = 0;
  searchTerm: string = '';

  constructor(
    private categoryService: CategoryService,
    private productService: ProductService,
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    console.log("on it")
    // load categories
    this.loadCategories();

    // detect category slug from URL
    this.route.paramMap.subscribe(params => {

      const slug = params.get('slug');

      if (slug) {
        this.selectedCategory = slug;
      } else {
        this.selectedCategory = '';
      }

      this.loadProducts();

    });

  }

  // Load Categories
  loadCategories() {

    this.categoryService.getCategories().subscribe({
      next: (res: any) => {
        console.log("getcategpry")
        this.categories.set(res?.data || null);

      },
      error: (err: any) => console.error(err)
    });

  }

  // Load Products
  loadProducts() {

    this.productService.getProducts(this.selectedCategory).subscribe({
      next: (res: any) => {

        this.products.set(res.data || []);
        this.allProducts.set(res.data || []);

        this.applyFilters();

      },
      error: (err: any) => console.error('Failed to load products', err)
    });

  }

  // Apply Filters
  applyFilters() {

    const filtered = this.allProducts().filter((p: any) => {

      const priceMatch =
        (this.minPrice === 0 && this.maxPrice === 0) ||
        (this.maxPrice === 0 && Number(p.amount) >= this.minPrice) ||
        (Number(p.amount) >= this.minPrice && Number(p.amount) <= this.maxPrice);

      const searchMatch =
        !this.searchTerm || p.name.toLowerCase().includes(this.searchTerm);

      return priceMatch && searchMatch;

    });

    this.products.set(filtered);

  }

  // Category Filter
  categoryFilter(categorySlug: any) {

    this.selectedCategory = categorySlug;
    this.loadProducts();

  }

  // Price Filter
  priceFilter(min: number, max: number) {

    this.minPrice = min;
    this.maxPrice = max;

    this.applyFilters();

  }

  // Search Product
  searchProduct(event: any) {

    this.searchTerm = event.target.value.toLowerCase();

    this.applyFilters();

  }

  // Sorting
  sortProduct(event: any) {

    const value = event.target.value;

    const sorted = [...this.products()];

    if (value === 'name_asc')
      sorted.sort((a: any, b: any) => a.name.localeCompare(b.name));

    else if (value === 'name_desc')
      sorted.sort((a: any, b: any) => b.name.localeCompare(a.name));

    else if (value === 'price_low')
      sorted.sort((a: any, b: any) => Number(a.amount) - Number(b.amount));

    else if (value === 'price_high')
      sorted.sort((a: any, b: any) => Number(b.amount) - Number(a.amount));

    this.products.set(sorted);

  }

}