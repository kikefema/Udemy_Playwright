import { test } from "@playwright/test";

test('has title', async ({ page }) => {
await page.goto('https://www.sportium.es/');
await page.getByRole('button', { name: 'Aceptar' }).click();
await page.getByRole('link', { name: 'Apuestas' }).first().click();
await page.getByRole('button', { name: '🏆 Champions League' }).click();
await page.getByRole('button', { name: 'FC Barcelona FC Copenhague' }).click();
await page.getByRole('button', { name: 'FC Barcelona 1.125' }).click();
await page.getByRole('main').getByRole('textbox').click();
await page.getByRole('main').getByRole('textbox').fill('10');
await page.getByRole('main').getByRole('textbox').press('Enter');
await page.getByRole('button', { name: 'Entrar y realizar apuesta' }).click();  // This is a placeholder test
});

// npx playwright test tests/test01.spec.ts --headed

