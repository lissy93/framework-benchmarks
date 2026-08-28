import { memo } from 'octane';
import CurrentWeather from './CurrentWeather.tsx';
import Forecast from './Forecast.tsx';

const WeatherContent = ({ isVisible, weatherData }) => {
  return (
    <div
      className="weather-content"
      data-testid="weather-content"
      hidden={!isVisible}
    >
      <div className="weather-layout">
        <CurrentWeather weatherData={weatherData} />
        <Forecast weatherData={weatherData} />
      </div>
    </div>
  );
};

export default memo(WeatherContent);
