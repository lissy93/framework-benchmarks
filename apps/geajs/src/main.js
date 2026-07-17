import App from './app.jsx';
import weatherStore from './weather-store.js';

// Mount the root component, then kick off the initial weather load
const app = new App();
app.render(document.getElementById('app'));

weatherStore.init();
