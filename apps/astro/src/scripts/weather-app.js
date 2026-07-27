import { WeatherService } from '../lib/weather-service.js';
import { WeatherUtils } from '../lib/weather-utils.js';

const STORAGE_KEY = 'weather-app-location';

/**
 * Client-side island for the Astro weather app.
 * Astro renders the static shell, this script owns all interactivity.
 */
class WeatherApp {
  constructor() {
    this.service = new WeatherService();
    this.latestRequestId = 0;
    this.activeForecastIndex = null;
    this.weatherData = null;

    this.elements = {
      form: document.querySelector('[data-testid="search-form"]'),
      input: document.querySelector('[data-testid="search-input"]'),
      button: document.querySelector('[data-testid="search-button"]'),
      buttonText: document.querySelector('.search-button__text'),
      loading: document.querySelector('[data-testid="loading"]'),
      error: document.querySelector('[data-testid="error"]'),
      errorMessage: document.querySelector('.error__message'),
      content: document.querySelector('[data-testid="weather-content"]'),
      location: document.querySelector('[data-testid="current-location"]'),
      icon: document.querySelector('[data-testid="current-icon"]'),
      temperature: document.querySelector('[data-testid="current-temperature"]'),
      condition: document.querySelector('[data-testid="current-condition"]'),
      feelsLike: document.querySelector('[data-testid="feels-like"]'),
      humidity: document.querySelector('[data-testid="humidity"]'),
      windSpeed: document.querySelector('[data-testid="wind-speed"]'),
      pressure: document.querySelector('[data-testid="pressure"]'),
      cloudCover: document.querySelector('[data-testid="cloud-cover"]'),
      windDirection: document.querySelector('[data-testid="wind-direction"]'),
      forecastList: document.querySelector('[data-testid="forecast-list"]')
    };
  }

  async init() {
    this.elements.form.addEventListener('submit', (event) => {
      event.preventDefault();
      const city = this.elements.input.value.trim();
      if (city) {
        this.loadWeather(city);
      }
    });

    const savedLocation = this.getSavedLocation();
    if (savedLocation) {
      this.elements.input.value = savedLocation;
      await this.loadWeather(savedLocation);
      return;
    }

    if (this.service.useMockData) {
      await this.loadWeather('London');
      return;
    }

    try {
      this.setLoading(true);
      this.weatherData = await this.service.getCurrentLocationWeather();
      this.render();
      this.setLoading(false);
    } catch (err) {
      console.warn('Could not get current location:', err);
      await this.loadWeather('London');
    }
  }

  async loadWeather(city) {
    const requestId = ++this.latestRequestId;

    try {
      this.setLoading(true);
      this.setError(null);

      if (this.service.isTestEnvironment()) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      const data = await this.service.getWeatherByCity(city);

      if (requestId !== this.latestRequestId) {
        return;
      }

      this.weatherData = data;
      this.activeForecastIndex = null;
      this.saveLocation(city);
      this.render();
    } catch (err) {
      if (requestId === this.latestRequestId) {
        console.error('Weather app error:', err);
        this.setError(err.message);
      }
    } finally {
      if (requestId === this.latestRequestId) {
        this.setLoading(false);
      }
    }
  }

  setLoading(isLoading) {
    this.elements.loading.hidden = !isLoading;
    this.elements.button.disabled = isLoading;
    this.elements.buttonText.textContent = isLoading ? 'Loading...' : 'Get Weather';

    if (isLoading) {
      this.elements.content.hidden = true;
      this.elements.error.hidden = true;
    } else {
      this.elements.content.hidden = !this.weatherData || !this.elements.error.hidden;
    }
  }

  setError(message) {
    if (!message) {
      this.elements.error.hidden = true;
      return;
    }

    this.elements.errorMessage.textContent = message;
    this.elements.error.hidden = false;
    this.elements.content.hidden = true;
  }

  render() {
    if (!this.weatherData) {
      return;
    }

    this.renderCurrent(this.weatherData);
    this.renderForecast(this.weatherData.daily);
    this.elements.content.hidden = false;
  }

  renderCurrent(data) {
    const current = data.current;
    const { elements } = this;

    elements.location.textContent = data.country
      ? `${data.locationName}, ${data.country}`
      : data.locationName;
    elements.icon.textContent = WeatherUtils.getWeatherIcon(current.weather_code, current.is_day);
    elements.temperature.textContent = WeatherUtils.formatTemperature(current.temperature_2m);
    elements.condition.textContent = WeatherUtils.getWeatherDescription(current.weather_code);
    elements.condition.className = `current-weather__condition ${WeatherUtils.getConditionClass(current.weather_code)}`;
    elements.feelsLike.textContent = WeatherUtils.formatTemperature(current.apparent_temperature);
    elements.humidity.textContent = WeatherUtils.formatPercentage(current.relative_humidity_2m);
    elements.windSpeed.textContent = WeatherUtils.formatWindSpeed(current.wind_speed_10m);
    elements.pressure.textContent = WeatherUtils.formatPressure(current.pressure_msl);
    elements.cloudCover.textContent = WeatherUtils.formatPercentage(current.cloud_cover);
    elements.windDirection.textContent = WeatherUtils.getWindDirection(current.wind_direction_10m);
  }

  renderForecast(daily) {
    const list = this.elements.forecastList;
    list.textContent = '';

    daily.time.slice(0, 7).forEach((date, index) => {
      list.appendChild(this.buildForecastItem(daily, index));
    });
  }

  buildForecastItem(daily, index) {
    const weatherCode = daily.weather_code[index];
    const dayName = WeatherUtils.formatDate(daily.time[index]);
    const high = WeatherUtils.formatTemperature(daily.temperature_2m_max[index]);
    const low = WeatherUtils.formatTemperature(daily.temperature_2m_min[index]);
    const isActive = this.activeForecastIndex === index;

    const item = document.createElement('div');
    item.className = isActive ? 'forecast-item active' : 'forecast-item';
    item.dataset.testid = 'forecast-item';
    item.tabIndex = 0;
    item.setAttribute('role', 'button');
    item.setAttribute('aria-label', `View detailed forecast for ${dayName}`);

    item.innerHTML = `
      <div class="forecast-item__day">${dayName}</div>
      <div class="forecast-item__icon">${WeatherUtils.getWeatherIcon(weatherCode)}</div>
      <div class="forecast-item__info">
        <div class="forecast-item__condition">${WeatherUtils.getWeatherDescription(weatherCode)}</div>
        <div class="forecast-item__temps" data-testid="forecast-temps">
          <span class="forecast-item__high" data-testid="forecast-high">${high}</span>
          <span class="forecast-item__low" data-testid="forecast-low">${low}</span>
        </div>
      </div>
      ${isActive ? this.buildForecastDetails(daily, index) : ''}
    `;

    item.addEventListener('click', () => this.toggleForecast(index));
    item.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        this.toggleForecast(index);
      }
    });

    return item;
  }

  buildForecastDetails(daily, index) {
    const details = [
      { label: 'Sunrise', value: WeatherUtils.formatTime(daily.sunrise[index]) },
      { label: 'Sunset', value: WeatherUtils.formatTime(daily.sunset[index]) },
      { label: 'Rain', value: `${daily.rain_sum[index].toFixed(1)} mm` },
      { label: 'UV Index', value: daily.uv_index_max[index].toFixed(1) },
      { label: 'Precipitation', value: WeatherUtils.formatPercentage(daily.precipitation_probability_max[index]) },
      {
        label: 'Temperature',
        value: `${WeatherUtils.formatTemperature(daily.temperature_2m_min[index])} to ${WeatherUtils.formatTemperature(daily.temperature_2m_max[index])}`
      }
    ];

    const items = details.map((detail) => `
      <div class="forecast-detail-item">
        <div class="forecast-detail-item__label">${detail.label}</div>
        <div class="forecast-detail-item__value">${detail.value}</div>
      </div>
    `).join('');

    return `<div class="forecast-item__details">${items}</div>`;
  }

  toggleForecast(index) {
    this.activeForecastIndex = this.activeForecastIndex === index ? null : index;
    this.renderForecast(this.weatherData.daily);

    if (this.activeForecastIndex !== null) {
      setTimeout(() => {
        const activeElement = document.querySelector('.forecast-item.active');
        if (activeElement) {
          activeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 100);
    }
  }

  saveLocation(city) {
    try {
      localStorage.setItem(STORAGE_KEY, city);
    } catch (err) {
      console.warn('Could not save location to localStorage:', err);
    }
  }

  getSavedLocation() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (err) {
      console.warn('Could not load saved location:', err);
      return null;
    }
  }
}

export function initWeatherApp() {
  const app = new WeatherApp();
  app.init();
}
