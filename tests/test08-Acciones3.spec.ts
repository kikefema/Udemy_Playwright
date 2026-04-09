import { test, expect } from '@playwright/test';

test.describe('Acciones con elementos', () => {

  test('Validación 1', async ({ page }) => {

    await test.step("Paso 1 Navegación a Elements", async () => {
      await page.goto('https://demoqa.com/');
      await page.getByRole('link', { name: 'Elements' }).click();
      await page.getByRole('link', { name: 'Text Box' }).click();
      console.log("Navegación a Elements correcta");
    });
  });

    test('Validación 2', async ({ page }) => {

    await test.step("Paso 1 Navegación a Forms", async () => {
      await page.goto('https://demoqa.com/');
      await page.getByRole('link', { name: 'Forms' }).click();
      await page.getByRole('link', { name: 'Practice Form' }).click();
      console.log("Navegación a Forms correcta");
    });
  });


    test('Validación 3', async ({ page }) => {

    await test.step("Paso 1 Navegación a Alerts", async () => {
      await page.goto('https://demoqa.com/');
      await page.getByRole('link', { name: 'Alerts, Frame & Windows' }).click();
      await page.getByRole('link', { name: 'Alerts' }).click();
      console.log("Navegación a Alerts, Frame & Windows correcta");
    });
  });

      test('Validación 4', async ({ page }) => {

    await test.step("Paso 1 Navegación a Widgets", async () => {
      await page.goto('https://demoqa.com/');
      await page.getByRole('link', { name: 'Widgets' }).click();
      await page.getByRole('link', { name: 'Accordian' }).click();
      console.log("Navegación a Widgets correcta");
    });
  });

      test('Validación 5', async ({ page }) => {

    await test.step("Paso 1 Navegación a Interactions", async () => {
      await page.goto('https://demoqa.com/');
      await page.getByRole('link', { name: 'Interactions' }).click();
      await page.getByRole('link', { name: 'Sortable' }).click();
      console.log("Navegación a Interactions correcta");
    });
  });
});

