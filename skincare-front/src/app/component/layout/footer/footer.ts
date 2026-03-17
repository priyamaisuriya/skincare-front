import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.html',
  styleUrls: ['./footer.css']
})
export class Footer implements OnInit {
  settings: any = {
    logo: '',
    description: '',
    site_name: '',
    year: '',
    website: ''
  };
  categories: any[] = [];

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    // ✅ Settings API
    this.http.get('http://127.0.0.1:8000/api/front/settings/1')
      .subscribe((res: any) => {
        this.settings = res.data;

        // ✅ Fix NG0100
        this.cdr.detectChanges();
      });

    // ✅ Categories API
    this.http.get('http://127.0.0.1:8000/api/front/categories')
      .subscribe((res: any) => {
        this.categories = res;

        // Optional: detect changes if needed
        this.cdr.detectChanges();
      });
  }
}