<!-- start_header -->
<h1 align="center">🚀 Weather Front - Astro</h1>

<p align="center">
  <img width="64" src="https://raw.githubusercontent.com/lissy93/framework-benchmarks/refs/heads/main/assets/favicon.png" /><br>
  <i>A tiny weather app</i>
  <br>
  <b><a href="/">🚀 Demo</a> ● <a href="https://frontend-framework-benchmarks.as93.net">📊 Results</a></b>
  <br><br>
  <a href="https://astro.build/" target="_blank"><img src="https://img.shields.io/badge/Framework-Astro-BC52EE?logo=astro&logoColor=fff&labelColor=BC52EE" /></a>
  <a href="https://github.com/Lissy93/framework-benchmarks/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-MIT-AE56FF?logo=googledocs&logoColor=fff&labelColor=8A2BE2" /></a>
  <a href="https://github.com/lissy93"><img src="https://img.shields.io/badge/Author-Lissy93-EA4AAA?logo=githubsponsors&logoColor=fff&labelColor=E31591" /></a>
</p>
<!-- end_header -->

<!-- start_about -->

## About

<img align="right" src="/assets/screenshot.png" width="400">

This is a simple weather app, built in [Astro](https://astro.build/) (as well as also [10 other frontend frameworks](/)) in order to review, compare and benchmark frontend web frameworks.

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
| **Test** - Executes all e2e and unit tests | [![Test Status](https://raw.githubusercontent.com/lissy93/framework-benchmarks/refs/heads/badges/test-astro.svg)](https://github.com/lissy93/framework-benchmarks/actions/workflows/test.yml) |
| **Lint** - Verifies code style and quality | [![Lint Status](https://raw.githubusercontent.com/lissy93/framework-benchmarks/refs/heads/badges/lint-astro.svg)](https://github.com/lissy93/framework-benchmarks/actions/workflows/lint.yml) |
| **Build** - Builds and deploys the app | [![Build Status](https://raw.githubusercontent.com/lissy93/framework-benchmarks/refs/heads/badges/build-astro.svg)](https://github.com/lissy93/framework-benchmarks/actions/workflows/build.yml) |

<!-- end_status -->

<!-- start_usage -->

## Usage

First, follow the [repo setup instructions](https://github.com/lissy93/framework-benchmarks?tab=readme-ov-file#usage). Then `cd apps/astro` and use the following commands:

```bash
npm run dev    # Start dev server (astro dev --port 3000)
npm test       # Run tests
npm run lint   # Run lint checks
npm build      # Build for production (astro build)
npm start      # Serve built prod app (from ./dist)
```

For troubleshooting, use `npm run verify` from the root of the project.

<!-- end_usage -->

<!-- start_framework_specific -->
#### Zero JavaScript by Default
Astro renders every `.astro` component to static HTML at build time and ships no runtime. The entire UI shell - header, search form, weather card scaffold, forecast container - arrives as plain markup with no hydration cost.

#### A Single Client Island
The only JavaScript in the bundle comes from one `<script>` tag in [`index.astro`](https://github.com/Lissy93/framework-benchmarks/blob/main/apps/astro/src/pages/index.astro), which imports [`weather-app.js`](https://github.com/Lissy93/framework-benchmarks/blob/main/apps/astro/src/scripts/weather-app.js). Astro bundles and hashes it automatically. All state, fetching and DOM updates live in that one module.

#### Component Props Without a Runtime
Components like [`CurrentWeather.astro`](https://github.com/Lissy93/framework-benchmarks/blob/main/apps/astro/src/components/CurrentWeather.astro) use frontmatter to map over a list of weather detail tiles at build time. The loop runs during the build, not in the browser, so the output is flat HTML.

#### Layout Composition with Slots
[`Layout.astro`](https://github.com/Lissy93/framework-benchmarks/blob/main/apps/astro/src/layouts/Layout.astro) holds the document shell and stylesheet links, and pages compose into it through `<slot />`.

#### Relative Asset Paths for Sub-path Hosting
[`astro.config.mjs`](https://github.com/Lissy93/framework-benchmarks/blob/main/apps/astro/astro.config.mjs) sets `build.assetsPrefix: '.'` so the emitted `_astro/` URLs stay relative. This lets the same build work at the site root and when served under `/astro/app/` by the benchmark server.
<!-- end_framework_specific -->

<!-- start_real_world_app -->

## Real-World App
Since the weather app is very simple, it may be helpful to see a more practical implementation of a Astro app. So, checkout:

<a href="https://github.com/Lissy93/awesome-privacy"><img align="left" src="https://pixelflare.cc/alicia/logo/awesome-privacy/w256" width="96"></a>

> **Awesome Privacy** - _A curated list of privacy-respecting software and services_<br>
> 🐙 Get it on GitHub at [github.com/Lissy93/awesome-privacy](https://github.com/Lissy93/awesome-privacy)<br>
> 🌐 View the website at [awesome-privacy.xyz](https://awesome-privacy.xyz/)

<br>
<!-- end_real_world_app -->

<!-- start_license -->

## License

Weather-Front is licensed under [MIT](https://github.com/lissy93/framework-benchmarks/blob/main/LICENSE) © Alicia Sykes 2025.<br>
View [Attributions](https://github.com/lissy93/framework-benchmarks?tab=readme-ov-file#attributions) for credits, thanks and contributors.

<!-- end_license -->