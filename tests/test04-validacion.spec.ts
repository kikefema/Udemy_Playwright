// test para realizar la validación de la URL y el título de la página de inicio de Sportium, asegurándonos de que ambos sean correctos.



import { test, expect } from '@playwright/test';

test.describe('Navegación', () => {

  test('Navegar a la página de inicio', async ({ page }) => {

    await test.step("Paso 1 Navegación a Sportium", async () => {
      await page.goto('https://www.sportium.es/');
    });

    await test.step("Paso 2 Validar que la URL sea correcta", async () => {
      await expect(page).toHaveURL('https://www.sportium.es/');
      console.log("validacion de url correcta");
    
      await expect(page).toHaveTitle('Casa de Apuestas Deportivas y Casino Online | Sportium');
      console.log("validacion de titulo correcto");
        
    });

  });

});

// npx playwright test tests/test04-validacion.spec.ts --headed