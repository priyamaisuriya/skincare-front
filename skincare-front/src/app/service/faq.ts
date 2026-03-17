import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface Faq {
  id: number;
  question: string;
  answer: string;
}

@Injectable({
  providedIn: 'root'
})
export class FaqService {
  // Use public frontend route
  private apiUrl = 'http://localhost:8000/api/front/faqs';
  private contactUrl = "http://127.0.0.1:8000/api/front/contact";

  constructor(private http: HttpClient) { }

  // Fetch FAQs and ensure it returns an array
  getFaqs(): Observable<Faq[]> {
    return this.http.get<{ data: Faq[] }>(this.apiUrl).pipe(
      map(res => res.data || [])
    );
  }

  // Submit contact form
  saveContact(data: any): Observable<any> {
    return this.http.post(this.contactUrl, data);
  }
}