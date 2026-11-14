import { type State } from 'snapse';
import { div, h2, h3, section } from 'snapse/DOM';
import type { WeatherData } from '../services/weatherService.js';
import { format, weatherInfo } from '../utils/weatherDisplayUtils.js';
import { weatherState as s } from '../state/weatherState.js';

export type CurrentWeather = {
  temperature_2m: number
  relative_humidity_2m: number
  apparent_temperature: number
  is_day: number
  weather_code: number
  cloud_cover: number
  pressure_msl: number
  wind_direction_10m: number
  wind_speed_10m: number
}

const weatherDetail = (label: string, testId: string, value: string) =>
  div({ class: 'weather-detail' },
    div({ class: 'weather-detail__label' }, label),
    div({ class: 'weather-detail__value', 'data-testid': testId }, value)
  );

const weatherDetails = (current: State<CurrentWeather>) =>
  div({ class: 'current-weather__details' },
    weatherDetail('Feels like', 'feels-like', format.temperature(current.apparent_temperature)),
    weatherDetail('Humidity', 'humidity', format.percentage(current.relative_humidity_2m)),
    weatherDetail('Wind Speed', 'wind-speed', format.windSpeed(current.wind_speed_10m)),
    weatherDetail('Pressure', 'pressure', format.pressure(current.pressure_msl)),
    weatherDetail('Cloud Cover', 'cloud-cover', format.percentage(current.cloud_cover)),
    weatherDetail('Wind Direction', 'wind-direction', format.windDirection(current.wind_direction_10m))
  );

const currentWeather = () => {
  const { current, locationName, country } = s.weather as State<WeatherData>;
  const info = weatherInfo(current.weather_code, current.is_day);
  return div({ class: 'current-weather' },
    h3({ class: 'current-weather__location', 'data-testid': 'current-location' },
      locationName, country?.opt(', '), country
    ),
    div({ class: 'current-weather__main' },
      div({ class: 'current-weather__icon', 'data-testid': 'current-icon' },
        info.icon
      ),
      div({ class: 'current-weather__temp-group' },
        div({ class: 'current-weather__temp', 'data-testid': 'current-temperature' },
          format.temperature(current.temperature_2m)
        ),
        div({
          class: ['current-weather__condition', `weather-condition-${info.cl}`],
          'data-testid': 'current-condition'
        }, info.description)
      )
    ),
    weatherDetails(current)
  );
};

export const weatherCurrentSection = () =>
  section({ class: 'current-section' },
    h2({ class: 'section-title' }, 'Current Weather'),
    div({ class: 'weather-card', 'data-testid': 'current-weather' },
      currentWeather
    )
  );
