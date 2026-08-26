import { memo } from 'octane';

function LoadingState({ isVisible }) {
  return (
    <div
      className="loading"
      data-testid="loading"
      hidden={!isVisible}
    >
      <div className="loading__spinner"></div>
      <p>Loading weather data...</p>
    </div>
  );
}

export default memo(LoadingState);
