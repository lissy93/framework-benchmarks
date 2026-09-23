import { ErrorBoundary } from 'octane';
import SearchForm from './components/SearchForm.tsx';
import LoadingState from './components/LoadingState.tsx';
import ErrorState from './components/ErrorState.tsx';
import WeatherContent from './components/WeatherContent.tsx';
import useWeatherData from './hooks/useWeatherData.js';

function UnexpectedError({ error }) {
  return (
    <div className="error" data-testid="error">
      <h2 className="error__title">Something went wrong</h2>
      <p className="error__message">
        An unexpected error occurred. Please refresh the page and try again.
      </p>
      <details style={{ marginTop: '1rem', fontSize: '0.875rem' }}>
        <summary>Error details</summary>
        <pre style={{ marginTop: '0.5rem', padding: '0.5rem', background: '#f5f5f5', borderRadius: '4px' }}>
          {String(error)}
        </pre>
      </details>
    </div>
  );
}

function App() {
  const { weatherData, isLoading, error, loadWeather } = useWeatherData();

  const handleSearch = async(city) => {
    await loadWeather(city);
  };

  return (
    <ErrorBoundary fallback={(caught) => <UnexpectedError error={caught} />}>
      <header className="header">
        <div className="container">
          <h1 className="header__title">Weather Front</h1>
        </div>
      </header>

      <main className="main">
        <div className="container">
          <SearchForm
            onSearch={handleSearch}
            isLoading={isLoading}
          />

          <div className="weather-container" data-testid="weather-container">
            <LoadingState isVisible={isLoading} />
            <ErrorState isVisible={!!error && !isLoading} message={error} />
            <WeatherContent isVisible={!!weatherData && !isLoading && !error} weatherData={weatherData} />
          </div>
        </div>
      </main>

      <footer className="footer">
        <div className="container">
          <p className="footer__text">
            Built with Octane • MIT License •
            <a href="https://github.com/Lissy93" className="footer__link" target="_blank" rel="noopener">
              Alicia Sykes
            </a>
          </p>
        </div>
      </footer>
    </ErrorBoundary>
  );
}

export default App;
