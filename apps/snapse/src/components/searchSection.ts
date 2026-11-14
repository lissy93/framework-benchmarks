import { div, section, form, input, button, span, type DOMHandler } from 'snapse/DOM';
import { weatherState as s } from '../state/weatherState.js';
import { getWeather } from '../utils/loadWeatherUtils.js';

const handleSearch: DOMHandler<'submit', HTMLFormElement> = (ev) => {
  ev.preventDefault();
  getWeather(String(s.searchTerm).trim());
};

export const searchSection = () =>
  section({ class: 'search-section' },
    form({ class: 'search-form', 'data-testid': 'search-form', submit: handleSearch },
      div({ class: 'search-form__group' },
        input({
          type: 'text', id: 'location-input', class: 'search-input',
          placeholder: 'Enter city name...', 'aria-label': 'Enter city name',
          'data-testid': 'search-input',
          autocomplete: 'off', value: s.searchTerm, input: s.searchTerm
        }),
        button({ type: 'submit', class: 'search-button', 'data-testid': 'search-button',
          disabled: s.status.is('loading') },
          span({ class: 'search-button__text' }, s.status.is('loading').opt('Loading...', 'Get Weather')),
          span({ class: 'search-button__icon' }, '🌦️')
        )
      )
    )
  );
