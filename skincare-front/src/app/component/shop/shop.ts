import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common'; 
import { CategoryService } from '../../service/category';
import { Shop } from '../../service/shop';
import { ProductService } from '../../service/product';

@Component({
  selector: 'app-shop',
  standalone: true,   
  imports: [CommonModule],   
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
    private category: CategoryService,
    private Shop: Shop,
    private product: ProductService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {

    this.loadCategories();
    this.loadProducts();

    // localStorage only in browser
    if (isPlatformBrowser(this.platformId)) {

      const catId = localStorage.getItem('category_id');

      if(catId){
        this.selectedCategory = catId;
        localStorage.removeItem('category_id');
      }

    }

  }

  loadCategories() {
    this.category.getCategories().subscribe({
      next: (res: any) => {
        this.categories = res.data;
      },
      error: (err: any) => console.error(err)
    });
  }

  loadProducts() {
    this.Shop.getShopData().subscribe({
      next: (res: any) => {

        this.products = res.data || [];
        this.allProducts = res.data || [];

        this.applyFilters();

      },
      error: (err: any) => console.error('Failed to load shop products', err)
    });
  }

  applyFilters(){

    this.products = this.allProducts.filter((p:any)=>{

      const categoryMatch =
        !this.selectedCategory || p.category_id == this.selectedCategory;

      const priceMatch =
        (this.minPrice === 0 && this.maxPrice === 0) ||
        (this.maxPrice === 0 && Number(p.amount) >= this.minPrice) ||
        (Number(p.amount) >= this.minPrice && Number(p.amount) <= this.maxPrice);

      const searchMatch =
        !this.searchTerm || p.name.toLowerCase().includes(this.searchTerm);

      return categoryMatch && priceMatch && searchMatch;

    });

  }

  categoryFilter(categoryId:any){
    this.selectedCategory = categoryId;
    this.applyFilters();
  }

  priceFilter(min:number,max:number){
    this.minPrice = min;
    this.maxPrice = max;
    this.applyFilters();
  }

  searchProduct(event:any){
    this.searchTerm = event.target.value.toLowerCase();
    this.applyFilters();
  }

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