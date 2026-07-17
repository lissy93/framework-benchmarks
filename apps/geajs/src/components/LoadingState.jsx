export default function LoadingState() {
  return (
    <div class="loading" data-testid="loading">
      <div class="loading__spinner"></div>
      <p>Loading weather data...</p>
    </div>
  );
}
