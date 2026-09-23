<script>
$weatherData = null
$activeIndex = null

$days = $weatherData?.daily?.time?.slice(0, 7) ?? []

onToggle = (e) ->
  $activeIndex = $activeIndex == e.data ? null : e.data

µeffect ->
  $weatherData
  $activeIndex = null
</script>

{if $weatherData}
<section class="forecast-section">
  <h2 class="section-title">7-Day Forecast</h2>
  <div class="forecast">
    <div class="forecast__list" data-testid="forecast-list">
      {for i, day in $days}
        <@forecast-item @lightDom daily={$weatherData.daily} index={i} isActive={$activeIndex == i} @toggle={onToggle(e)}>
        </@forecast-item>
      {end}
    </div>
  </div>
</section>
{end}

<style @display="contents">
</style>
