import { Component } from '@geajs/core';
import weatherStore from '../weather-store.js';
import ForecastItem from './ForecastItem.jsx';

export default class Forecast extends Component {
  template() {
    return (
      <section class="forecast-section">
        <h2 class="section-title">7-Day Forecast</h2>
        <div class="forecast">
          <div class="forecast__list" data-testid="forecast-list">
            {weatherStore.forecastDays.map(day => (
              <ForecastItem key={day.date} day={day} />
            ))}
          </div>
        </div>
      </section>
    );
  }
}
