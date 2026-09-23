import { Component } from '@geajs/core';
import SearchForm from './components/SearchForm.jsx';
import WeatherDisplay from './components/WeatherDisplay.jsx';

export default class App extends Component {
  template() {
    return (
      <div class="app-shell">
        <header class="header">
          <div class="container">
            <h1 class="header__title">Weather Front</h1>
          </div>
        </header>
        <main class="main">
          <div class="container">
            <SearchForm />
            <div class="weather-container" data-testid="weather-container">
              <WeatherDisplay />
            </div>
          </div>
        </main>
        <footer class="footer">
          <div class="container">
            <p class="footer__text">
              Built with Gea • MIT License • <a href="https://github.com/Lissy93" class="footer__link" target="_blank" rel="noopener">Alicia Sykes</a>
            </p>
          </div>
        </footer>
      </div>
    );
  }
}
