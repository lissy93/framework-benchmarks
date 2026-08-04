import { Component } from '@geajs/core';
import weatherStore from '../weather-store.js';

export default class ForecastItem extends Component {
  handleClick() {
    weatherStore.toggleForecast(this.props.day.index);
  }

  handleKeydown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      weatherStore.toggleForecast(this.props.day.index);
    }
  }

  template({ day }) {
    return (
      <div
        class={`forecast-item ${weatherStore.activeForecastIndex === day.index ? 'active' : ''}`}
        data-testid="forecast-item"
        tabindex="0"
        role="button"
        aria-label={`View detailed forecast for ${day.dayName}`}
        click={this.handleClick}
        keydown={this.handleKeydown}
      >
        <div class="forecast-item__day">{day.dayName}</div>
        <div class="forecast-item__icon">{day.icon}</div>
        <div class="forecast-item__info">
          <div class="forecast-item__condition">{day.condition}</div>
          <div class="forecast-item__temps" data-testid="forecast-temps">
            <span class="forecast-item__high" data-testid="forecast-high">{day.high}</span>
            <span class="forecast-item__low" data-testid="forecast-low">{day.low}</span>
          </div>
        </div>
        {weatherStore.activeForecastIndex === day.index && (
          <div class="forecast-item__details">
            <div class="forecast-detail-item">
              <div class="forecast-detail-item__label">Sunrise</div>
              <div class="forecast-detail-item__value">{day.sunrise}</div>
            </div>
            <div class="forecast-detail-item">
              <div class="forecast-detail-item__label">Sunset</div>
              <div class="forecast-detail-item__value">{day.sunset}</div>
            </div>
            <div class="forecast-detail-item">
              <div class="forecast-detail-item__label">Rain</div>
              <div class="forecast-detail-item__value">{day.rain}</div>
            </div>
            <div class="forecast-detail-item">
              <div class="forecast-detail-item__label">UV Index</div>
              <div class="forecast-detail-item__value">{day.uvIndex}</div>
            </div>
            <div class="forecast-detail-item">
              <div class="forecast-detail-item__label">Precipitation</div>
              <div class="forecast-detail-item__value">{day.precipitation}</div>
            </div>
            <div class="forecast-detail-item">
              <div class="forecast-detail-item__label">Temperature</div>
              <div class="forecast-detail-item__value">{day.tempRange}</div>
            </div>
          </div>
        )}
      </div>
    );
  }
}
