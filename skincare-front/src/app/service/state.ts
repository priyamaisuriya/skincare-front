import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StateService {

  private apiUrl = 'http://127.0.0.1:8000/api/front/states';

  constructor(private http: HttpClient) { }

  getStates(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

}
