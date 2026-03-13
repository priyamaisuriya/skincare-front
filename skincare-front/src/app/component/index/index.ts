import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // <-- required for *ngFor
import { SliderService } from '../../service';
@Component({
  selector: 'app-index',
  templateUrl: './index.html',
  styleUrls: ['./index.css'],
  standalone: true,       // <-- standalone component
  imports: [CommonModule] // <-- imports CommonModule for *ngFor
})
export class IndexComponent implements OnInit {
  sliders: any[] = [];

  constructor(private sliderService: SliderService) {}

  ngOnInit(): void {
    this.loadSliders();
  }

  loadSliders(): void {
    this.sliderService.getSliders().subscribe({
      next: (data) => { this.sliders = data; },
      error: (err) => { console.error('Failed to load sliders:', err); }
    });
  } 
}