// @ts-nocheck
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-historical-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div>
      <h2>Historical Price Chart</h2>
      <canvas #historicalChart></canvas>
    </div>
  `,
})
export class HistoricalChartComponent implements OnInit {
  historicalData: any[] = [];
  chart: Chart | undefined;
  service = inject(DataService);

  ngOnInit() {
    this.service.getInstruments().subscribe((data) => {
      console.log(data)
      this.historicalData = data;
      this.renderChart();
    });
  }

  renderChart() {
    const canvas = document.querySelector(
      'canvas#historicalChart'
    ) as HTMLCanvasElement;
    this.chart = new Chart(canvas, {
      type: 'line',
      data: {
        labels: this.historicalData.map((d) => d.time),
        datasets: [
          {
            label: 'Historical Price',
            data: this.historicalData.map((d) => d.price),
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          xAxes: [
            {
              type: 'time',
              time: {
                unit: 'day',
              },
            },
          ],
        },
      },
    });
  }
}
