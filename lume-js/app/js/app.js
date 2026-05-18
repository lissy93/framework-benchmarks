// Lume.js Weather App — requires lume.global.js, weather-utils.js, weather-service.js loaded first.
const { state, bindDom, repeat, effect, show, stringAttr } = window.Lume;

const store = state({
  searchQuery: '',
  isLoading: false,
  hasError: false,
  hasData: false,
  showWeather: false,
  errorMessage: 'Please check the city name and try again.',
  buttonText: 'Get Weather',
  locationDisplay: '',
  temperature: '',
  condition: '',
  conditionClass: 'current-weather__condition',
  icon: '🌤️',
  feelsLike: '',
  humidity: '',
  windSpeed: '',
  pressure: '',
  cloudCover: '',
  windDirection: '',
  forecast: [],
  activeForecastIndex: null
});

const weatherService = new WeatherService();

effect(() => { store.showWeather = store.hasData && !store.isLoading && !store.hasError; });

bindDom(document.body, store, { immediate: true, handlers: [show, stringAttr('class')] });

repeat('#forecast-list', store, 'forecast', {
  key: item => item.day,
  element: 'div',

  create(item, el, index) {
    el.className = 'forecast-item';
    el.setAttribute('data-testid', 'forecast-item');
    el.setAttribute('tabindex', '0');
    el.setAttribute('role', 'button');

    el.innerHTML = `
      <div class="forecast-item__day"></div>
      <div class="forecast-item__icon"></div>
      <div class="forecast-item__info">
        <div class="forecast-item__condition"></div>
        <div class="forecast-item__temps" data-testid="forecast-temps">
          <span class="forecast-item__high" data-testid="forecast-high"></span>
          <span class="forecast-item__low" data-testid="forecast-low"></span>
        </div>
      </div>
      <div class="forecast-item__details">
        <div class="forecast-detail-item"><div class="forecast-detail-item__label">Sunrise</div><div class="forecast-detail-item__value" data-detail="sunrise"></div></div>
        <div class="forecast-detail-item"><div class="forecast-detail-item__label">Sunset</div><div class="forecast-detail-item__value" data-detail="sunset"></div></div>
        <div class="forecast-detail-item"><div class="forecast-detail-item__label">Rain</div><div class="forecast-detail-item__value" data-detail="rain"></div></div>
        <div class="forecast-detail-item"><div class="forecast-detail-item__label">UV Index</div><div class="forecast-detail-item__value" data-detail="uvIndex"></div></div>
        <div class="forecast-detail-item"><div class="forecast-detail-item__label">Precipitation</div><div class="forecast-detail-item__value" data-detail="precipitation"></div></div>
        <div class="forecast-detail-item"><div class="forecast-detail-item__label">Temperature</div><div class="forecast-detail-item__value" data-detail="tempRange"></div></div>
      </div>
    `;

    const details = el.querySelector('.forecast-item__details');
    details.hidden = true;

    const unsubscribe = store.$subscribe('activeForecastIndex', idx => {
      const active = idx === index;
      details.hidden = !active;
      el.classList.toggle('active', active);
    });

    const toggle = () => {
      const next = store.activeForecastIndex === index ? null : index;
      store.activeForecastIndex = next;
      if (next === index) {setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);}
    };

    el.addEventListener('click', toggle);
    el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });

    return () => unsubscribe();
  },

  update(item, el) {
    el.setAttribute('aria-label', `View detailed forecast for ${item.day}`);
    el.querySelector('.forecast-item__day').textContent = item.day;
    el.querySelector('.forecast-item__icon').textContent = item.icon;
    el.querySelector('.forecast-item__condition').textContent = item.condition;
    el.querySelector('[data-testid="forecast-high"]').textContent = item.high;
    el.querySelector('[data-testid="forecast-low"]').textContent = item.low;
    el.querySelector('[data-detail="sunrise"]').textContent = item.sunrise;
    el.querySelector('[data-detail="sunset"]').textContent = item.sunset;
    el.querySelector('[data-detail="rain"]').textContent = item.rain;
    el.querySelector('[data-detail="uvIndex"]').textContent = item.uvIndex;
    el.querySelector('[data-detail="precipitation"]').textContent = item.precipitation;
    el.querySelector('[data-detail="tempRange"]').textContent = item.tempRange;
  }
});

document.getElementById('search-form').addEventListener('submit', e => { e.preventDefault(); handleSearch(); });

function setLoading(loading) {
  store.isLoading = loading;
  store.buttonText = loading ? 'Loading...' : 'Get Weather';
}

function processWeatherData(weatherData) {
  const { current, daily, locationName, country } = weatherData;
  store.locationDisplay = locationName + (country ? `, ${country}` : '');
  store.temperature = WeatherUtils.formatTemperature(current.temperature_2m);
  store.condition = WeatherUtils.getWeatherDescription(current.weather_code);
  store.conditionClass = `current-weather__condition ${WeatherUtils.getConditionClass(current.weather_code)}`;
  store.icon = WeatherUtils.getWeatherIcon(current.weather_code, current.is_day);
  store.feelsLike = WeatherUtils.formatTemperature(current.apparent_temperature);
  store.humidity = WeatherUtils.formatPercentage(current.relative_humidity_2m);
  store.windSpeed = WeatherUtils.formatWindSpeed(current.wind_speed_10m);
  store.pressure = WeatherUtils.formatPressure(current.pressure_msl);
  store.cloudCover = WeatherUtils.formatPercentage(current.cloud_cover);
  store.windDirection = WeatherUtils.getWindDirection(current.wind_direction_10m);
  store.activeForecastIndex = null;
  store.forecast = daily.time.map((date, i) => ({
    day: WeatherUtils.formatDate(date),
    icon: WeatherUtils.getWeatherIcon(daily.weather_code[i]),
    condition: WeatherUtils.getWeatherDescription(daily.weather_code[i]),
    high: WeatherUtils.formatTemperature(daily.temperature_2m_max[i]),
    low: WeatherUtils.formatTemperature(daily.temperature_2m_min[i]),
    sunrise: WeatherUtils.formatTime(daily.sunrise[i]),
    sunset: WeatherUtils.formatTime(daily.sunset[i]),
    rain: `${daily.rain_sum[i]?.toFixed(1) || 0} mm`,
    uvIndex: daily.uv_index_max[i]?.toFixed(1) || 0,
    precipitation: WeatherUtils.formatPercentage(daily.precipitation_probability_max[i] || 0),
    tempRange: `${WeatherUtils.formatTemperature(daily.temperature_2m_min[i])} to ${WeatherUtils.formatTemperature(daily.temperature_2m_max[i])}`
  }));
}

let _loadSeq = 0;

async function loadWeather(city) {
  const seq = ++_loadSeq;
  try {
    setLoading(true);
    store.hasError = false;
    const weatherData = await weatherService.getWeatherByCity(city);
    if (seq !== _loadSeq) {return;}
    try { localStorage.setItem('weather-app-location', city); } catch { /* storage unavailable */ }
    processWeatherData(weatherData);
    store.hasData = true;
    store.hasError = false;
  } catch (error) {
    if (seq !== _loadSeq) {return;}
    store.hasError = true;
    store.hasData = false;
    store.errorMessage = error.message;
  } finally {
    if (seq === _loadSeq) {setLoading(false);}
  }
}

async function handleSearch() {
  const city = store.searchQuery.trim();
  if (!city) { store.hasError = true; store.hasData = false; store.errorMessage = 'Please enter a city name'; return; }
  await loadWeather(city);
}

async function init() {
  const isHeadless = navigator.userAgent.includes('Playwright') || navigator.userAgent.includes('HeadlessChrome');
  try {
    const saved = localStorage.getItem('weather-app-location');
    if (saved) { store.searchQuery = saved; await loadWeather(saved); return; }
  } catch { /* ignore read errors */ }

  if (!isHeadless) {
    try {
      await new Promise((resolve, reject) => {
        if (!navigator.geolocation) { reject(new Error('Geolocation not available')); return; }
        navigator.geolocation.getCurrentPosition(async pos => {
          try {
            setLoading(true);
            const data = await weatherService.getWeatherData(pos.coords.latitude, pos.coords.longitude);
            data.locationName = 'Current Location';
            store.searchQuery = 'Current Location';
            processWeatherData(data);
            store.hasData = true;
            resolve();
          } catch (e) { reject(e); } finally { setLoading(false); }
        }, reject, { timeout: 10000, enableHighAccuracy: false, maximumAge: 300000 });
      });
      return;
    } catch { /* ignore geolocation errors */ }
  }

  if (_loadSeq === 0) { store.searchQuery = 'London'; await loadWeather('London'); }
}

init();
