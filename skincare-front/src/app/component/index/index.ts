import { Component, OnInit, AfterViewInit, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import Swiper from 'swiper/bundle';

@Component({
  selector: 'app-index',
  templateUrl: './index.html',
  styleUrls: ['./index.css'],
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class IndexComponent implements OnInit, AfterViewInit {

  sliders = signal<any[]>([]);
  categories = signal<any[]>([]);
  newProducts = signal<any[]>([]);
  bestSellers = signal<any[]>([]);

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadSlidersAndData();
  }

  ngAfterViewInit(): void {

    if (typeof window !== 'undefined') {

      setTimeout(() => {

        // Hero Slider
        new Swiper('.slideshow', {
          loop: true,
          pagination: {
            el: '.swiper-pagination-slideshow',
            clickable: true
          },
          autoplay: {
            delay: 3000
          }
        });

        // Testimonial Slider
        new Swiper('.testimonial-swiper', {
          loop: true,
          autoplay: {
            delay: 4000
          },
          slidesPerView: 1,
          spaceBetween: 20
        });

      }, 500);

    }

  }

  loadSlidersAndData(): void {

    this.http.get<any>('http://127.0.0.1:8000/api/front/home')
      .subscribe({

        next: (res) => {

          this.sliders.set(res.data.sliders || []);
          this.categories.set(res.data.categories || []);
          this.newProducts.set(res.data.new_products || []);
          this.bestSellers.set(res.data.best_sellers || []);

        },

        error: (err) => {
          console.error('Failed to load data:', err);
        }

      });

  }

}