import { Component } from '@geajs/core';
import CurrentWeather from './CurrentWeather.jsx';
import Forecast from './Forecast.jsx';

export default class WeatherContent extends Component {
  template() {
    return (
      <div class="weather-content" data-testid="weather-content">
        <div class="weather-layout">
          <CurrentWeather />
          <Forecast />
        </div>
      </div>
    );
  }
}
