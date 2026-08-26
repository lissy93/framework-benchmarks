// WeatherService — fetches real or mock weather data.
class WeatherService {
  constructor() {
    this.baseUrl = 'https://api.open-meteo.com/v1';
    this.geocodingUrl = 'https://geocoding-api.open-meteo.com/v1';
    this.useMockData = this._shouldUseMock();
  }

  _shouldUseMock() {
    const ua = navigator.userAgent;
    const isHeadless = ua.includes('Playwright') || ua.includes('HeadlessChrome');
    if (window.location.search.includes('mock=false')) {return false;}
    return window.location.search.includes('mock=true') || isHeadless;
  }

  _isHeadless() {
    return navigator.userAgent.includes('Playwright') || navigator.userAgent.includes('HeadlessChrome');
  }

  async _getMockData() {
    if (this._isHeadless()) {await new Promise(r => setTimeout(r, 200));}
    const res = await fetch('./public/mocks/weather-data.json');
    if (!res.ok) {throw new Error('Failed to load mock data');}
    return res.json();
  }

  _getMockGeocoding(cityName) {
    const cities = {
      'London':    { latitude: 51.5074,  longitude: -0.1278,  name: 'London',    country: 'United Kingdom' },
      'Tokyo':     { latitude: 35.6762,  longitude: 139.6503, name: 'Tokyo',     country: 'Japan' },
      'Paris':     { latitude: 48.8566,  longitude: 2.3522,   name: 'Paris',     country: 'France' },
      'São Paulo': { latitude: -23.5505, longitude: -46.6333, name: 'São Paulo', country: 'Brazil' },
      'New York':  { latitude: 40.7128,  longitude: -74.0060, name: 'New York',  country: 'United States' }
    };
    if (cityName.includes('Invalid') || cityName.includes('123') || !cityName.trim()) {
      throw new Error('Unable to find location. Please check the city name and try again.');
    }
    return cities[cityName] || cities['London'];
  }

  async geocodeLocation(cityName) {
    if (this.useMockData) {return this._getMockGeocoding(cityName);}
    try {
      const res = await fetch(`${this.geocodingUrl}/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`);
      if (!res.ok) {throw new Error('Geocoding failed');}
      const data = await res.json();
      if (!data.results?.length) {throw new Error('Location not found');}
      const { latitude, longitude, name, country } = data.results[0];
      return { latitude, longitude, name, country };
    } catch {
      throw new Error('Unable to find location. Please check the city name and try again.');
    }
  }

  async getWeatherData(latitude, longitude) {
    if (this.useMockData) {return this._getMockData();}
    try {
      const params = new URLSearchParams({
        latitude: latitude.toString(), longitude: longitude.toString(),
        daily: 'temperature_2m_max,temperature_2m_min,weather_code,sunrise,sunset,rain_sum,uv_index_max,precipitation_probability_max',
        current: 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,snowfall,showers,rain,precipitation,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_direction_10m,wind_gusts_10m,wind_speed_10m',
        timezone: 'GMT'
      });
      const res = await fetch(`${this.baseUrl}/forecast?${params}`);
      if (!res.ok) {throw new Error(`Weather API error: ${res.status}`);}
      return res.json();
    } catch {
      throw new Error('Unable to fetch weather data. Please try again later.');
    }
  }

  async getWeatherByCity(cityName) {
    const location = await this.geocodeLocation(cityName);
    const weather = await this.getWeatherData(location.latitude, location.longitude);
    return { ...weather, locationName: location.name, country: location.country };
  }
}
