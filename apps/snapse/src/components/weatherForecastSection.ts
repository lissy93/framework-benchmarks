import { type State, state } from 'snapse';
import { div, h2, section, span } from 'snapse/DOM';
import type { WeatherData } from '../services/weatherService.js';
import { format, weatherInfo } from '../utils/weatherDisplayUtils.js';
import { weatherState as s } from '../state/weatherState.js';

export type DailyForecast = {
  time: string[]
  temperature_2m_max: number[]
  temperature_2m_min: number[]
  weather_code: number[]
  sunrise: string[]
  sunset: string[]
  rain_sum: number[]
  uv_index_max: number[]
  precipitation_probability_max: number[]
}

const forecastDetail = (label: string, value: string) =>
  div({ class: 'forecast-detail-item' },
    div({ class: 'forecast-detail-item__label' }, label),
    div({ class: 'forecast-detail-item__value' }, value)
  );

const forecastDetails = (daily: DailyForecast, index: number) =>
  div({ class: 'forecast-item__details' },
    forecastDetail('Sunrise', format.time(daily.sunrise[index]!)),
    forecastDetail('Sunset', format.time(daily.sunset[index]!)),
    forecastDetail('Rain', `${daily.rain_sum[index]!.toFixed(1)} mm`),
    forecastDetail('UV Index', daily.uv_index_max[index]!.toFixed(1)),
    forecastDetail('Precipitation', format.percentage(daily.precipitation_probability_max[index]!)),
    forecastDetail('Temperature', `${format.temperature(daily.temperature_2m_min[index]!)} to ` +
      `${format.temperature(daily.temperature_2m_max[index]!)}`)
  );

const forecastItem = (daily: DailyForecast, index: number, expandedIndex: State<number>) => {
  const dayName = format.date(daily.time[index]!);
  const expanded = expandedIndex.is(index);
  const info = weatherInfo(daily.weather_code[index]!);
  const toggle = () => expandedIndex.set(+expanded ? -1 : index);

  return div({
    class: ['forecast-item', { active: expanded }],
    'data-testid': 'forecast-item',
    tabIndex: 0,
    role: 'button',
    'aria-label': `View detailed forecast for ${dayName}`,
    click: toggle,
    keydown: ev => {
      if (ev.key === 'Enter' || ev.key === ' ') {
        ev.preventDefault();
        toggle();
      }
    }
  },
  div({ class: 'forecast-item__day' }, dayName),
  div({ class: 'forecast-item__icon' }, info.icon),
  div({ class: 'forecast-item__info' },
    div({ class: 'forecast-item__condition' }, info.description),
    div({ class: 'forecast-item__temps', 'data-testid': 'forecast-temps' },
      span({ class: 'forecast-item__high', 'data-testid': 'forecast-high' },
        format.temperature(daily.temperature_2m_max[index]!)
      ),
      span({ class: 'forecast-item__low', 'data-testid': 'forecast-low' },
        format.temperature(daily.temperature_2m_min[index]!)
      )
    )
  ),
  expanded.opt(() => forecastDetails(daily, index)));
};

export const weatherForecastSection = () => {
  const { daily } = s.weather as State<WeatherData>;
  const expandedIndex = state(-1);
  return section({ class: 'forecast-section' },
    h2({ class: 'section-title' }, '7-Day Forecast'),
    div({ class: 'forecast' },
      div({ class: 'forecast__list', 'data-testid': 'forecast-list' },
        daily.time.map((_date, index) => forecastItem(daily, index, expandedIndex))
      )
    )
  );
};
