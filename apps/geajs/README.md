<!-- start_header -->
<h1 align="center">🌍 Weather Front - Gea.js</h1>

<p align="center">
  <img width="64" src="https://raw.githubusercontent.com/lissy93/framework-benchmarks/refs/heads/main/assets/favicon.png" /><br>
  <i>A tiny weather app</i>
  <br>
  <b><a href="/">🚀 Demo</a> ● <a href="https://frontend-framework-benchmarks.as93.net">📊 Results</a></b>
  <br><br>
  <a href="https://geajs.com/" target="_blank"><img src="https://img.shields.io/badge/Framework-Gea.js-00e5ff?logo=googleearth&logoColor=fff&labelColor=00e5ff" /></a>
  <a href="https://github.com/Lissy93/framework-benchmarks/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-MIT-AE56FF?logo=googledocs&logoColor=fff&labelColor=8A2BE2" /></a>
  <a href="https://github.com/lissy93"><img src="https://img.shields.io/badge/Author-Lissy93-EA4AAA?logo=githubsponsors&logoColor=fff&labelColor=E31591" /></a>
</p>
<!-- end_header -->

<!-- start_about -->

## About

<img align="right" src="/assets/screenshot.png" width="400">

This is a simple weather app, built in [Gea.js](https://geajs.com/) (as well as also [10 other frontend frameworks](/)) in order to review, compare and benchmark frontend web frameworks.

- 🌦️ Live weather conditions
- 📅 7-day weather forecast
- 🔍 City search functionality
- 📍 Geolocation support
- 💾 Persistent location storage
- 📱 Responsive design
- ♿ Accessible interface
- 🎨 Multi-theme support
- 🧪 Fully unit tested
- 🌐 Internationalized

<!-- end_about -->

<!-- start_status -->

## Status

| Task | Status |
|---|---|
| **Test** - Executes all e2e and unit tests | [![Test Status](https://raw.githubusercontent.com/lissy93/framework-benchmarks/refs/heads/badges/test-geajs.svg)](https://github.com/lissy93/framework-benchmarks/actions/workflows/test.yml) |
| **Lint** - Verifies code style and quality | [![Lint Status](https://raw.githubusercontent.com/lissy93/framework-benchmarks/refs/heads/badges/lint-geajs.svg)](https://github.com/lissy93/framework-benchmarks/actions/workflows/lint.yml) |
| **Build** - Builds and deploys the app | [![Build Status](https://raw.githubusercontent.com/lissy93/framework-benchmarks/refs/heads/badges/build-geajs.svg)](https://github.com/lissy93/framework-benchmarks/actions/workflows/build.yml) |

<!-- end_status -->

<!-- start_usage -->

## Usage

First, follow the [repo setup instructions](https://github.com/lissy93/framework-benchmarks?tab=readme-ov-file#usage). Then `cd apps/geajs` and use the following commands:

```bash
npm run dev    # Start dev server (vite --port 3000)
npm test       # Run tests
npm run lint   # Run lint checks
npm build      # Build for production (vite build)
npm start      # Serve built prod app (from ./dist)
```

For troubleshooting, use `npm run verify` from the root of the project.

<!-- end_usage -->

<!-- start_framework_specific -->
#### Compiler-Wired Reactivity
Gea doesn't use signals, hooks, dependency arrays, or a virtual DOM. Components are ordinary JavaScript — classes with state and methods, getters for computed values — and [`@geajs/vite-plugin`](https://www.npmjs.com/package/@geajs/vite-plugin) analyses the JSX at build time, works out which DOM nodes depend on which state paths, and generates the reactive wiring. At runtime only the affected nodes are patched.

#### A Proxy-Based Store
[`weather-store.js`](https://github.com/Lissy93/framework-benchmarks/blob/main/apps/geajs/src/weather-store.js) is a singleton class extending `Store`. Its fields (`searchQuery`, `isLoading`, `hasError`, `weatherData`, `activeForecastIndex`) are made reactive through a deep Proxy, so mutations are plain assignments like `this.isLoading = true`.

#### Getters as Computed Values
Derived state such as `showContent`, `locationLabel`, `currentTemperature` and `forecastDays` are ordinary JavaScript getters on the store. The compiler tracks which state paths each getter reads and re-evaluates the dependent DOM bindings when those paths change.

#### Class and Function Components
Each UI piece, like [`SearchForm.jsx`](https://github.com/Lissy93/framework-benchmarks/blob/main/apps/geajs/src/components/SearchForm.jsx) and [`CurrentWeather.jsx`](https://github.com/Lissy93/framework-benchmarks/blob/main/apps/geajs/src/components/CurrentWeather.jsx), extends `Component` and returns JSX from `template()`, using HTML-style attributes (`class`, `for`) and native-style event bindings (`click={...}`, `submit={...}`) wired through document-level event delegation. Stateless UI like [`LoadingState.jsx`](https://github.com/Lissy93/framework-benchmarks/blob/main/apps/geajs/src/components/LoadingState.jsx) is a plain function which the compiler converts to a class component at build time.

#### Conditional Rendering and Keyed Lists
`{condition && <X />}` in [`WeatherDisplay.jsx`](https://github.com/Lissy93/framework-benchmarks/blob/main/apps/geajs/src/components/WeatherDisplay.jsx) compiles into `<template>` markers with swap logic, so hidden branches cost no DOM nodes. The 7-day forecast in [`Forecast.jsx`](https://github.com/Lissy93/framework-benchmarks/blob/main/apps/geajs/src/components/Forecast.jsx) maps `weatherStore.forecastDays` to `<ForecastItem key={day.date} day={day} />`, and list changes are reconciled per-item rather than re-rendered.
<!-- end_framework_specific -->

## About Gea
<!-- start_framework_description -->
Gea is a compiler-first reactive UI framework whose runtime and compiler are vertically integrated: JSX becomes HTML string templates, state tracking happens through deep proxies, and the generated `observe()` calls patch only the DOM nodes that depend on changed data — no diffing or reconciliation overhead. It can also run [without a build step](https://geajs.com/docs/browser-usage.html) from a CDN global (~4.1 kB gzipped), where the reactivity glue is written by hand instead of by the compiler.

<!-- end_framework_description -->

<!-- start_license -->

## License

Weather-Front is licensed under [MIT](https://github.com/lissy93/framework-benchmarks/blob/main/LICENSE) © Alicia Sykes 2025.<br>
View [Attributions](https://github.com/lissy93/framework-benchmarks?tab=readme-ov-file#attributions) for credits, thanks and contributors.

<!-- end_license -->
