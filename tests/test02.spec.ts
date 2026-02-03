import { test } from "@playwright/test";

test('has title', async ({ page }) => {

await page.goto('https://demoqa.com/');
await page.getByRole('img').nth(3).click();
await page.getByText('Text Box').click();
await page.getByRole('textbox', { name: 'Full Name' }).click();
await page.getByRole('textbox', { name: 'Full Name' }).fill('Kike');
await page.getByRole('textbox', { name: 'name@example.com' }).click();
await page.getByRole('textbox', { name: 'name@example.com' }).fill('asd@asd.com');
await page.getByRole('textbox', { name: 'Current Address' }).click();
await page.getByRole('textbox', { name: 'Current Address' }).fill('calle lerele 85 1º2º');
await page.locator('#permanentAddress').click();
await page.locator('#permanentAddress').fill('calle lorolo 2º1º');
await page.getByRole('button', { name: 'Submit' }).click();
// await page.getByText('Name:Kike').click();
// await page.getByText('Email:asd@asd.com').click();
// await page.getByText('Current Address :calle lerele').click();
// await page.getByText('Permananet Address :calle').click();

});  // This is a placeholder test