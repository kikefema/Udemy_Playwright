
// ESTE ES EL MISMO TEST QUE EL ANTERIOR PERO CON ASSERTIONS AÑADIDOS PARA VALIDAR QUE LA NAVEGACIÓN SE REALIZÓ CORRECTAMENTE. 
// LOS ASSERTIONS VERIFICAN QUE EL TÍTULO DE LA PÁGINA O ALGÚN ELEMENTO ESPECÍFICO ESTÉ PRESENTE DESPUÉS DE CADA NAVEGACIÓN.

import { test, expect } from '@playwright/test';

test.describe('Assertions', () => {

  test('Assertion positiva', async ({ page }) => {

    await test.step("Paso 1 Navegación a Elements", async () => {
      await page.goto('https://demoqa.com/');
      await page.getByRole('link', { name: 'Elements' }).click();
      await page.getByRole('link', { name: 'Text Box' }).click();
      await expect(page.getByRole('heading', { name: /text box/i })).toBeVisible();// Validación de que el título "Text Box" es visible
      console.log("El título 'Text Box' es visible, validación positiva correcta"); 
    });
  });

  test('Assertion negativa', async ({ page }) => {

    await test.step("Paso 1 Navegación a Forms", async () => {
      await page.goto('https://demoqa.com/');
      await page.getByRole('link', { name: 'Forms' }).click();
      await page.getByRole('link', { name: 'Practice Form' }).click();
      await expect(page.getByRole('heading', { name: /formularios de práctica/i })).not.toBeVisible();// Validación NEGATIVA de que el título "Formularios de práctica" NO es visible
      console.log("El título 'Formularios de práctica' no es visible, validación negativa correcta");
    });
  });


    test('Assertion erronea con mensaje aclarador', async ({ page }) => {

    await test.step("Paso 1 Navegación a Alerts", async () => {
      await page.goto('https://demoqa.com/');
      await page.getByRole('link', { name: 'Alerts, Frame & Windows' }).click();
      await page.getByRole('link', { name: 'Alerts' }).click();
      await expect(page.getByRole('heading', { name: /alertas/i }), "La assertion falló xq somos unos mendrugos").toBeVisible();// Validación NEGATIVA de que el título "Formularios de práctica" NO es visible
      console.log("La assertion se ejecutó, pero el título 'Alertas' no es visible, validación con mensaje aclarador correcta");
    });
  });

      test('Validación de textbox visible y llenado', async ({ page }) => {

    await test.step("Paso 1 Navegación a Forms", async () => {
      await page.goto('https://demoqa.com/');
      await page.getByRole('link', { name: 'Forms' }).click();
      await page.getByRole('link', { name: 'Practice Form' }).click();
      await expect(page.getByRole('textbox', { name: /first name/i }), "El textbox 'First Name' no es visible").toBeVisible();// Validación de que el textbox "First Name" es visible
      await page.getByRole('textbox', { name: /first name/i }).fill("Juan");// Si el textbox es visible, se llena con el nombre "Juan"
      await expect(page.getByRole('textbox', { name: /first name/i }), "El textbox 'First Name' no se llenó correctamente").toHaveValue("Juan");// Validación de que el textbox "First Name" se llenó correctamente con el valor "Juan"
      console.log("El textbox 'First Name' es visible y se llenó correctamente");
    });
  });

      test('Validación en dropdowns', async ({ page }) => {

    await test.step("Paso 1 Navegación a Forms", async () => {
      await page.goto('https://demoqa.com/');
      await page.getByRole('link', { name: 'Forms' }).click();
      await page.getByRole('link', { name: 'Practice Form' }).click();

      // Aqui hacemos una validación muy fragil, ya que el selector se basa en el texto visible "Select State" y asume que es el tercer elemento con ese texto, lo cual puede cambiar si la página se actualiza. Sin embargo, para fines de este ejercicio, lo dejamos así.
      
      await expect(page.locator('div').filter({ hasText: /^Select State$/ }).nth(2), "El dropdown 'Select State' no es visible").toBeVisible();
      await page.locator('div').filter({ hasText: /^Select State$/ }).nth(2).click();
      await expect(page.getByRole('option', { name: 'NCR' }), "La opción 'NCR' no es visible en el dropdown 'Select State'").toBeVisible();
      await expect(page.getByRole('option', { name: 'Uttar Pradesh' }), "La opción 'Uttar Pradesh' no es visible en el dropdown 'Select State'").toBeVisible();
      await expect(page.getByRole('option', { name: 'Haryana' }), "La opción 'Haryana' no es visible en el dropdown 'Select State'").toBeVisible();
      await expect(page.getByRole('option', { name: 'Rajasthan' }), "La opción 'Rajasthan' no es visible en el dropdown 'Select State'").toBeVisible();
      await page.getByRole('option', { name: 'Haryana' }).click();

      // Ahora vamos a hacer una validación más robusta:
      
      await expect(page.getByText('Select City', { exact: true }),"El dropdown 'Select City' no es visible").toBeVisible();
      await page.locator('#city').click();
      await expect(page.getByText('Karnal'),"La opción 'Karnal' no es visible en el dropdown 'Select City'").toBeVisible();
      await expect(  page.getByText('Panipat'),"La opción 'Panipat' no es visible en el dropdown 'Select City'").toBeVisible();
      await page.getByText('Panipat').click();
    });
  });
});




