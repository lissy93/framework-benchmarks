import { getWeatherByCity } from '../services/weatherService.js';
import { weatherState as s } from '../state/weatherState.js';
import { LOCALSTORAGE_LOCATION_KEY } from '../constants/localstorageKeys.js';
import { state } from 'snapse';

export const getWeather = async(city: string) => {
  if (!city) return;
  s.status.set('loading');
  try {
    s.weather = state(null);
    s.weather.set(await getWeatherByCity(city));
    s.status.set('content');
  } catch (err) {
    s.errorMessage.set((err as Error).message);
    s.status.set('error');
    return;
  }
  try {
    localStorage.setItem(LOCALSTORAGE_LOCATION_KEY, city);
  } catch {
    // localStorage unavailable (private mode, disabled, etc.) - not fatal.
  }
};

export const initWeatherData = () => {
  let city = 'London';
  try {
    city = localStorage.getItem(LOCALSTORAGE_LOCATION_KEY) || city;
  } catch {
    // localStorage unavailable - use the default.
  }
  s.searchTerm.set(city);
  getWeather(city);
};
