import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, CUSTOM_ELEMENTS_SCHEMA, signal, Inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CategoryService } from '../../../service/category';
import { HttpClient } from '@angular/common/http';

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

  categories = signal<any[]>([]);

  settings = signal<any>({
    logo: '',
    site_name: '',
    favicon: ''
  });

  constructor(
    private category: CategoryService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadSettings();
  }

  loadCategories() {
    this.category.getCategories().subscribe({
      next: (res: any) => {
        this.categories.set(res?.data || []);
        this.cdr.markForCheck();
      },
      error: (err: any) => console.error(err)
    });
  }

  loadSettings() {
    this.http.get('http://127.0.0.1:8000/api/front/settings/1')
      .subscribe((res: any) => {

        const data = res.data;

        this.settings.set(data);

        if (data.favicon) {
          this.setFavicon('http://127.0.0.1:8000/storage/' + data.favicon);
        }

        this.cdr.markForCheck();
      });
  }

  setFavicon(iconUrl: string) {
    const link: HTMLLinkElement | null = this.document.querySelector('#appFavicon');

    if (link) {
      link.href = iconUrl;
    }
  }

}