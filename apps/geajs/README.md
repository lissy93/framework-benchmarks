# Weather App — Gea

A weather application built with [Gea](https://geajs.com/) — a compiler-first reactive UI framework that compiles JSX into surgical DOM updates at build time (a hello-world app ships ~121 B of brotli JavaScript).

## Usage

```bash
# Install dependencies
npm install

# Dev server (Vite + @geajs/vite-plugin)
npm run dev

# Production build
npm run build

# Run tests (from repo root)
npm run test:geajs

# Lint (from repo root)
npm run lint:geajs
```

## Implementation

Gea doesn't use signals, hooks, dependency arrays, or a virtual DOM. You write ordinary JavaScript — classes with state and methods, getters for computed values — and the Vite plugin (`@geajs/vite-plugin`) analyzes the JSX at build time, works out which DOM nodes depend on which state paths, and generates the reactive wiring. At runtime only the affected nodes are patched.

The implementation uses:

- **`Store`** — [`weather-store.js`](src/weather-store.js) is a singleton class extending `Store`. Its fields (`searchQuery`, `isLoading`, `hasError`, `weatherData`, `activeForecastIndex`) are made reactive through a deep Proxy; mutations are plain assignments like `this.isLoading = true`.
- **Getters as computed values** — derived state such as `showContent`, `locationLabel`, `currentTemperature`, and `forecastDays` are ordinary JavaScript getters on the store. The compiler tracks which state paths they read and re-evaluates the dependent DOM bindings when those paths change.
- **Class components** — each UI piece ([`SearchForm`](src/components/SearchForm.jsx), [`CurrentWeather`](src/components/CurrentWeather.jsx), [`ForecastItem`](src/components/ForecastItem.jsx), …) extends `Component` and returns JSX from `template()`. JSX uses HTML-style attributes (`class`, `for`) and native-style event bindings (`click={...}`, `input={...}`, `submit={...}`) wired through document-level event delegation.
- **Function components** — stateless UI like [`LoadingState`](src/components/LoadingState.jsx) is a plain function; the compiler converts it to a class component at build time.
- **Conditional rendering** — `{condition && <X />}` in [`WeatherDisplay`](src/components/WeatherDisplay.jsx) compiles into `<template>` markers with swap logic, so hidden branches cost no DOM nodes.
- **Keyed lists** — the 7-day forecast maps `weatherStore.forecastDays` to `<ForecastItem key={day.date} day={day} />`; list changes are reconciled per-item rather than re-rendered.

```jsx
// Components read the store singleton directly — mutations patch the DOM surgically
export default class SearchForm extends Component {
  handleSubmit(e) {
    e.preventDefault();
    weatherStore.search();
  }

  template() {
    return (
      <form submit={this.handleSubmit}>
        <input value={weatherStore.searchQuery} input={this.handleInput} />
        <button disabled={weatherStore.isLoading}>
          {weatherStore.isLoading ? 'Loading...' : 'Get Weather'}
        </button>
      </form>
    );
  }
}
```

## About Gea

Gea's runtime and compiler are vertically integrated: JSX becomes HTML string templates, state tracking happens through deep proxies, and the generated `observe()` calls patch only the DOM nodes that depend on changed data — no diffing or reconciliation overhead. The framework can also run [without a build step](https://geajs.com/docs/browser-usage.html) from a CDN global (~4.1 kB gzipped), where the reactivity glue is written by hand instead of the compiler.

- 🌐 Website: [geajs.com](https://geajs.com/)
- 📚 Docs: [geajs.com/docs](https://geajs.com/docs/getting-started.html)
- 🐙 GitHub: [dashersw/gea](https://github.com/dashersw/gea)
- 📦 npm: [`@geajs/core`](https://www.npmjs.com/package/@geajs/core)
