import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, take } from 'rxjs';
import { Asset } from '../shared/interfaces/asset.interface';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private apiUrl = '/api';
  private currentAsset = new BehaviorSubject<Asset | null>(null);

  headers = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  };

  constructor(private http: HttpClient) {}

  setCurrentAsset(asset: Asset) {
    this.currentAsset.next(asset);
  }

  getCurrentAsset(): Observable<Asset | null> {
    return this.currentAsset.asObservable();
  }

  getInstruments(
    provider: string = 'oanda',
    kind: string = 'forex'
  ): Observable<Asset[]> {
    return this.http
      .get<Asset[]>(
        `${this.apiUrl}/instruments/v1/instruments?provider=${provider}&kind=${kind}`,
        this.headers
      )
      .pipe(map((res: any) => res.data));
  }

  getBars(
    instrumentId: string,
    provider: string,
    interval: number,
    periodicity: string,
    barsCount: number
  ): Observable<any> {
    let params = new HttpParams()
      .set('instrumentId', instrumentId)
      .set('provider', provider)
      .set('interval', interval.toString())
      .set('periodicity', periodicity)
      .set('barsCount', barsCount.toString());
    return this.http.get(`${this.apiUrl}/bars/v1/bars/count-back`, {
      params,
      ...this.headers,
    });
  }

  // Add a method for authentication if needed
  authenticate(): void {
    const body = new URLSearchParams();
    body.set('grant_type', 'password');
    body.set('client_id', 'app-cli');
    body.set('username', environment.username);
    body.set('password', environment.password);

    this.http
      .post(
        `/identity/realms/fintatech/protocol/openid-connect/token`,
        body.toString(),
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }
      )
      .pipe(take(1))
      .subscribe((data: any) => {
        localStorage.setItem('token', data.access_token);
      });
  }
}
