// Weather utility functions — pure, stateless helpers.
class WeatherUtils {
  static getWeatherDescription(weatherCode) {
    const weatherCodes = {
      0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
      45: 'Fog', 48: 'Depositing rime fog',
      51: 'Light drizzle', 53: 'Moderate drizzle', 55: 'Dense drizzle',
      56: 'Light freezing drizzle', 57: 'Dense freezing drizzle',
      61: 'Slight rain', 63: 'Moderate rain', 65: 'Heavy rain',
      66: 'Light freezing rain', 67: 'Heavy freezing rain',
      71: 'Slight snow fall', 73: 'Moderate snow fall', 75: 'Heavy snow fall',
      77: 'Snow grains',
      80: 'Slight rain showers', 81: 'Moderate rain showers', 82: 'Violent rain showers',
      85: 'Slight snow showers', 86: 'Heavy snow showers',
      95: 'Thunderstorm', 96: 'Thunderstorm with slight hail', 99: 'Thunderstorm with heavy hail'
    };
    return weatherCodes[weatherCode] || 'Unknown';
  }

  static getWeatherIcon(weatherCode, isDay = true) {
    if (weatherCode === 0) {return isDay ? '☀️' : '🌙';}
    if (weatherCode <= 3) {return isDay ? '⛅' : '☁️';}
    if (weatherCode <= 48) {return '🌫️';}
    if (weatherCode <= 57 || (weatherCode >= 80 && weatherCode <= 82)) {return '🌧️';}
    if (weatherCode >= 61 && weatherCode <= 67) {return '🌧️';}
    if (weatherCode >= 71 && weatherCode <= 77) {return '❄️';}
    if (weatherCode >= 85 && weatherCode <= 86) {return '🌨️';}
    if (weatherCode >= 95) {return '⛈️';}
    return '🌤️';
  }

  static getConditionClass(weatherCode) {
    if (weatherCode === 0) {return 'weather-condition-sunny';}
    if (weatherCode <= 3) {return 'weather-condition-cloudy';}
    if ((weatherCode >= 51 && weatherCode <= 67) || (weatherCode >= 80 && weatherCode <= 82)) {return 'weather-condition-rainy';}
    if (weatherCode >= 95) {return 'weather-condition-stormy';}
    return 'weather-condition-cloudy';
  }

  static formatTemperature(temp) { return `${Math.round(temp)}°C`; }
  static formatWindSpeed(speed) { return `${Math.round(speed)} km/h`; }
  static formatPressure(pressure) { return `${Math.round(pressure)} hPa`; }
  static formatPercentage(value) { return `${Math.round(value)}%`; }

  static getWindDirection(degrees) {
    const dirs = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW'];
    return dirs[Math.round(degrees / 22.5) % 16];
  }

  static formatDate(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    if (date.toDateString() === today.toDateString()) {return 'Today';}
    if (date.toDateString() === tomorrow.toDateString()) {return 'Tomorrow';}
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  }

  static formatTime(timeString) {
    return new Date(timeString).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  }
}
