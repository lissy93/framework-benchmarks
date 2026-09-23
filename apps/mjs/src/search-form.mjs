<script>
$value = ''
$isLoading = false

onSubmit = ->
  city = $value?.trim()
  if !city
    return
  µemit 'search'
</script>

<section class="search-section">
  <form class="search-form" data-testid="search-form" @submit.prevent={onSubmit()} @noUJS>
    <div class="search-form__group">
      <label for="location-input" class="sr-only">Enter city name</label>
      <input type="text" id="location-input" class="search-input" placeholder="Enter city name..." data-testid="search-input" autocomplete="off" value=!{$value}>
      <button type="submit" class="search-button" data-testid="search-button" disabled={$isLoading}>
        <span class="search-button__text">{$isLoading ? 'Loading...' : 'Get Weather'}</span>
        <span class="search-button__icon">🌦️</span>
      </button>
    </div>
  </form>
</section>

<style @display="contents">
</style>
