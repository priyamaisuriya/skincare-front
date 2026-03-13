import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-index',
  templateUrl: './index.html',
  styleUrls: ['./index.css'],
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule] // <-- added RouterModule
})
export class IndexComponent implements OnInit {

  sliders: any[] = [];
  categories: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadSliders();
  }

  loadSliders(): void {
    this.http.get<any>('http://127.0.0.1:8000/api/front/home')
      .subscribe({
        next: (res) => { 
          this.sliders = res.data.sliders;    // ✅ now works
          this.categories = res.data.categories; // ✅ now works
          console.log('Sliders loaded:', this.sliders);
          console.log('Categories loaded:', this.categories);
        },
        error: (err) => { console.error('Failed to load sliders:', err); }
      });
  }
}