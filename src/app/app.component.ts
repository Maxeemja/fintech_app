import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HistoricalChartComponent } from './components/historical-chart/historical-chart.component';
import { DataService } from './services/data.service';
import { Asset } from './shared/interfaces/asset.interface';
import { RealTimePriceComponent } from './components/real-time-price/real-time-price.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HistoricalChartComponent, RealTimePriceComponent],
  template: `
    <h1>Fintech App</h1>
    <select (change)="onAssetChange($event)">
      <option *ngFor="let asset of assets" [value]="asset.id">
        {{ asset.symbol }}
      </option>
    </select>
    <app-real-time-price></app-real-time-price>
    <app-historical-chart></app-historical-chart>
  `,
})
export class AppComponent implements OnInit {
  assets: Asset[] = [];

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.dataService.authenticate();
    this.dataService.getInstruments().subscribe((assets) => {
      this.assets = assets;
      if (assets.length > 0) {
        this.dataService.setCurrentAsset(assets[0]);
      }
    });
  }

  onAssetChange(event: Event) {
    const selectedId = (event.target as HTMLSelectElement).value;
    const selectedAsset = this.assets.find((asset) => asset.id === selectedId);
    if (selectedAsset) {
      this.dataService.setCurrentAsset(selectedAsset);
    }
  }
}
