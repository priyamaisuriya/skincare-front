import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
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

  categories: any[] = [];
  products: any[] = [];
  allProducts: any[] = [];

  selectedCategory:any = '';
  minPrice:number = 0;
  maxPrice:number = 0;
  searchTerm:string = '';

  constructor(
    private categoryService: CategoryService,
    private productService: ProductService,
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {

    // categories load
    this.loadCategories();

    // slug detect
    this.route.paramMap.subscribe(params => {

      const slug = params.get('slug');

      if(slug){
        this.selectedCategory = slug;
      }else{
        this.selectedCategory = '';
      }

      this.loadProducts();

    });

  }

  // Load Categories
  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (res: any) => {
        this.categories = res.data || [];
      },
      error: (err: any) => console.error(err)
    });
  }

  // Load Products
  loadProducts() {

    this.productService.getProducts(this.selectedCategory).subscribe({
      next: (res: any) => {

        this.products = res.data || [];
        this.allProducts = res.data || [];

        this.applyFilters();

      },
      error: (err: any) => console.error('Failed to load products', err)
    });

  }

  // Apply Filters
  applyFilters(){

    this.products = this.allProducts.filter((p:any)=>{

      const priceMatch =
        (this.minPrice === 0 && this.maxPrice === 0) ||
        (this.maxPrice === 0 && Number(p.amount) >= this.minPrice) ||
        (Number(p.amount) >= this.minPrice && Number(p.amount) <= this.maxPrice);

      const searchMatch =
        !this.searchTerm || p.name.toLowerCase().includes(this.searchTerm);

      return priceMatch && searchMatch;

    });

  }

  // Category Filter
  categoryFilter(categorySlug:any){
    this.selectedCategory = categorySlug;
    this.loadProducts();
  }

  // Price Filter
  priceFilter(min:number,max:number){
    this.minPrice = min;
    this.maxPrice = max;
    this.applyFilters();
  }

  // Search
  searchProduct(event:any){
    this.searchTerm = event.target.value.toLowerCase();
    this.applyFilters();
  }

  // Sorting
  sortProduct(event:any){

    const value = event.target.value;

    if (value === 'name_asc')
      this.products.sort((a:any,b:any)=> a.name.localeCompare(b.name));

    else if (value === 'name_desc')
      this.products.sort((a:any,b:any)=> b.name.localeCompare(a.name));

    else if (value === 'price_low')
      this.products.sort((a:any,b:any)=> Number(a.amount) - Number(b.amount));

    else if (value === 'price_high')
      this.products.sort((a:any,b:any)=> Number(b.amount) - Number(a.amount));

  }

}