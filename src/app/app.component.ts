import { RealTimePriceComponent } from './components/real-time-price/real-time-price.component';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistoricalChartComponent } from './components/historical-chart/historical-chart.component';
import { DataService } from './services/data.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RealTimePriceComponent, HistoricalChartComponent],
  template: `
    <h1>Market Data</h1>
    <app-real-time-price></app-real-time-price>
    <app-historical-chart></app-historical-chart>
  `,
})
export class AppComponent {
  service = inject(DataService);

  ngOnInit() {
    console.log('fired?')
    this.service.getToken();
  }
}
