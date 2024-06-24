// @ts-nocheck
import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import {
  Chart,
  Legend,
  LineController,
  LineElement,
  LinearScale,
  PointElement,
  TimeScale,
  Title,
  Tooltip,
} from 'chart.js';
import { Subject, map, switchMap, takeUntil } from 'rxjs';
import { DataService } from '../../services/data.service';
import { Asset } from '../../shared/interfaces/asset.interface';
import 'chartjs-adapter-date-fns';

Chart.register(
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  LineController
);

@Component({
  selector: 'app-historical-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="currentAsset" class="chart-container">
      <h2>Historical Price Chart for {{ currentAsset.symbol }}</h2>
      <canvas #historicalChart></canvas>
    </div>
  `,
})
export class HistoricalChartComponent implements OnInit, OnDestroy {
  @ViewChild('historicalChart') chartCanvas!: ElementRef;
  currentAsset: Asset | null = null;
  chart!: Chart;
  private destroy$ = new Subject();

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.dataService
      .getCurrentAsset()
      .pipe(
        takeUntil(this.destroy$),
        switchMap((asset) => {
          if (asset) {
            this.currentAsset = asset;
            return this.dataService.getBars(
              asset.id,
              'oanda',
              1,
              'minute',
              100
            );
          }
          return [];
        }),
        map((res) => res.data)
      )
      .subscribe((data) => {
        this.renderChart(data);
      });
  }

  renderChart(data: any[]) {
    if (this.chart) {
      this.chart.destroy();
    }

    console.log(data);

    this.chart = new Chart(this.chartCanvas.nativeElement, {
      type: 'line',
      data: {
        datasets: [
          {
            label: 'Close Price',
            data: data.map((d) => ({ x: new Date(d.t), y: d.v })),
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 2, // Increased for visibility
            pointRadius: 3, // Add points to the line
            pointBackgroundColor: 'rgba(54, 162, 235, 1)',
          },
        ],
      },
      options: {
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'minute',
              displayFormats: {
                second: 'HH:mm:ss',
                minute: 'HH:mm',
              },
            },
          },
          y: {
            type: 'linear',
            beginAtZero: true,
          },
        },
      },
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
