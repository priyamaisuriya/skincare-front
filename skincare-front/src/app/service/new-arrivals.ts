import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SliderService {
  apiUrl = 'http://127.0.0.1:8000/api/sliders'; // your backend endpoint

  constructor(private http: HttpClient) {}

  getSliders(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}