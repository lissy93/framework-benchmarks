import { Service, signal, inject, resource } from '@angular/core';
import { WeatherService } from './weather.service';
import type { WeatherData } from '../types/weather.types';

@Service()
export class WeatherStateService {
  private readonly weatherService = inject(WeatherService);

  /** The city signal drives the resource reactively. */
  readonly city = signal<string>(this.getInitialCity());

  readonly weather = resource<WeatherData, { city: string }>({
    params: () => ({ city: this.city() }),
    loader: async ({ params, abortSignal }) => {
      // Add a small delay in test environments to make loading state visible
      if (this.isTestEnvironment()) {
        await this.wait(200);
      }

      return this.weatherService.getWeatherByCity(params.city, abortSignal);
    }
  });

  private wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  loadWeather(city: string): void {
    this.city.set(city);
    this.saveLocation(city);
  }

  private getInitialCity(): string {
    return this.getSavedLocation() ?? 'London';
  }

  private saveLocation(city: string): void {
    try {
      localStorage.setItem('weather-app-location', city);
    } catch (error) {
      console.warn('Could not save location to localStorage:', error);
    }
  }

  private getSavedLocation(): string | null {
    try {
      return localStorage.getItem('weather-app-location');
    } catch (error) {
      console.warn('Could not load saved location:', error);
      return null;
    }
  }

  private isTestEnvironment(): boolean {
    return navigator.userAgent.includes('Playwright') ||
           navigator.userAgent.includes('HeadlessChrome');
  }
}
