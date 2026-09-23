import { Component } from '@geajs/core';
import weatherStore from '../weather-store.js';

export default class ErrorState extends Component {
  template() {
    return (
      <div class="error" data-testid="error">
        <h2 class="error__title">Unable to load weather data</h2>
        <p class="error__message">{weatherStore.errorMessage || 'Please check the city name and try again.'}</p>
      </div>
    );
  }
}
