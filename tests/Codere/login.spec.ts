import { test, expect } from '@playwright/test';
// import { title } from 'node:process';



// variables:
const codere = "https://www.codere.es"
const title = "Apuestas Deportivas y Casino » Bono hasta 200€ | Codere®"
const title2 = "Las mejores Apuestas en Vivo de toda España | Codere®"
const account = "asd"
const pass = "asddd"


test.describe('Navegando a codere', () => {

  test('Test 01', async ({ page }) => {

    await test.step("Paso 1 Navegación a Codere", async () => {
      await page.goto(codere);
      await expect(page).toHaveTitle(title);
      console.log("Navegando a Codere");
    });

    await test.step("Paso 2 Aceptar coockies", async () => {
      await page.getByRole('button', { name: 'Aceptar' }).click();
      console.log("Aceptando coockies");
    });

    await test.step("Paso 3 Iniciar sesión", async () => {
      await page.getByRole('button', { name: 'Acceder' }).click();
      await expect(page).toHaveTitle(title2);
      console.log("Iniciando sesión");
    });

    await test.step("Paso 4 Introducir credenciales", async () => {
      await page.getByRole('textbox', { name: 'Usuario / Correo electrónico' }).fill(account);
      await page.getByRole('textbox', { name: 'Contraseña' }).fill(pass);
      await page.locator('#btnaccess').getByRole('button', { name: 'Acceder' }).click();
      console.log("Introduciendo credenciales");
    });

  });

});
