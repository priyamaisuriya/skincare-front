import { Component } from '@angular/core';
import { Header as appheader } from './header/header';
import { Footer as appfooter } from './footer/footer';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [appheader, appfooter, RouterOutlet],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {}