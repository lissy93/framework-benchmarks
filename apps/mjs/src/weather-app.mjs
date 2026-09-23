<script>
@import WeatherService 'lib/weather-service.module.civet'

$city          = ''
$savedLocation = ''
@persist $savedLocation

$request   = null
$isLoading = false


service = new WeatherService()


track = (promise, name)->
  $request   = promise
  $isLoading = true
  settle = (city)->
    return unless $request == promise
    $isLoading = false
    return unless city
    $city          = city
    $savedLocation = city
  promise.then(-> settle(name)).catch -> settle()
  promise

search = (name)-> track(service.getWeatherByCity(name), name)


µmount ->
  return search($savedLocation) if $savedLocation
  return search('London') if service.useMockData
  promise = null
  try
    promise = track(service.getCurrentLocationWeather())
    await promise
    $city = 'Current Location' if $request == promise
  catch
    search('London') if $request == promise
</script>

<header class="header">
  <div class="container">
    <h1 class="header__title">Weather Front</h1>
  </div>
</header>

<main class="main">
  <div class="container">
    <@search-form @lightDom value=!{$city} isLoading={$isLoading} @search={search($city)}>
    </@search-form>

    <div class="weather-container" data-testid="weather-container">
      {await $request}
        <@loading-state @lightDom>
        </@loading-state>
      {success data}
        <@weather-content @lightDom weatherData={µraw(data)}>
        </@weather-content>
      {error err}
        <@error-state @lightDom message={err.message}>
        </@error-state>
      {end}
    </div>
  </div>
</main>

<footer class="footer">
  <div class="container">
    <p class="footer__text">Built with ModularJS • MIT License • <a href="https://github.com/Lissy93" class="footer__link" target="_blank" rel="noopener">Alicia Sykes</a></p>
  </div>
</footer>

<style @display="contents">
</style>
