import { test } from '@playwright/test';

test.describe('Navegación', () => {

  test('Navegar a la página de inicio', async ({ page }) => {

    await test.step("Paso 1", async () => {
      await page.goto('https://www.sportium.es/');
    });

    await test.step("Paso 2", async () => {
      await page.getByRole('button', { name: 'Aceptar' }).click();
    });

    await test.step("Paso 3", async () => {
      await page.getByRole('link', { name: 'Apuestas' }).first().click();
    });

    await test.step("Paso 4", async () => {
      await page.getByRole('button', { name: '🏆 Copa del Rey' }).click();
    });

    await test.step("Paso 5", async () => {

      await page.getByRole('button', { name: 'Fútbol Fútbol' }).first().click();
    });

  });

});



// npx playwright test tests/test03-navegacion.spec.ts --headed
