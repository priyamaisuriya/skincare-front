import { Component, OnInit } from '@angular/core';
import { CategoryService as Category } from '../../service/category';

@Component({
  selector: 'app-index',
  templateUrl: './index.html',
  styleUrls: ['./index.css']
})
export class IndexComponent implements OnInit {
  categories: any[] = []; // API thi aavtu data

  constructor(private Category: Category) {}

  ngOnInit(): void {
    this.Category.getCategories().subscribe({
      next: (res) => this.categories = res,
      error: (err) => console.error('Error fetching categories:', err)
    });
  }
}