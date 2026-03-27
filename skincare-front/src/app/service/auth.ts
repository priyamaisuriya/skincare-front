import { HttpClient } from '@angular/common/http';
import { Injectable, signal, computed, effect } from '@angular/core';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://127.0.0.1:8000/api/front';

  currentUser = signal<any>(null);
  token = signal<string | null>(null);
  isLoggedIn = computed(() => !!this.token());

  constructor(private http: HttpClient) {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('user');
      const savedToken = localStorage.getItem('token');
      if (savedUser && savedToken) {
        this.currentUser.set(JSON.parse(savedUser));
        this.token.set(savedToken);
      }
    }

    effect(() => {
      console.log('Signal isLoggedIn changed:', this.isLoggedIn());
    });
  }

  register(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data).pipe(
      tap((res: any) => {
        if (res.status === 'success') {
          this.setSession(res.data, res.token);
        }
      })
    );
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((res: any) => {
        if (res.status === 'success') {
          this.setSession(res.data, res.token);
        }
      })
    );
  }

  logout(): Observable<any> {
    const headers = { 'Authorization': `Bearer ${this.token()}` };
    return this.http.post(`${this.apiUrl}/logout`, {}, { headers }).pipe(
      tap(() => this.clearSession())
    );
  }

  private setSession(user: any, token: string) {
    console.log('Setting session:', user, token);
    this.currentUser.set(user);
    this.token.set(token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
  }

  private clearSession() {
    this.currentUser.set(null);
    this.token.set(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }

  // isLoggedIn() {
  //   return !!this.token();
  // }

}
