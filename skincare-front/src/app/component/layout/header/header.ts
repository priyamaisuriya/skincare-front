import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CategoryService } from '../../../service/category';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './header.html',
  styleUrl: './header.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Header implements OnInit {

  // Initialize signal as empty array
  categories = signal<any[]>([]);

  constructor(private category: CategoryService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories() {
    this.category.getCategories().subscribe({
      next: (res: any) => {
        console.log('Backend Response:', res);
        this.categories.set(res?.data || []);
        this.cdr.markForCheck(); 
      },
      error: (err: any) => console.error(err)
    });
  }

}