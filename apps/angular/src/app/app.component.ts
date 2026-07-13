import { Component, inject } from '@angular/core';
import { WeatherStateService } from './services/weather-state.service';
import { SearchFormComponent } from './components/search-form.component';
import { LoadingStateComponent } from './components/loading-state.component';
import { ErrorStateComponent } from './components/error-state.component';
import { WeatherContentComponent } from './components/weather-content.component';

@Component({
  selector: 'app-root',
  imports: [
    SearchFormComponent,
    LoadingStateComponent,
    ErrorStateComponent,
    WeatherContentComponent
  ],
  template: `
    <header class="header">
      <div class="container">
        <h1 class="header__title">Weather Front</h1>
      </div>
    </header>

    <main class="main">
      <div class="container">
        <app-search-form
          [isLoading]="weatherState.weather.isLoading()"
          (search)="weatherState.loadWeather($event)"
        ></app-search-form>

        <div class="weather-container" data-testid="weather-container">
          <app-loading-state [isVisible]="weatherState.weather.isLoading()"></app-loading-state>

          <app-error-state
            [isVisible]="!!weatherState.weather.error() && !weatherState.weather.isLoading()"
            [message]="$any(weatherState.weather.error())?.message"
          ></app-error-state>

          @defer (on immediate) {
            <app-weather-content
              [isVisible]="weatherState.weather.hasValue() && !weatherState.weather.isLoading() && !weatherState.weather.error()"
              [weatherData]="weatherState.weather.value()"
            ></app-weather-content>
          }
        </div>
      </div>
    </main>

    <footer class="footer">
      <div class="container">
        <p class="footer__text">
          Built with Angular • MIT License •
          <a href="https://github.com/Lissy93" class="footer__link" target="_blank" rel="noopener">
            Alicia Sykes
          </a>
        </p>
      </div>
    </footer>
  `
})
export class AppComponent {
  protected readonly weatherState = inject(WeatherStateService);
}
