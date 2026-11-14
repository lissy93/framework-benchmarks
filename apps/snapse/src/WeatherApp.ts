import { component, SnapseRoot } from 'snapse';
import { div, h2, header, h1, main, p, footer, a } from 'snapse/DOM';
import { searchSection } from './components/searchSection.js';
import { initWeatherData } from './utils/loadWeatherUtils.js';
import { weatherCurrentSection } from './components/weatherCurrentSection.js';
import { weatherForecastSection } from './components/weatherForecastSection.js';
import { weatherState as s } from './state/weatherState.js';

const weatherContent = () =>
  div({ class: 'weather-content', 'data-testid': 'weather-content' },
    div({ class: 'weather-layout' },
      weatherCurrentSection,
      weatherForecastSection
    )
  );

const weatherContainer = () =>
  div({ class: 'weather-container', 'data-testid': 'weather-container' },
    s.status.opt({
      loading: div({ class: 'loading', 'data-testid': 'loading' },
        div({ class: 'loading__spinner' }),
        p('Loading weather data...')
      ),
      error: div({ class: 'error', 'data-testid': 'error' },
        h2({ class: 'error__title' }, 'Unable to load weather data'),
        p({ class: 'error__message' }, s.errorMessage)
      ),
      content: weatherContent
    })
  );

export const WeatherApp = component(() => {
  return [
    header({ class: 'header' },
      div({ class: 'container' },
        h1({ class: 'header__title' }, 'Weather Front')
      )
    ),
    main({ class: 'main' },
      div({ class: 'container' },
        searchSection,
        weatherContainer
      )
    ),
    footer({ class: 'footer' },
      div({ class: 'container' },
        p({ class: 'footer__text' },
          'Built with Snapse • MIT License • ',
          a({ href: 'https://github.com/Lissy93', class: 'footer__link', target: '_blank',
            rel: 'noopener' }, 'Alicia Sykes')
        )
      )
    )
  ];
});

SnapseRoot({ root: document.getElementById('app')! }, WeatherApp);
initWeatherData();
