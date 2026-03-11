import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CategoryService } from '../../../service/category';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],   
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header implements OnInit {

  categories:any[]=[];

  constructor(private category:CategoryService){}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories() {
    this.category.getCategories().subscribe({
      next: (res: any) => {
        this.categories = res.data;
      },
      error: (err: any) => console.error(err)
    });
  }

  selectCategory(id:any){
    localStorage.setItem('category_id', id);
  }

}