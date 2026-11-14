import { shouldUseMockData, getMockGeocodingData, getMockData } from './mockWeatherUtils.js';
import type { CurrentWeather } from '../components/weatherCurrentSection.js';
import type { DailyForecast } from '../components/weatherForecastSection.js';
import { METEO_BASE_URL } from '../constants/meteo.js';
import { GEOCODING_URL } from '../constants/geocoding.js';

export type WeatherData = {
  current: CurrentWeather
  daily: DailyForecast
  locationName?: string
  country?: string
}

export type GeoLocation = { latitude: number, longitude: number, name: string, country?: string }

const geocodeLocation = async(cityName: string): Promise<GeoLocation> => {
  if (shouldUseMockData()) return getMockGeocodingData(cityName);

  try {
    const response = await fetch(
      `${GEOCODING_URL}/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`
    );
    if (!response.ok) throw new Error();

    const data = await response.json() as { results?: GeoLocation[] };
    if (!data.results?.length) throw new Error();
    return data.results[0];
  } catch {
    throw new Error('Unable to find location. Please check the city name and try again.');
  }
};

const getWeatherData = async(latitude: number, longitude: number): Promise<WeatherData> => {
  if (shouldUseMockData()) return getMockData();

  try {
    const params = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      daily: 'temperature_2m_max,temperature_2m_min,weather_code,sunrise,sunset,rain_sum,' +
        'uv_index_max,precipitation_probability_max',
      current: 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,' +
        'cloud_cover,pressure_msl,wind_direction_10m,wind_speed_10m',
      timezone: 'auto'
    });
    const response = await fetch(`${METEO_BASE_URL}/forecast?${params}`);
    if (!response.ok) throw new Error();
    return await response.json() as WeatherData;
  } catch {
    throw new Error('Unable to fetch weather data. Please try again later.');
  }
};

export const getWeatherByCity = async(cityName: string): Promise<WeatherData> => {
  const { latitude, longitude, name, country } = await geocodeLocation(cityName);
  const weather = await getWeatherData(latitude, longitude);
  return { ...weather, locationName: name, country };
};
