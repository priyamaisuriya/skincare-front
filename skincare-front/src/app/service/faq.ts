import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Faq {
  id: number;
  question: string;
  answer: string;
}

@Injectable({
  providedIn: 'root'
})
export class FaqService {
  private apiUrl = 'http://localhost:8000/api/admin/faqs'; 
  private contactUrl="http://127.0.0.1:8000/api/front/contact";

  constructor(private http: HttpClient) { }

  getFaqs(): Observable<Faq[]> {
    return this.http.get<Faq[]>(this.apiUrl);
  }
  saveContact(data: any): Observable<any> {
    return this.http.post(this.contactUrl, data);
  }
}