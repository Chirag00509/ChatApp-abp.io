import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoggService {

  constructor(private http: HttpClient) { }

  getLogs(startTime: any, endTime: any): Observable<any> {
    const token = localStorage.getItem('authToken');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    if(endTime == null) {
      return this.http.get<any>(`https://localhost:44373/api/app/logg/logs?startTime=${startTime}`, { headers: headers })
    }
    return this.http.get<any>(`https://localhost:44373/api/app/logg/logs?startTime=${startTime}&endTime=${endTime}`, { headers: headers })
  }
}
