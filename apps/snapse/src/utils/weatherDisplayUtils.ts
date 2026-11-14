import { state } from 'snapse';

export const weatherInfo = state((weatherCode: number, isDay = 1) => {
  const weatherInfo: Record<number, string[]> = {
    0: [isDay > 0 ? '☀️' : '🌙', 'sunny', 'Clear sky'],
    1: [isDay > 0 ? '⛅' : '☁️', 'cloudy', 'Mainly clear'],
    2: [isDay > 0 ? '⛅' : '☁️', 'cloudy', 'Partly cloudy'],
    3: [isDay > 0 ? '⛅' : '☁️', 'cloudy', 'Overcast'],
    45: ['🌫️', 'cloudy', 'Fog'],
    48: ['🌫️', 'cloudy', 'Depositing rime fog'],
    51: ['🌧️', 'rainy', 'Light drizzle'],
    53: ['🌧️', 'rainy', 'Moderate drizzle'],
    55: ['🌧️', 'rainy', 'Dense drizzle'],
    56: ['🌧️', 'rainy', 'Light freezing drizzle'],
    57: ['🌧️', 'rainy', 'Dense freezing drizzle'],
    61: ['🌧️', 'rainy', 'Slight rain'],
    63: ['🌧️', 'rainy', 'Moderate rain'],
    65: ['🌧️', 'rainy', 'Heavy rain'],
    66: ['🌧️', 'rainy', 'Light freezing rain'],
    67: ['🌧️', 'rainy', 'Heavy freezing rain'],
    71: ['❄️', 'cloudy', 'Slight snow fall'],
    73: ['❄️', 'cloudy', 'Moderate snow fall'],
    75: ['❄️', 'cloudy', 'Heavy snow fall'],
    77: ['❄️', 'cloudy', 'Snow grains'],
    80: ['🌧️', 'rainy', 'Slight rain showers'],
    81: ['🌧️', 'rainy', 'Moderate rain showers'],
    82: ['🌧️', 'rainy', 'Violent rain showers'],
    85: ['🌨️', 'cloudy', 'Slight snow showers'],
    86: ['🌨️', 'cloudy', 'Heavy snow showers'],
    95: ['⛈️', 'stormy', 'Thunderstorm'],
    96: ['⛈️', 'stormy', 'Thunderstorm with slight hail'],
    99: ['⛈️', 'stormy', 'Thunderstorm with heavy hail']
  };
  const [icon, cl, description] = weatherInfo[weatherCode] ?? ['🌤️', 'cloudy', 'Unknown'];
  return { icon, cl, description };
});

const WIND_DIRECTIONS = [
  'N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
  'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'
];

export const format = state({
  temperature: (temp: number): string => `${Math.round(temp)}°C`,
  windSpeed: (speed: number): string => `${Math.round(speed)} km/h`,
  windDirection: (degrees: number): string => WIND_DIRECTIONS[Math.round(degrees / 22.5) % 16]!,
  pressure: (pressure: number): string => `${Math.round(pressure)} hPa`,
  percentage: (value: number): string => `${Math.round(value)}%`,
  date: (dateString: string): string =>
    new Date(`${dateString}T00:00`).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
  time: (timeString: string): string =>
    new Date(timeString).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
});
