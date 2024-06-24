import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, map, take } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private apiUrl = `${environment.baseUrl}/api`;
  private assetId = 'AUD/CAD';

  public token$: BehaviorSubject<string> = new BehaviorSubject('');

  constructor(private http: HttpClient) {}

  getRealTimePrice(): Observable<any> {
    return this.http.get(`${this.apiUrl}${this.assetId}/real-time-price`);
  }

  getHistoricalData(): Observable<any> {
    return this.http.get(`${this.apiUrl}${this.assetId}/historical-data`);
  }

  getToken(): void {
    let body = `grant_type=${environment.grant_type}&client_id=${environment.client_id}&username=${environment.username}&password=${environment.password}`;
    this.http
      .post(
        `${environment.baseUrl}/identity/realms/fintatech/protocol/openid-connect/token`,
        body,
        {
          headers: new HttpHeaders().set(
            'Content-Type',
            'application/x-www-form-urlencoded'
          ),
        }
      )
      .pipe(
        map((data: any) => {
          console.log(data);
          return this.token$.next(data.access_token);
        }),
        take(1)
      )
      .subscribe();
  }

  getInstruments(): Observable<any[]> {
    return this.http
      .get(
        `${this.apiUrl}/instruments/v1/instruments?provider=oanda&kind=forex`,
        {
          headers: {
            Authorization: `Bearer ${this.token$.getValue()}`,
          },
        }
      )
      .pipe(map((res: any) => res.data));
  }
}
