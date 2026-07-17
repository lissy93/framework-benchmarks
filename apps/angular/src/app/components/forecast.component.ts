import { Component, ElementRef, Injector, afterNextRender, inject, input, signal, viewChildren } from '@angular/core';
import type { WeatherData } from '../types/weather.types';
import { ForecastItemComponent } from './forecast-item.component';

@Component({
  selector: 'app-forecast',
  imports: [ForecastItemComponent],
  template: `
    <section class="forecast-section">
      <h2 class="section-title">7-Day Forecast</h2>
      <div class="forecast">
        <div class="forecast__list" data-testid="forecast-list">
          @let _weatherData = weatherData();
          @for (date of _weatherData.daily.time; track date; let i = $index) {
            <app-forecast-item
              #forecastItem
              [daily]="_weatherData.daily"
              [index]="i"
              [isActive]="activeForecastIndex() === i"
              (toggle)="onToggleForecast($event)"
            ></app-forecast-item>
          }
        </div>
      </div>
    </section>
  `
})
export class ForecastComponent {
  private readonly injector = inject(Injector);
  private readonly forecastItems = viewChildren<ElementRef<HTMLElement>>('forecastItem');

  readonly weatherData = input.required<WeatherData>();
  readonly activeForecastIndex = signal<number | null>(null);

  onToggleForecast(index: number): void {
    if (this.activeForecastIndex() === index) {
      this.activeForecastIndex.set(null);
    } else {
      this.activeForecastIndex.set(index);
      afterNextRender(() => {
        const activeEl = this.forecastItems()[index]?.nativeElement;
        if (activeEl) {
          activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, { injector: this.injector });
    }
  }
}
