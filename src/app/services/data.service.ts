import { Injectable, Signal, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, map, retry, take, tap } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private apiUrl = `${environment.baseUrl}/api`;
  private assetId = 'AUD/CAD';

  public token = signal('');

  constructor(private http: HttpClient) {}

  getRealTimePrice(): Observable<any> {
    return this.http.get(`${this.apiUrl}${this.assetId}/real-time-price`);
  }

  getHistoricalData(): Observable<any> {
    return this.http.get(`${this.apiUrl}${this.assetId}/historical-data`);
  }

  getToken(): void {
    const body = `grant_type=${environment.grant_type}&client_id=${environment.client_id}&username=${environment.username}&password=${environment.password}`;
    this.http
      .post(`/identity/realms/fintatech/protocol/openid-connect/token`, body, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      .pipe(
        tap((data: any) => {
          this.token.set(data.access_token);
          localStorage.setItem('token', data.access_token);
        }),
        take(1)
      )
      .subscribe();
  }

  getInstruments() {
    const token = localStorage.getItem('token');
    return this.http
      .get(`/api/instruments/v1/instruments?provider=oanda&kind=forex`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Access-Control-Allow-Origin': '*',
        },
      })
      .pipe(map((res: any) => res.data));
  }
}
