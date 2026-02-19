

import { test, expect } from '@playwright/test';

test.describe('Acciones con elementos', () => {

  test('click en un elemento', async ({ page }) => {

    await test.step("Paso 1 Navegación a Demoqa", async () => {
      await page.goto('https://demoqa.com/');
      await page.locator('.close-button').click();
      await page.getByRole('link', { name: 'Elements' }).click();
      // await page.locator('iframe[title="3rd party ad content"]').contentFrame().getByRole('button', { name: 'Close ad' }).click();
      await page.getByRole('link', { name: 'Text Box' }).click();
      console.log("Url correcta");
    });

    await test.step("Paso 2 Rellenar campos de texto", async () => {
    await page.getByRole('textbox', { name: 'Full Name' }).fill('Enrique');
    await page.getByRole('textbox', { name: 'name@example.com' }).fill('enrique@demoqa.com');
    await page.getByRole('textbox', { name: 'Current Address' }).fill('Calle 123, Ciudad Ejemplo');
    await page.locator('#permanentAddress').fill('Calle 456, Ciudad Permanente');
    console.log("Campos rellenados correctamente");
    });
    
    await test.step("Paso 3 Enviar", async () => {
    await page.locator('#submit').click();
    console.log("Envío correcto");
    });

    await test.step("Paso 4 Validar campos rellenados", async () => {
    await expect(page.locator('#userName')).toHaveValue('Enrique');
    await expect(page.locator('#userEmail')).toHaveValue('enrique@demoqa.com');
    // await expect(page.locator('#currentAddress')).toHaveValue('Calle 123, Ciudad Ejemplo');
    // await expect(page.locator('#permanentAddress')).toHaveValue('Calle 456, Ciudad Permanente');
    console.log("Validación de campos correcta");
    });

    console.log("Acciones con formularios correctas");
  });

});

// npx playwright test tests/test07-Acciones2.spec.ts --headed
