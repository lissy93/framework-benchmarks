import { Component, ElementRef, Injector, afterNextRender, inject, input, signal } from '@angular/core';
import type { WeatherData } from '../types/weather.types';
import { ForecastItemComponent } from './forecast-item.component';

@Component({
  selector: 'app-forecast',
  imports: [ForecastItemComponent],
  template: `
    @if (weatherData(); as weatherData) {
      <section class="forecast-section">
      <h2 class="section-title">7-Day Forecast</h2>
      <div class="forecast">
        <div class="forecast__list" data-testid="forecast-list">
          @for (date of weatherData.daily.time; track date; let i = $index) {
          <app-forecast-item
            [daily]="weatherData.daily"
            [index]="i"
            [isActive]="activeForecastIndex() === i"
            (toggle)="onToggleForecast($event)"
          ></app-forecast-item>
          }
        </div>
      </div>
      </section>
    }
  `
})
export class ForecastComponent {
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly injector = inject(Injector);

  readonly weatherData = input<WeatherData | null | undefined>(null);
  readonly activeForecastIndex = signal<number | null>(null);

  onToggleForecast(index: number): void {
    if (this.activeForecastIndex() === index) {
      this.activeForecastIndex.set(null);
    } else {
      this.activeForecastIndex.set(index);
      afterNextRender(() => {
        const activeElement = (this.elementRef.nativeElement as HTMLElement).querySelector('.forecast-item.active');
        if (activeElement) {
          activeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, { injector: this.injector });
    }
  }
}
