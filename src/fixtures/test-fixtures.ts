/**
 * =====================================================
 * FIXTURES - Inyección de Page Objects en Tests
 * =====================================================
 * 
 * QUÉ ES UN FIXTURE:
 * - Una función que prepara datos/objetos para tests
 * - Se ejecuta antes de cada test (configuración)
 * - Después limpia (teardown)
 * - Playwright proporciona fixtures automáticos (page, browser, context)
 * - Podemos crear fixtures personalizados con test.extend()
 * 
 * FIXTURE EN PLAYWRIGHT - VENTAJAS:
 * - Alternativa moderna a setUp/beforeEach de otros frameworks
 * - Más flexible y con mejor cleanup automático
 * - Los parámetros del test son los fixtures
 * - Type-safe con TypeScript
 * - Reutilizable en todos los tests
 * 
 * POR QUÉ USAMOS FIXTURES AQUÍ:
 * - Inyectar Page Objects automáticamente
 * - Cada test recibe LoginPage y HomePage listos para usar
 * - No necesita: const loginPage = new LoginPage(page); en cada test
 * - Código más limpio, legible y mantenible
 * - Cambios en Page Objects se aplican automáticamente a todos los tests
 * 
 * PATRÓN DE FIXTURE CON USE:
 * El parámetro "use" es una función que:
 * 1. Marca dónde el test INICIA (todo antes es setup)
 * 2. El test se ejecuta
 * 3. Todo después es cleanup (teardown automático)
 * 
 * VENTAJAS:
 * - Setup: Crear objeto, configurar, esperar
 * - Test: Usa el objeto
 * - Teardown: Automático (cleanup)
 * - Type-safe (TypeScript verifica tipos)
 * - Reutilizable en múltiples tests
 * - Si cambias LoginPage, todos los tests se actualizan
 */

/**
 * IMPORT: test base de Playwright
 * 
 * test es el objeto base de Playwright
 * Se importa como 'base' para no conflictuar con nuestra extensión
 * 
 * USOS:
 * - test('nombre', async () => { }) - Define un test
 * - test.extend<Tipo>() - Crea fixtures personalizados
 * 
 * ACCESO A page AUTOMÁTICO:
 * - Playwright proporciona automáticamente { page }
 * - Acceso al navegador y su contexto
 * - Sin necesidad de crear el navegador nosotros
 */
import { test as base, expect } from '@playwright/test';

/**
 * IMPORT: Page Objects Personalizados
 * 
 * LoginPage:
 * - Todas las acciones relacionadas con login
 * - Selectors del formulario login
 * - Métodos como login(), fillUsername(), clickLoginButton()
 * - Validaciones como isLoginFormVisible(), getErrorMessage()
 * 
 * HomePage:
 * - Todas las acciones del dashboard (después del login)
 * - Métodos como logout(), openUserMenu()
 * - Validaciones como isUserLoggedIn(), isOnLoginPage()
 * 
 * Se importan aquí para crear fixtures que los instancien
 */
import { LoginPage } from '@pages/LoginPage';
import { HomePage } from '@pages/HomePage';

/**
 * TYPE: Pages
 * 
 * Define QUÉ FIXTURES queremos crear y su tipo
 * 
 * ESTRUCTURA:
 * type Pages = {
 *   loginPage: LoginPage;     ← Fixture que retorna LoginPage
 *   homePage: HomePage;       ← Fixture que retorna HomePage
 * }
 * 
 * SIGNIFICA:
 * - Cada test que pida { loginPage } recibirá LoginPage
 * - Cada test que pida { homePage } recibirá HomePage
 * - TypeScript verifica que coincidan
 * 
 * CÓMO SE USA:
 * test('Login', async ({ loginPage }) => {
 *   // loginPage aquí es instancia de LoginPage
 *   await loginPage.login('Admin', 'admin123');
 * });
 * 
 * USO COMBINADO:
 * test('Login y logout', async ({ loginPage, homePage }) => {
 *   // Ambos disponibles
 *   await loginPage.login('Admin', 'admin123');
 *   await homePage.logout();
 * });
 */
type Pages = {
  loginPage: LoginPage;
  homePage: HomePage;
};

/**
 * FIXTURES: Extensión de test base
 * 
 * test = base.extend<Pages>({...})
 * 
 * QUÉ HACE:
 * 1. Toma test base de Playwright
 * 2. Extiende con nuestros fixtures personalizados (Pages)
 * 3. Retorna nuevo 'test' con nuestros fixtures integrados
 * 
 * <Pages>:
 * - Type de los fixtures que vamos a crear
 * - Typescript verifica que coincidan con Pages interface
 * 
 * RETORNO: test
 * - El nuevo objeto test con nuestros fixtures
 * - Esto es lo que se importa en los archivos de test:
 *   import { test } from '@fixtures/test-fixtures'
 * 
 * VS base vs test:
 * - base = test de Playwright sin nuestras extensiones
 * - test = test con nuestros fixtures loginPage y homePage
 * - Es lo que usamos en los .spec.ts files
 * 
 * PATTERN: use
 * - await use(objeto) marca dónde inicia el test
 * - Antes de use() es setup
 * - El test se ejecuta durante use()
 * - Después es cleanup (automático)
 */
export const test = base.extend<Pages>({
  /**
   * FIXTURE: loginPage
   * 
   * Crea una instancia de LoginPage para cada test
   * 
   * SINTAXIS:
   * loginPage: async ({ page }, use) => { ... }
   * 
   * PARÁMETROS:
   * - { page } = fixture automático de Playwright
   *   Es la página del navegador, lo proporciona Playwright
   * - use = función para marcar dónde inicia el test
   *   Todo antes es setup, todo después es cleanup
   * 
   * FLUJO COMPLETO:
   * 1. Playwright crea la página (page)
   * 2. Este fixture recibe esa página
   * 3. Crea: loginPage = new LoginPage(page)
   * 4. Retorna: await use(loginPage)
   * 5. El test comienza (usa loginPage)
   * 6. El test termina
   * 7. Cleanup automático (liberado de memoria)
   * 8. Siguiente test comienza con nuevo loginPage
   * 
   * VENTAJA DE USAR use():
   * - Garantiza cleanup automático
   * - No necesitas try/finally
   * - Playwright maneja todo
   * 
   * TIPO DE RETORNO:
   * - LoginPage (instancia inicializada)
   * - Disponible en test como { loginPage }
   * 
   * EJEMPLO DE USO EN TEST:
   * test('Login exitoso', async ({ loginPage }) => {
   *   // loginPage ya existe, creado por este fixture
   *   await loginPage.navigateToLogin(BASE_URL);
   *   await loginPage.login('Admin', 'admin123');
   *   // Al terminar el test, loginPage se limpia automáticamente
   * });
   * 
   * SIN ESTE FIXTURE, TENDRÍAS QUE ESCRIBIR:
   * test('Login exitoso', async ({ page }) => {
   *   const loginPage = new LoginPage(page);
   *   await loginPage.navigateToLogin(BASE_URL);
   *   await loginPage.login('Admin', 'admin123');
   *   // Sin cleanup automático
   * });
   * 
   * DIFERENCIA:
   * - Con fixture: más limpio, automático, reutilizable
   * - Sin fixture: más manual, necesitas acordarte de cleanup
   * - Nuestro enfoque es más profesional y mantenible
   * 
   * COSA IMPORTANTE - page:
   * - { page } es fixture automático de Playwright
   * - Es el objeto que controla el navegador
   * - LoginPage lo necesita en su constructor
   * - Por eso hacemos: new LoginPage(page)
   */
  loginPage: async ({ page }, use) => {
    // SETUP: Crear la instancia de LoginPage
    const loginPage = new LoginPage(page);
    
    // Aquí podrías hacer más setup si necesitas
    // logger.info('LoginPage fixture creado');
    
    // await use() marca dónde comienza el test
    await use(loginPage);
    
    // TEARDOWN: Después que el test termina
    // (cleanup automático, page se cierra al final)
    // Si necesitaras algo especial aquí:
    // await loginPage.clearCookies();
    // logger.info('LoginPage fixture limpiado');
  },

  /**
   * FIXTURE: homePage
   * 
   * Crea una instancia de HomePage para cada test
   * 
   * MISMO PATRÓN que loginPage:
   * - Recibe { page }
   * - Crea new HomePage(page)
   * - Retorna con await use()
   * 
   * FLUJO:
   * 1. Playwright proporciona page
   * 2. Creamos: homePage = new HomePage(page)
   * 3. Test comienza (puedes usar homePage)
   * 4. Test termina
   * 5. Cleanup automático
   * 
   * EJEMPLO DE USO EN TEST:
   * test('Logout', async ({ homePage }) => {
   *   // homePage ya existe
   *   await homePage.logout();
   *   // Al terminar, se limpia automáticamente
   * });
   * 
   * USO CON AMBOS FIXTURES:
   * test('Login y logout', async ({ loginPage, homePage }) => {
   *   // Ambos disponibles en el mismo test
   *   await loginPage.login('Admin', 'admin123');
   *   await homePage.logout();
   * });
   * 
   * TIPO DE RETORNO:
   * - HomePage (instancia inicializada)
   * - Disponible en test como { homePage }
   * 
   * INSTANCIACIÓN:
   * - new HomePage(page) crea la instancia
   * - Hereda de BasePage
   * - Tiene métodos como:
   *   - isUserLoggedIn()
   *   - logout()
   *   - openUserMenu()
   *   - getErrorMessage() heredado de BasePage
   *   - etc.
   */
  homePage: async ({ page }, use) => {
    // SETUP: Crear la instancia de HomePage
    const homePage = new HomePage(page);
    
    // await use() marca dónde comienza el test
    await use(homePage);
    
    // TEARDOWN: Después que el test termina
  },
});

/**
 * EXPORT: expect
 * 
 * Re-exportamos el expect de Playwright desde aquí
 * 
 * RAZÓN:
 * - Consistencia: todos los imports vienen de '@fixtures/test-fixtures'
 * - Un lugar central para imports de test
 * - Si necesitas extender expect en el futuro, está aquí
 * - DRY principle (Don't Repeat Yourself)
 * 
 * QUÉ ES expect:
 * - Función para hacer aserciones (validaciones)
 * - Verifica que algo sea verdad en tu test
 * - Lanza error si la validación falla
 * - Test se detiene
 * 
 * USOS COMUNES DE expect:
 * 
 * // URL
 * expect(page).toHaveURL('https://...');
 * 
 * // Título
 * await expect(page).toHaveTitle('Dashboard');
 * 
 * // Visibilidad de elemento
 * await expect(element).toBeVisible();
 * 
 * // Texto
 * await expect(element).toHaveText('Login');
 * 
 * // Valor de input
 * await expect(input).toHaveValue('admin');
 * 
 * // No estar visible
 * await expect(element).not.toBeVisible();
 * 
 * IMPORT EN TESTS:
 * import { test, expect } from '@fixtures/test-fixtures';
 * 
 * test('ejemplo', async ({ page, loginPage }) => {
 *   await loginPage.login('Admin', 'admin123');
 *   
 *   // Usar expect para validar
 *   expect(page).toHaveURL(expectedUrl);
 *   await expect(someElement).toBeVisible();
 * });
 * 
 * DIFERENCIA:
 * - expect viene de '@playwright/test'
 * - Lo re-exportamos para mantener imports centralizados
 * - Más fácil cambiar o extender en el futuro
 */
export { expect };
