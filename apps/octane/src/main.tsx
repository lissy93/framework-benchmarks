import { createRoot } from 'octane';
import App from './App.tsx';

const target = document.getElementById('root');
if (!target) {throw new Error('Missing #root mount target');}

createRoot(target).render(App);
