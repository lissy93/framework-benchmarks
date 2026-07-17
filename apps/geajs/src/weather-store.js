import { Store } from '@geajs/core';
import { WeatherService } from './services/weather-service.js';
import { WeatherUtils } from './utils/weather-utils.js';

const weatherService = new WeatherService();

class WeatherStore extends Store {
  searchQuery = '';
  isLoading = false;
  hasError = false;
  errorMessage = '';
  weatherData = null;
  activeForecastIndex = null;

  // Derived view state — plain getters, re-evaluated reactively by the compiler
  get showErrorState() {
    return !this.isLoading && this.hasError;
  }

  get showContent() {
    return !this.isLoading && !this.hasError && !!this.weatherData;
  }

  get current() {
    return this.weatherData ? this.weatherData.current : null;
  }

  get locationLabel() {
    const data = this.weatherData;
    if (!data) {
      return '';
    }
    return `${data.locationName}${data.country ? `, ${data.country}` : ''}`;
  }

  get currentIcon() {
    return this.current ? WeatherUtils.getWeatherIcon(this.current.weather_code, this.current.is_day) : '';
  }

  get currentTemperature() {
    return this.current ? WeatherUtils.formatTemperature(this.current.temperature_2m) : '';
  }

  get currentCondition() {
    return this.current ? WeatherUtils.getWeatherDescription(this.current.weather_code) : '';
  }

  get conditionClass() {
    return this.current ? WeatherUtils.getConditionClass(this.current.weather_code) : '';
  }

  get feelsLike() {
    return this.current ? WeatherUtils.formatTemperature(this.current.apparent_temperature) : '';
  }

  get humidity() {
    return this.current ? WeatherUtils.formatPercentage(this.current.relative_humidity_2m) : '';
  }

  get windSpeed() {
    return this.current ? WeatherUtils.formatWindSpeed(this.current.wind_speed_10m) : '';
  }

  get pressure() {
    return this.current ? WeatherUtils.formatPressure(this.current.pressure_msl) : '';
  }

  get cloudCover() {
    return this.current ? WeatherUtils.formatPercentage(this.current.cloud_cover) : '';
  }

  get windDirection() {
    return this.current ? WeatherUtils.getWindDirection(this.current.wind_direction_10m) : '';
  }

  get forecastDays() {
    const daily = this.weatherData?.daily;
    if (!daily?.time) {
      return [];
    }
    return daily.time.slice(0, 7).map((date, index) => ({
      index,
      date,
      dayName: WeatherUtils.formatDate(date),
      icon: WeatherUtils.getWeatherIcon(daily.weather_code[index]),
      condition: WeatherUtils.getWeatherDescription(daily.weather_code[index]),
      high: WeatherUtils.formatTemperature(daily.temperature_2m_max[index]),
      low: WeatherUtils.formatTemperature(daily.temperature_2m_min[index]),
      sunrise: daily.sunrise ? WeatherUtils.formatTime(daily.sunrise[index]) : '',
      sunset: daily.sunset ? WeatherUtils.formatTime(daily.sunset[index]) : '',
      rain: `${daily.rain_sum?.[index]?.toFixed(1) || 0} mm`,
      uvIndex: `${daily.uv_index_max?.[index]?.toFixed(1) || 0}`,
      precipitation: WeatherUtils.formatPercentage(daily.precipitation_probability_max?.[index] || 0),
      tempRange: `${WeatherUtils.formatTemperature(daily.temperature_2m_min[index])} to ${WeatherUtils.formatTemperature(daily.temperature_2m_max[index])}`
    }));
  }

  // Actions
  async init() {
    try {
      const savedLocation = this.getSavedLocation();
      if (savedLocation) {
        this.searchQuery = savedLocation;
        await this.loadWeather(savedLocation);
        return;
      }
    } catch (error) {
      console.warn('Could not load saved location:', error);
    }

    // Try to get current location
    try {
      await this.getCurrentLocationWeather();
    } catch (error) {
      console.warn('Could not get current location:', error);
      // Fallback to default location
      this.searchQuery = 'London';
      await this.loadWeather('London');
    }
  }

  async search() {
    const city = this.searchQuery.trim();

    if (!city) {
      this.showError('Please enter a city name');
      return;
    }

    await this.loadWeather(city);
  }

  async loadWeather(city) {
    try {
      this.isLoading = true;
      this.clearError();

      this.weatherData = await weatherService.getWeatherByCity(city);
      this.saveLocation(city);
    } catch (error) {
      this.showError(error.message);
    } finally {
      this.isLoading = false;
    }
  }

  getCurrentLocationWeather() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async(position) => {
          try {
            this.isLoading = true;
            this.clearError();

            const { latitude, longitude } = position.coords;
            const data = await weatherService.getWeatherData(latitude, longitude);
            data.locationName = 'Current Location';
            this.weatherData = data;
            this.searchQuery = 'Current Location';
            resolve();
          } catch (error) {
            reject(error);
          } finally {
            this.isLoading = false;
          }
        },
        (error) => {
          reject(error);
        },
        {
          timeout: 10000,
          enableHighAccuracy: false,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  }

  toggleForecast(index) {
    if (this.activeForecastIndex === index) {
      this.activeForecastIndex = null;
    } else {
      this.activeForecastIndex = index;

      // Smooth scroll to the expanded item
      setTimeout(() => {
        const activeElement = document.querySelector('.forecast-item.active');
        if (activeElement) {
          activeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 100);
    }
  }

  setSearchQuery(value) {
    this.searchQuery = value;
  }

  showError(message) {
    this.hasError = true;
    this.weatherData = null;
    this.errorMessage = message;
  }

  clearError() {
    this.hasError = false;
    this.errorMessage = '';
  }

  saveLocation(city) {
    try {
      localStorage.setItem('weather-app-location', city);
    } catch (error) {
      console.warn('Could not save location to localStorage:', error);
    }
  }

  getSavedLocation() {
    try {
      return localStorage.getItem('weather-app-location');
    } catch (error) {
      console.warn('Could not get saved location from localStorage:', error);
      return null;
    }
  }
}

export default new WeatherStore();
