/**
 * Test de course : une recherche lancée puis aussitôt remplacée par une autre ne doit jamais
 * laisser la réponse la plus LENTE écraser la plus RÉCENTE — ni à l'affichage, ni dans le
 * localStorage persisté. Le géocodage mock (weather-service.module.civet, @useMockData) est
 * local et synchrone (aucune requête réseau) ; seule la météo (`public/mocks/weather-data.json`,
 * même fichier pour toutes les villes) part en fetch — on retarde SA PREMIÈRE réponse.
 * ESM (pas require) : apps/mjs/package.json porte "type": "module". Import de `@playwright/test`
 * par chemin relatif explicite vers la copie RACINE (cf. commentaire de playwright.race.config.js
 * à côté) — apps/mjs/ a sa propre copie, incompatible avec le cache navigateurs de ce bac à sable.
 */
import { test, expect } from '../../../node_modules/@playwright/test/index.mjs';

test.describe('Weather App (mjs) — course de recherches successives', () => {
  test('la réponse tardive de la 1ʳᵉ recherche (London) n\'écrase pas la 2ᵉ (Paris), ni à l\'écran ni dans le localStorage', async({ page }) => {
    // le chargement initial (µmount, ville par défaut 'London' en mode mock) fait DÉJÀ un
    // premier fetch vers ce même fichier — la route n'est posée qu'APRÈS, pour que le fetch
    // retardé soit bien celui de la recherche "London" explicite ci-dessous, pas celui du mount.
    await page.goto('/?mock=true');
    await expect(page.locator('[data-testid="current-weather"]')).toBeVisible();

    let premiereReponse = true;
    await page.route('**/public/mocks/weather-data.json', async(route) => {
      if (premiereReponse) {
        premiereReponse = false;
        await new Promise((r) => setTimeout(r, 1500));
      }
      await route.continue();
    });

    const searchInput = page.locator('[data-testid="search-input"]');
    const searchForm   = page.locator('[data-testid="search-form"]');

    // form.requestSubmit() plutôt que le clic sur le bouton : le bouton se DÉSACTIVE pendant
    // le chargement (disabled={$isLoading} côté search-form) — un clic Playwright attend alors
    // la réactivation, ce qui SÉRIALISE les deux recherches et masque la course qu'on veut
    // précisément vérifier. requestSubmit() déclenche le même @submit.prevent que le bouton,
    // sans passer par son état disabled — une 2ᵉ recherche pendant que la 1ʳᵉ charge encore
    // reste un cas réel (frappe rapide, Entrée, saisie tactile).
    await searchInput.fill('London');
    await searchForm.evaluate((f) => f.requestSubmit());

    await searchInput.fill('Paris');
    await searchForm.evaluate((f) => f.requestSubmit());

    // Paris (rapide) doit s'afficher sans attendre les 1500 ms de London
    await expect(page.locator('[data-testid="current-location"]')).toContainText('Paris', { timeout: 5000 });

    // 2 s plus tard, London (tardive) a eu le temps de se résoudre : l'affichage ne doit pas bouger
    await page.waitForTimeout(2000);
    await expect(page.locator('[data-testid="current-location"]')).toContainText('Paris');

    const savedLocation = await page.evaluate(() => {
      for (let i = 0; i < localStorage.length; i++) {
        const cle = localStorage.key(i);
        if (cle && cle.endsWith(':savedLocation')) {return localStorage.getItem(cle);}
      }
      return null;
    });
    expect(savedLocation).toContain('Paris');
  });
});
