<script>
$weatherData = null
</script>

<div class="weather-content" data-testid="weather-content">
  <div class="weather-layout">
    <@current-weather @lightDom weatherData={$weatherData}>
    </@current-weather>
    <@forecast @lightDom weatherData={$weatherData}>
    </@forecast>
  </div>
</div>

<style @display="contents">
</style>
