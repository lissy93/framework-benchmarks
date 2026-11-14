import type { WeatherData, GeoLocation } from './weatherService.js';

const MOCK_CITIES: Record<string, GeoLocation> = {
  London: { latitude: 51.5074, longitude: -0.1278, name: 'London', country: 'United Kingdom' },
  Tokyo: { latitude: 35.6762, longitude: 139.6503, name: 'Tokyo', country: 'Japan' },
  Paris: { latitude: 48.8566, longitude: 2.3522, name: 'Paris', country: 'France' },
  'São Paulo': { latitude: -23.5505, longitude: -46.6333, name: 'São Paulo', country: 'Brazil' },
  'New York': { latitude: 40.7128, longitude: -74.006, name: 'New York', country: 'United States' }
};

export const shouldUseMockData = (): boolean => window.location.search.includes('mock=true');

export const getMockData = async(): Promise<WeatherData> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  const response = await fetch('./mocks/weather-data.json');
  if (!response.ok) throw new Error('Failed to load mock data');
  return response.json() as Promise<WeatherData>;
};

export const getMockGeocodingData = (cityName: string): GeoLocation => {
  if (cityName.includes('Invalid') || cityName.includes('123') || !cityName.trim()) {
    throw new Error('Unable to find location. Please check the city name and try again.');
  }
  return MOCK_CITIES[cityName] ?? MOCK_CITIES.London!;
};
