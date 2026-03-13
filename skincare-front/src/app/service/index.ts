import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SliderService {

  private api = "http://127.0.0.1:8000/api/front/";

  constructor(private http: HttpClient) {}

  // Fetch sliders from the homepage API
  getSliders(): Observable<any[]> {
    return this.http.get<any>(this.api + 'home').pipe(
      map(response => response.data.sliders) // extract sliders from homepage response
    );
  }
}