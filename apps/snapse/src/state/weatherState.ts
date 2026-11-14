import { state } from 'snapse';
import type { WeatherData } from '../services/weatherService.js';

export const weatherState = state({
  status: 'loading' as 'loading' | 'error' | 'content',
  searchTerm: '',
  weather: null as WeatherData | null,
  errorMessage: ''
});
