// test para valdiar elementos web



import { test, expect } from '@playwright/test';

test.describe('Navegación', () => {

  test('Navegar a la página de inicio', async ({ page }) => {

    await test.step("Paso 1 Navegación a Sportium", async () => {
      await page.goto('https://demoqa.com/');
      console.log("Url Demoqa correcta");
    });

     await test.step("Paso 2 Navegación por los elementos", async () => {
        await page.locator('path').first().click();
        await page.getByText('Text Box').click();
        await page.getByText('Check Box').click();
        await page.getByText('Radio Button').click();
        await page.getByText('Web Tables').click();
        await page.getByText('Buttons').click();
        await page.getByText('Links', { exact: true }).click();
        await page.getByText('Broken Links - Images').click();
        await page.getByText('Upload and Download').click();
        await page.getByText('Dynamic Properties').click();
        console.log("validacion de elementos correcta");
     });

     await test.step("Paso 3 Navegación por los Forms", async () => {
        await page.getByText('Forms').click();
        await page.getByText('Practice Form').click();
        console.log("validacion de Forms correcta");
     });

        await test.step("Paso 4 Navegación por los Alerts, Frame & Windows", async () => {
        await page.getByText('Alerts, Frame & Windows').click();
        await page.getByText('Browser Windows').click();
        await page.getByText('Alerts', { exact: true }).click();
        await page.getByText('Frames', { exact: true }).click();
        await page.getByText('Nested Frames').click();
        await page.getByText('Modal Dialogs').click();
        console.log("validacion de Alerts, Frame & Windows correcta");
     });

        await test.step("Paso 5 Navegación por los Widgets", async () => {
        await page.getByText('Widgets').click();
        await page.getByText('Accordian').click();
        await page.getByText('Auto Complete').click();
        await page.getByText('Date Picker').click();
        await page.getByText('Slider').click();
        await page.getByText('Progress Bar').click();
        await page.getByText('Tabs').click();
        await page.getByText('Tool Tips').click();
        await page.getByText('Menu').click();
        console.log("validacion de Widgets correcta");
        });

        await test.step("Paso 6 Navegación por los Interactions", async () => {
        await page.getByText('Interactions').click();
        await page.getByText('Sortable').click();
        await page.getByText('Selectable').click();
        await page.getByText('Resizable').click();
        await page.getByText('Droppable').click();
        await page.getByText('Dragabble').click();
        console.log("validacion de Interactions correcta");
        });

        await test.step("Paso 7 Navegación por los Book Store Application", async () => {
        await page.getByText('Book Store Application').click();
        await page.getByText('Login').click();
        await page.getByText('Book Store').click();
        await page.getByText('Profile').click();
        console.log("validacion de Book Store Application correcta");
        });
    });
   });


// npx playwright test tests/test05-validacion2.spec.ts --headed


