import { Component, computed, input } from '@angular/core';
import type { WeatherData } from '../types/weather.types';
import { WeatherUtils } from '../utils/weather.utils';

@Component({
  selector: 'app-current-weather',
  template: `
    @if (weatherData(); as weatherData) {
      <section class="current-section">
      <h2 class="section-title">Current Weather</h2>
      <div class="weather-card" data-testid="current-weather">
        <div class="current-weather">
          <h3 class="current-weather__location" data-testid="current-location">
            {{ locationLabel() }}
          </h3>
          <div class="current-weather__main">
            <div class="current-weather__icon" data-testid="current-icon">
              {{ weatherIcon() }}
            </div>
            <div class="current-weather__temp-group">
              <div class="current-weather__temp" data-testid="current-temperature">
                {{ currentTemperature() }}
              </div>
              <div
                class="current-weather__condition {{ conditionClass() }}"
                data-testid="current-condition"
              >
                {{ weatherDescription() }}
              </div>
            </div>
          </div>

          <div class="current-weather__details">
            <div class="weather-detail">
              <div class="weather-detail__label">Feels like</div>
              <div class="weather-detail__value" data-testid="feels-like">
                {{ apparentTemperature() }}
              </div>
            </div>
            <div class="weather-detail">
              <div class="weather-detail__label">Humidity</div>
              <div class="weather-detail__value" data-testid="humidity">
                {{ humidity() }}
              </div>
            </div>
            <div class="weather-detail">
              <div class="weather-detail__label">Wind Speed</div>
              <div class="weather-detail__value" data-testid="wind-speed">
                {{ windSpeed() }}
              </div>
            </div>
            <div class="weather-detail">
              <div class="weather-detail__label">Pressure</div>
              <div class="weather-detail__value" data-testid="pressure">
                {{ pressure() }}
              </div>
            </div>
            <div class="weather-detail">
              <div class="weather-detail__label">Cloud Cover</div>
              <div class="weather-detail__value" data-testid="cloud-cover">
                {{ cloudCover() }}
              </div>
            </div>
            <div class="weather-detail">
              <div class="weather-detail__label">Wind Direction</div>
              <div class="weather-detail__value" data-testid="wind-direction">
                {{ windDirection() }}
              </div>
            </div>
          </div>
        </div>
      </div>
      </section>
    }
  `
})
export class CurrentWeatherComponent {
  readonly weatherData = input<WeatherData | null | undefined>(null);

  readonly locationLabel = computed(() => {
    const weatherData = this.weatherData();
    if (!weatherData) {
      return '';
    }

    return weatherData.country
      ? `${weatherData.locationName}, ${weatherData.country}`
      : (weatherData.locationName ?? '');
  });

  readonly weatherIcon = computed(() => {
    const current = this.weatherData()?.current;
    return current ? WeatherUtils.getWeatherIcon(current.weather_code, current.is_day) : '';
  });

  readonly currentTemperature = computed(() => {
    const current = this.weatherData()?.current;
    return current ? WeatherUtils.formatTemperature(current.temperature_2m) : '';
  });

  readonly conditionClass = computed(() => {
    const current = this.weatherData()?.current;
    return current ? WeatherUtils.getConditionClass(current.weather_code) : '';
  });

  readonly weatherDescription = computed(() => {
    const current = this.weatherData()?.current;
    return current ? WeatherUtils.getWeatherDescription(current.weather_code) : '';
  });

  readonly apparentTemperature = computed(() => {
    const current = this.weatherData()?.current;
    return current ? WeatherUtils.formatTemperature(current.apparent_temperature) : '';
  });

  readonly humidity = computed(() => {
    const current = this.weatherData()?.current;
    return current ? WeatherUtils.formatPercentage(current.relative_humidity_2m) : '';
  });

  readonly windSpeed = computed(() => {
    const current = this.weatherData()?.current;
    return current ? WeatherUtils.formatWindSpeed(current.wind_speed_10m) : '';
  });

  readonly pressure = computed(() => {
    const current = this.weatherData()?.current;
    return current ? WeatherUtils.formatPressure(current.pressure_msl) : '';
  });

  readonly cloudCover = computed(() => {
    const current = this.weatherData()?.current;
    return current ? WeatherUtils.formatPercentage(current.cloud_cover) : '';
  });

  readonly windDirection = computed(() => {
    const current = this.weatherData()?.current;
    return current ? WeatherUtils.getWindDirection(current.wind_direction_10m) : '';
  });
}
