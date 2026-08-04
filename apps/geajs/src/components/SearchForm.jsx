import { Component } from '@geajs/core';
import weatherStore from '../weather-store.js';

export default class SearchForm extends Component {
  handleInput(e) {
    weatherStore.setSearchQuery(e.target.value);
  }

  handleSubmit(e) {
    e.preventDefault();
    weatherStore.search();
  }

  template() {
    return (
      <section class="search-section">
        <form class="search-form" data-testid="search-form" submit={this.handleSubmit}>
          <div class="search-form__group">
            <label for="location-input" class="sr-only">Enter city name</label>
            <input
              type="text"
              id="location-input"
              class="search-input"
              placeholder="Enter city name..."
              data-testid="search-input"
              autocomplete="off"
              value={weatherStore.searchQuery}
              input={this.handleInput}
            />
            <button type="submit" class="search-button" data-testid="search-button" disabled={weatherStore.isLoading}>
              <span class="search-button__text">{weatherStore.isLoading ? 'Loading...' : 'Get Weather'}</span>
              <span class="search-button__icon">🌦️</span>
            </button>
          </div>
        </form>
      </section>
    );
  }
}
