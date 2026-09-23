<script>
@import WeatherUtils 'lib/weather-utils.module.civet'

$daily = null
$index = 0
$isActive = false

onClick = -> µemit 'toggle', $index

onKeydown = (e) ->
  if e.key == 'Enter' || e.key == ' '
    e.preventDefault()
    µemit 'toggle', $index
</script>

{if $daily}
<div class="forecast-item" @class{$isActive}="active" data-testid="forecast-item" tabindex="0" role="button" aria-label={'View detailed forecast for '+ WeatherUtils.formatDate($daily.time[$index])} @click={onClick()} @keydown={onKeydown(e)}>
  <div class="forecast-item__day">{WeatherUtils.formatDate($daily.time[$index])}</div>
  <div class="forecast-item__icon">{WeatherUtils.getWeatherIcon($daily.weather_code[$index])}</div>
  <div class="forecast-item__info">
    <div class="forecast-item__condition">{WeatherUtils.getWeatherDescription($daily.weather_code[$index])}</div>
    <div class="forecast-item__temps" data-testid="forecast-temps">
      <span class="forecast-item__high" data-testid="forecast-high">{WeatherUtils.formatTemperature($daily.temperature_2m_max[$index])}</span>
      <span class="forecast-item__low" data-testid="forecast-low">{WeatherUtils.formatTemperature($daily.temperature_2m_min[$index])}</span>
    </div>
  </div>
  {if $isActive}
    <div class="forecast-item__details">
      <div class="forecast-detail-item">
        <div class="forecast-detail-item__label">Sunrise</div>
        <div class="forecast-detail-item__value">{WeatherUtils.formatTime($daily.sunrise[$index])}</div>
      </div>
      <div class="forecast-detail-item">
        <div class="forecast-detail-item__label">Sunset</div>
        <div class="forecast-detail-item__value">{WeatherUtils.formatTime($daily.sunset[$index])}</div>
      </div>
      <div class="forecast-detail-item">
        <div class="forecast-detail-item__label">Rain</div>
        <div class="forecast-detail-item__value">{$daily.rain_sum[$index].toFixed(1)} mm</div>
      </div>
      <div class="forecast-detail-item">
        <div class="forecast-detail-item__label">UV Index</div>
        <div class="forecast-detail-item__value">{$daily.uv_index_max[$index].toFixed(1)}</div>
      </div>
      <div class="forecast-detail-item">
        <div class="forecast-detail-item__label">Precipitation</div>
        <div class="forecast-detail-item__value">{WeatherUtils.formatPercentage($daily.precipitation_probability_max[$index])}</div>
      </div>
      <div class="forecast-detail-item">
        <div class="forecast-detail-item__label">Temperature</div>
        <div class="forecast-detail-item__value">{WeatherUtils.formatTemperature($daily.temperature_2m_min[$index])} to {WeatherUtils.formatTemperature($daily.temperature_2m_max[$index])}</div>
      </div>
    </div>
  {end}
</div>
{end}

<style @display="contents">
</style>
