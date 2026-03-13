import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
// import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-index',
  templateUrl: './index.html',
  styleUrls: ['./index.css'],
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class IndexComponent implements OnInit {

  sliders: any[] = [];
  categories: any[] = [];
  newProducts: any[] = [];
  bestSellers: any[] = []; // <-- added bestSellers

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadSlidersAndData();
  }

  loadSlidersAndData(): void {
    this.http.get<any>('http://127.0.0.1:8000/api/front/home')
      .subscribe({
        next: (res) => {
          this.sliders = res.data.sliders;
          this.categories = res.data.categories;
          this.newProducts = res.data.new_products;
          this.bestSellers = res.data.best_sellers; // <-- fetch best sellers

          console.log('Sliders loaded:', this.sliders);
          console.log('Categories loaded:', this.categories);
          console.log('New Products loaded:', this.newProducts);
          console.log('Best Sellers loaded:', this.bestSellers);
        },
        error: (err) => { 
          console.error('Failed to load data:', err); 
        }
      });
  }
}