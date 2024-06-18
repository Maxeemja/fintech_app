import { RealTimePriceComponent } from './components/real-time-price/real-time-price.component';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistoricalChartComponent } from './components/historical-chart/historical-chart.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RealTimePriceComponententomponent,
    HistoricalChartComponentChartComponent,
  ],
  template: `
    <h1>Market Data</h1>
    <app-real-time-price></app-real-time-price>
    <app-historical-chart></app-historical-chart>
  `,
})
export class AppComponent {}
