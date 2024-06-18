import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-real-time-price',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div>
      <h2>Real-Time Price</h2>
      <p>Current Price: {{ currentPrice }}</p>
      <p>Current Time: {{ currentTime }}</p>
    </div>
  `,
})
export class RealTimePriceComponent implements OnInit {
  currentPrice: number | undefined;
  currentTime: string | undefined;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.dataService.getRealTimePrice().subscribe((data) => {
      this.currentPrice = data.price;
      this.currentTime = data.time;
    });
  }
}
