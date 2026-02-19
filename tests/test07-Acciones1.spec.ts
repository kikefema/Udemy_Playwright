

import { test, expect } from '@playwright/test';

test.describe('Acciones con elementos', () => {

  test('click en un elemento', async ({ page }) => {

    await test.step("Paso 1 Navegación a Demoqa", async () => {
      await page.goto('https://demoqa.com/');
      await page.locator('.close-button').click();
      await page.getByRole('link', { name: 'Elements' }).click();
      // await page.locator('iframe[title="3rd party ad content"]').contentFrame().getByRole('button', { name: 'Close ad' }).click();
      await page.getByRole('link', { name: 'Buttons' }).click();
      console.log("Url correcta");
    });

    await test.step("Paso 2 Realizar acciones con los elementos", async () => {
    await page.locator('#doubleClickBtn').dblclick();
    console.log("Doble click correcto");
    });
    
    await test.step("Paso 3 Realizar click derecho y click normal", async () => {
    await page.locator('#rightClickBtn').click({ button: 'right' });
    console.log("Click derecho correcto");
    });

    await test.step("Paso 4 Realizar click normal", async () => {
    await page.getByRole('button', { name: 'Click Me', exact: true }).click();
    // await page.locator('button:has-text("Click Me")').click();
    console.log("Click normal correcto");
    });

    await test.step("Paso 5 Validar los mensajes de las acciones", async () => {
    await expect(page.locator('#doubleClickMessage')).toHaveText('You have done a double click');
    console.log("Validación de mensaje doble click correcta");
    await expect(page.locator('#rightClickMessage')).toHaveText('You have done a right click');
    console.log("Validación de mensaje click derecho correcta");
    await expect(page.locator('#dynamicClickMessage')).toHaveText('You have done a dynamic click');
    console.log("Validación de mensaje click normal correcta");
    });

    console.log("Acciones con elementos correctas");
  });

});

// npx playwright test tests/test07.spec.ts --headed
