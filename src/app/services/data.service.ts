import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'https://api.example.com/assets/';
  private assetId = 'BTC';

  constructor(private http: HttpClient) { }

  getRealTimePrice(): Observable<any> {
    return this.http.get(`${this.apiUrl}${this.assetId}/real-time-price`);
  }

  getHistoricalData(): Observable<any> {
    return this.http.get(`${this.apiUrl}${this.assetId}/historical-data`);
  }
}
