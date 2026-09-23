// config dédiée au test de course (race.test.js) : réutilise createConfig('mjs') (même
// baseURL ?mock=true, même webServer npm run dev:mjs) mais restreint testDir à CE dossier —
// isolé des 22 tests partagés (framework-benchmarks/tests/), aucun conflit d'exécution.
// ESM (pas require) : apps/mjs/package.json porte "type": "module".
//
// race.test.js importe `@playwright/test` par un chemin RELATIF explicite (pas le
// spécificateur nu) : apps/mjs/ a SON PROPRE node_modules/@playwright/test (1.63.0,
// installation séparée, browser chromium 1243 introuvable dans le cache de ce bac à sable) —
// différent de celui de la racine framework-benchmarks (1.54.2, chromium 1181, celui que la
// suite de référence des 22 tests utilise déjà). createConfig ci-dessous résout la copie
// RACINE (le fichier importé vit hors de apps/mjs/) ; le chemin relatif de race.test.js pointe
// vers la MÊME instance — sans ça, Playwright charge deux instances du module et refuse
// ("Requiring @playwright/test second time").
import { createConfig } from '../../../tests/config/playwright.config.base.js';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ici    = dirname(fileURLToPath(import.meta.url));
const racine = join(ici, '..', '..', '..'); // framework-benchmarks/ : "dev:mjs" y est défini
const base   = createConfig('mjs');

// Playwright lance webServer.command depuis le dossier de CE fichier de config par défaut —
// "dev:mjs" n'existe que dans le package.json racine de framework-benchmarks, d'où le cwd
// explicite.
export default { ...base, testDir: ici, webServer: { ...base.webServer, cwd: racine } };
