import { Component } from '@geajs/core';
import weatherStore from '../weather-store.js';
import LoadingState from './LoadingState.jsx';
import ErrorState from './ErrorState.jsx';
import WeatherContent from './WeatherContent.jsx';

export default class WeatherDisplay extends Component {
  template() {
    return (
      <div class="weather-display">
        {weatherStore.isLoading && <LoadingState />}
        {weatherStore.showErrorState && <ErrorState />}
        {weatherStore.showContent && <WeatherContent />}
      </div>
    );
  }
}
