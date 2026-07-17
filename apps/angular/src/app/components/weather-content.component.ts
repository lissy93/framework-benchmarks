import { Component, input } from '@angular/core';
import type { WeatherData } from '../types/weather.types';
import { CurrentWeatherComponent } from './current-weather.component';
import { ForecastComponent } from './forecast.component';

@Component({
  selector: 'app-weather-content',
  imports: [CurrentWeatherComponent, ForecastComponent],
  template: `
    <div class="weather-content" data-testid="weather-content">
      <div class="weather-layout">
        @let data = weatherData();
        <app-current-weather [weatherData]="data"></app-current-weather>
        <app-forecast [weatherData]="data"></app-forecast>
      </div>
    </div>
  `
})
export class WeatherContentComponent {
  readonly weatherData = input.required<WeatherData>();
}
