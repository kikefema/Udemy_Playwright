// ejemplo de shadow DOM

import { test, expect } from '@playwright/test';

test.describe('Shadow DOM', () => {

  test('Navegar a la página de los books', async ({ page }) => {
    await page.goto('https://books-pwakit.appspot.com/');
    console.log("Url correcta");

    await page.locator('book-app #input').fill('Playwright');
    console.log("Busqueda correcta");

    await page.keyboard.press('Enter');
    console.log("Navegación correcta");
  });

});


// npx playwright test tests/test06-specs.ts --headed