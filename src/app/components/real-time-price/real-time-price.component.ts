import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, interval, map, switchMap } from 'rxjs';
import { DataService } from '../../services/data.service';
import { Asset } from '../../shared/interfaces/asset.interface';

@Component({
  selector: 'app-real-time-price',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="currentAsset">
      <h2>Latest Price for {{ currentAsset.symbol }}</h2>
      <p>Price: {{ currentPrice | number : '1.2-5' }}</p>
      <p>Time: {{ currentTime | date : 'medium' }}</p>
    </div>
  `,
})
export class RealTimePriceComponent implements OnInit, OnDestroy {
  currentAsset: Asset | null = null;
  currentPrice!: number;
  currentTime!: Date;
  private destroy$ = new Subject();

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.dataService
      .getCurrentAsset()
      .pipe(
        switchMap((asset) => {
          if (asset) {
            this.currentAsset = asset;
            return interval(5000).pipe(
              switchMap(() =>
                this.dataService.getBars(asset.id, 'oanda', 1, 'minute', 1)
              )
            );
          }
          return [];
        }),
        map((res) => res.data)
      )
      .subscribe((data) => {
        if (data && data.length > 0) {
          const latestBar = data[0];
          this.currentPrice = latestBar.v;
          this.currentTime = new Date(latestBar.t);
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
