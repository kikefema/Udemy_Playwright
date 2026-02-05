import { test, Browser, Page} from "@playwright/test";

(async () => {
    let browser = Browser;
    let page = Page;

    test.describe('Navegación', () => {
        test('Navegar a la página de inicio', async () => {
            await test.step("Paso 1", async () => {
                page.goto('https://www.sportium.es/');
            });

            await test.step("Paso 2", async () => {
                await page.getByRole('button', { name: 'Aceptar' }).click();
            });

            await test.step("Paso 3", async () => {
                await page.getByRole('link', { name: 'Apuestas' }).first().click();
            });

            await test.step("Paso 4", async () => {
                await page.getByRole('button', { name: '🏆 Champions League' }).click();
            });

            await test.step("Paso 5", async () => {
                await page.getByRole('button', { name: 'FC Barcelona FC Copenhague' }).click();
            });
}}));


// tal y como esta definido el test, no se ejecutará correctamente, ya que no se ha inicializado ni el navegador ni la página. 
// Para que funcione, deberíamos usar el contexto de Playwright para obtener acceso a la página y al navegador, o inicializarlos 
// correctamente antes de ejecutar los pasos del test.

// la ejecución buena del test ese el test03-navegacion.spec.ts, que si esta correctamente definido y se ejecutará sin problemas.

