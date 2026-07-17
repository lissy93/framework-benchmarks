import { Component } from '@geajs/core';
import weatherStore from '../weather-store.js';

export default class CurrentWeather extends Component {
  template() {
    return (
      <section class="current-section">
        <h2 class="section-title">Current Weather</h2>
        <div class="weather-card" data-testid="current-weather">
          <div class="current-weather">
            <h3 class="current-weather__location" data-testid="current-location">{weatherStore.locationLabel}</h3>
            <div class="current-weather__main">
              <div class="current-weather__icon" data-testid="current-icon">{weatherStore.currentIcon}</div>
              <div class="current-weather__temp-group">
                <div class="current-weather__temp" data-testid="current-temperature">{weatherStore.currentTemperature}</div>
                <div class={`current-weather__condition ${weatherStore.conditionClass}`} data-testid="current-condition">{weatherStore.currentCondition}</div>
              </div>
            </div>
            <div class="current-weather__details">
              <div class="weather-detail">
                <div class="weather-detail__label">Feels like</div>
                <div class="weather-detail__value" data-testid="feels-like">{weatherStore.feelsLike}</div>
              </div>
              <div class="weather-detail">
                <div class="weather-detail__label">Humidity</div>
                <div class="weather-detail__value" data-testid="humidity">{weatherStore.humidity}</div>
              </div>
              <div class="weather-detail">
                <div class="weather-detail__label">Wind Speed</div>
                <div class="weather-detail__value" data-testid="wind-speed">{weatherStore.windSpeed}</div>
              </div>
              <div class="weather-detail">
                <div class="weather-detail__label">Pressure</div>
                <div class="weather-detail__value" data-testid="pressure">{weatherStore.pressure}</div>
              </div>
              <div class="weather-detail">
                <div class="weather-detail__label">Cloud Cover</div>
                <div class="weather-detail__value" data-testid="cloud-cover">{weatherStore.cloudCover}</div>
              </div>
              <div class="weather-detail">
                <div class="weather-detail__label">Wind Direction</div>
                <div class="weather-detail__value" data-testid="wind-direction">{weatherStore.windDirection}</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}
