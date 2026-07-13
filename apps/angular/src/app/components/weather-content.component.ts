import { Component, input } from '@angular/core';
import type { WeatherData } from '../types/weather.types';
import { CurrentWeatherComponent } from './current-weather.component';
import { ForecastComponent } from './forecast.component';

@Component({
  selector: 'app-weather-content',
  imports: [CurrentWeatherComponent, ForecastComponent],
  template: `
    <div
      class="weather-content"
      data-testid="weather-content"
      [hidden]="!isVisible()"
    >
      @let currentWeatherData = weatherData();

      <div class="weather-layout">
        <app-current-weather [weatherData]="currentWeatherData"></app-current-weather>
        <app-forecast [weatherData]="currentWeatherData"></app-forecast>
      </div>
    </div>
  `
})
export class WeatherContentComponent {
  readonly isVisible = input(false);
  readonly weatherData = input<WeatherData | null | undefined>(null);
}
