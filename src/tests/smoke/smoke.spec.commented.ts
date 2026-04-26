/**
 * =====================================================
 * SMOKE TESTS - HEALTH CHECKS (CON COMENTARIOS COMPLETOS)
 * =====================================================
 * 
 * ARCHIVO ORIGINAL: src/tests/smoke/smoke.spec.ts
 * ARCHIVO COMENTADO: Este archivo (smoke.spec.commented.ts)
 * 
 * QUÉ SON SMOKE TESTS:
 * - Pruebas RÁPIDAS y BÁSICAS
 * - Verifican que componentes críticos funcionan
 * - "¿Hay humo?¿La aplicación se quema?" (metáfora)
 * - Ejecutadas en CI/CD antes de tests detallados
 * 
 * VENTAJAS:
 * - Muy rápidos (< 30 segundos total)
 * - Detectan problemas mayores
 * - Fallan rápido si hay big issues
 * - NO verifican lógica detallada
 * 
 * DESVENTAJAS:
 * - No encuentran bugs sutiles
 * - Cobertura limitada
 * - Falsos positivos posibles
 * 
 * TOTAL DE TESTS: 8
 * - 2 tests básicos de carga
 * - 1 test de formulario
 * - 2 tests de flujos completos
 * - 1 test de errores JavaScript
 * - 1 test de network errors
 * - 1 test adicional (comentario indica posible)
 * 
 * CUÁNDO EJECUTAR:
 * - En CI/CD antes de suite completa
 * - Localmente para chequeo rápido
 * - npm run test:smoke
 * 
 * PATRÓN:
 * - Rápido fallar si hay problemas
 * - No hace beforeEach login
 * - Cada test es independiente
 * - Pruebas de "happy path" principalmente
 */

import { test, expect } from '@fixtures/test-fixtures';
import { LOGIN_URL, BASE_URL, TEST_USER } from '@config/constants';
import { logger } from '@utils/logger';

/**
 * =====================================================
 * DESCRIBE: 🔥 OrangeHRM Smoke Tests
 * =====================================================
 * 
 * Emoji 🔥 indica "smoke" - pruebas de fuego
 * Verifican salud básica de la app
 */
test.describe('🔥 OrangeHRM Smoke Tests', () => {
  /**
   * NOTA IMPORTANTE:
   * NO hay beforeEach en este describe
   * 
   * RAZÓN:
   * Cada smoke test es diferente
   * Algunos prueban login, otros logout
   * Cada uno hace su setup
   * 
   * VENTAJA:
   * Tests independientes
   * Si uno falla, otros continúan
   * 
   * DESVENTAJA:
   * Repetición de código
   * Pero es OK para smoke tests
   */

  // =====================================================
  // 🔥 SMOKE TEST 1: Login page loads
  // =====================================================

  /**
   * =====================================================
   * TEST 1: 🔥 Should load login page without errors
   * =====================================================
   * 
   * QUÉ PRUEBA (El test más básico):
   * 1. Navegar a /auth/login
   * 2. Página carga sin errores
   * 3. Título es válido
   * 
   * EXPECTATIVA:
   * Si esto falla → PROBLEMA CRÍTICO
   * La aplicación está MUERTA
   * No se puede hacer nada
   * 
   * PASOS:
   * 1. Log de que estamos cargando
   * 2. page.goto(LOGIN_URL)
   * 3. Esperar que cargue
   * 4. Obtener título
   * 5. Verificar que existe y contiene "login"
   */
  test('🔥 Debería cargar la página de login sin errores', async ({ page }) => {
    /**
     * LOG
     * 
     * logger.info() registra que iniciamos
     * Aparece en console y reportes
     * Útil para debugging
     */
    logger.info('Loading login page...');

    /**
     * NAVEGAR A LOGIN
     * 
     * LOGIN_URL = 'https://opensource-demo.orangehrm.com/web/index.php/auth/login'
     * 
     * page.goto(url) hace:
     * 1. Abre URL en navegador
     * 2. Espera a que cargue (default networkidle)
     * 3. Si error de servidor → lanza error
     * 4. Si 404 → lanza error
     * 5. Si timeout → lanza error
     */
    await page.goto(LOGIN_URL);

    /**
     * ESPERAR QUE CARGUE COMPLETAMENTE
     * 
     * page.waitForLoadState('networkidle')
     * 
     * networkidle = sin network activity por 500ms
     * Garantiza que page está lista
     */
    await page.waitForLoadState('networkidle');

    /**
     * OBTENER TÍTULO
     * 
     * page.title() retorna <title>...</title> del HTML
     * Si no hay <title> → string vacío
     */
    const title = await page.title();

    /**
     * ASERCIÓN 1: Título existe
     * 
     * toBeTruthy() verifica que title no es empty/null/undefined
     * Si falla → título es vacío
     */
    expect(title).toBeTruthy();

    /**
     * ASERCIÓN 2: Título contiene "login"
     * 
     * title.toLowerCase().toContain('login')
     * Convierte a minúsculas para comparación case-insensitive
     * Verifica que palabra "login" aparece
     */
    expect(title.toLowerCase()).toContain('login');

    /**
     * ✓ SI AMBAS ASERCIONES PASAN:
     * - Login page está accesible
     * - Página cargó sin errores
     * - Título es válido
     * ✓ SMOKE TEST 1 PASA
     * 
     * ✗ SI FALLA:
     * - No se puede loguear
     * - No se puede probar nada
     * - APP ESTÁ ROTA
     * ✗ DETENER TODO
     */
  });

  // =====================================================
  // 🔥 SMOKE TEST 2: Form elements visible
  // =====================================================

  /**
   * =====================================================
   * TEST 2: 🔥 Should have login form visible
   * =====================================================
   * 
   * QUÉ PRUEBA:
   * Formulario de login está en la página
   * Todos los campos son visibles
   * 
   * PASOS:
   * 1. Navegar a login
   * 2. Verificar que formulario es visible
   * 3. Verificar que inputs son visibles
   * 4. Verificar que botón es visible
   * 
   * IMPORTANCIA:
   * Si fields no están visibles:
   * - Usuario no puede ingresar datos
   * - No puede hacer login
   * - CRÍTICO
   */
  test('🔥 Debería tener el formulario de login visible', async ({ loginPage }) => {
    /**
     * NAVEGAR AL LOGIN
     * 
     * loginPage.navigateToLogin(url)
     * 
     * Método en LoginPage:
     * async navigateToLogin(url) {
     *   await this.goto(url);
     *   await this.waitForSelector(this.usernameInput);
     * }
     * 
     * DIFERENCIA:
     * page.goto() solo navega
     * navigateToLogin() navega + espera elementos
     */
    await loginPage.navigateToLogin(LOGIN_URL);

    /**
     * VERIFICAR QUE FORMULARIO ESTÁ VISIBLE
     * 
     * isLoginFormVisible() busca LOGIN_FORM selector
     * Retorna true si visible, false si no
     */
    const isFormVisible = await loginPage.isLoginFormVisible();
    expect(isFormVisible).toBeTruthy();

    /**
     * VERIFICAR QUE USERNAME INPUT ESTÁ VISIBLE
     * 
     * isVisible(selector) verifica:
     * - Elemento existe en DOM
     * - display !== 'none'
     * - visibility !== 'hidden'
     * - No está off-screen
     * 
     * loginPage.usernameInput = selector CSS
     */
    const usernameVisible = await loginPage.isVisible(loginPage.usernameInput);

    /**
     * VERIFICAR QUE PASSWORD INPUT ESTÁ VISIBLE
     * 
     * Mismo que username
     */
    const passwordVisible = await loginPage.isVisible(loginPage.passwordInput);

    /**
     * VERIFICAR QUE BOTÓN ESTÁ VISIBLE
     * 
     * loginPage.loginButton = selector del botón login
     * Si no visible → usuario no puede hacer click
     */
    const buttonVisible = await loginPage.isVisible(loginPage.loginButton);

    /**
     * ASERCIONES - TODOS DEBEN SER TRUE
     * 
     * Si ANY es false:
     * - Ese elemento no está visible
     * - Problema de HTML/CSS
     * - Test falla
     */
    expect(usernameVisible).toBeTruthy();
    expect(passwordVisible).toBeTruthy();
    expect(buttonVisible).toBeTruthy();

    /**
     * RESUMEN:
     * ✓ Form visible
     * ✓ Username input visible
     * ✓ Password input visible
     * ✓ Login button visible
     * ✓ USUARIO PUEDE LOGUEAR
     */
  });

  // =====================================================
  // 🔥 SMOKE TEST 3: Complete login flow
  // =====================================================

  /**
   * =====================================================
   * TEST 3: 🔥 Should complete full login flow
   * =====================================================
   * 
   * QUÉ PRUEBA:
   * El flujo completo de login funciona:
   * 1. Navegar a login
   * 2. Llenar username
   * 3. Llenar password
   * 4. Click botón
   * 5. Llega al dashboard
   * 
   * IMPORTANCIA:
   * El test MÁS IMPORTANTE
     * Si falla → usuario no puede acceder
     * Si pasa → sistema funciona
     * 
     * PASOS:
     * 1. Log que estamos probando
     * 2. Navegar a login
     * 3. Hacer login
     * 4. Verificar que estamos logueados
     */
  test('🔥 Debería completar el flujo completo de login', async ({ loginPage, homePage }) => {
    /**
     * REGISTRO
     */
    logger.info('Testing complete login flow...');

    /**
     * NAVEGAR A LOGIN
     * 
     * navigateToLogin(url):
     * - Ir a login
     * - Esperar que elementos carguen
     * - Preparado para login
     */
    await loginPage.navigateToLogin(LOGIN_URL);

    /**
     * HACER LOGIN
     * 
     * login(username, password):
     * 1. Llenar username
     * 2. Llenar password
     * 3. Click botón
     * 4. Esperar networkidle
     * 
     * TEST_USER = { email: 'Admin', password: 'admin123' }
     */
    await loginPage.login(TEST_USER.email, TEST_USER.password);

    /**
     * VERIFICAR QUE ESTAMOS LOGUEADOS
     * 
     * isUserLoggedIn() busca DASHBOARD_GRID
     * Si visible → usuario en dashboard
     * Si no → login falló o redirect
     */
    const isLoggedIn = await homePage.isUserLoggedIn();
    expect(isLoggedIn).toBeTruthy();

    /**
     * ✓ SI PASA:
     * - Usuario logueado correctamente
     * - Sistema está funcional
     * - APP ESTÁ VIVA
     * 
     * ✗ SI FALLA:
     * - Login no funciona
     * - Credenciales rechazadas
     * - Servidor error
     * - PROBLEMA CRÍTICO
     */
  });

  // =====================================================
  // 🔥 SMOKE TEST 4: Complete logout flow
  // =====================================================

  /**
   * =====================================================
   * TEST 4: 🔥 Should complete full logout flow
   * =====================================================
   * 
   * QUÉ PRUEBA:
   * Logout fluye sin problemas:
   * 1. Login
     * 2. Logout
     * 3. Volver a login page
     * 
     * IMPORTANCIA:
     * Usuario debe poder salir del sistema
     * Especialmente importante en shared computers
     * Seguridad crítica
     */
  test('🔥 Debería completar el flujo completo de logout', async ({
    loginPage,
    homePage,
    page,
  }) => {
    /**
     * REGISTRO
     */
    logger.info('Testing complete logout flow...');

    /**
     * PASO 1: LOGIN
     * 
     * Necesitamos estar logueados para probar logout
     */
    await loginPage.navigateToLogin(LOGIN_URL);
    await loginPage.login(TEST_USER.email, TEST_USER.password);

    /**
     * PASO 2: LOGOUT
     * 
     * homePage.logout():
     * 1. Click menú usuario
     * 2. Click logout
     * 3. Esperar navegación
     * 4. Redirecciona a login
     */
    await homePage.logout();

    /**
     * ESPERAR QUE CARGUE LOGIN PAGE
     * 
     * Después de logout, redirecciona a /auth/login
     * Necesitamos esperar que cargue
     */
    await page.waitForLoadState('networkidle');

    /**
     * VERIFICAR QUE ESTAMOS EN LOGIN
     * 
     * isOnLoginPage() verifica:
     * 1. URL contiene /auth/login
     * 2. Formulario login es visible
     */
    const isOnLogin = await homePage.isOnLoginPage();
    expect(isOnLogin).toBeTruthy();

    /**
     * ✓ SI PASA:
     * - Logout funciona
     * - Sesión termina
     * - Usuario vuelve a login
     * - SEGURIDAD OK
     * 
     * ✗ SI FALLA:
     * - Usuario no puede logout
     * - Sesión no termina
     * - SEGURIDAD COMPROMETIDA
     */
  });

  // =====================================================
  // 🔥 SMOKE TEST 5: No JavaScript errors
  // =====================================================

  /**
   * =====================================================
   * TEST 5: 🔥 Should not have JavaScript console errors
   * =====================================================
   * 
   * QUÉ PRUEBA:
   * No hay errores de JavaScript en console
   * 
   * CONCEPTOS:
   * Browser console = F12 → Console tab
   * Muestra logs, warnings, errors
   * Los errores rompen funcionalidad
   * 
   * page.on('console', callback)
   * Escucha todos los mensajes console
   * 
   * PASOS:
   * 1. Escuchar mensajes console
     * 2. Si tipo es 'error' → guardar
     * 3. Navegar a login
     * 4. Verificar que no hay errores guardados
     */
  test('🔥 No debería tener errores de JavaScript en la consola', async ({
    loginPage,
    page,
  }) => {
    /**
     * ARRAY PARA GUARDAR ERRORES
     * 
     * const errors: string[] = [];
     * Array vacío al inicio
     * Guardará mensajes de error si hay
     */
    const errors: string[] = [];

    /**
     * ESCUCHAR EVENTOS CONSOLE
     * 
     * page.on('console', (msg) => { ... })
     * 
     * Cada vez que browser hace console.log/error:
     * - msg es objeto ConsoleMessage
     * - msg.type() retorna tipo: 'log', 'error', 'warn', etc
     * - msg.text() retorna el mensaje
     * 
     * LÓGICA:
     * if (msg.type() === 'error') {
     *   errors.push(msg.text());
     * }
     * Solo guarda si es error
     */
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    /**
     * NAVEGAR A LOGIN
     * 
     * Mientras navega, page escucha console
     * Si hay console.error() → se guarda en errors array
     */
    await loginPage.navigateToLogin(LOGIN_URL);

    /**
     * ASERCIÓN
     * 
     * errors.length === 0
     * No debe haber ningún error guardado
     * 
     * expect(0).toBe(0) → PASA
     * expect(1).toBe(0) → FALLA con "expected 1 to be 0"
     */
    expect(errors.length).toBe(0);

    /**
     * NOTA:
     * Esto NO detecta:
     * - XSS attacks
     * - Logic errors (silenciosos)
     * - Network problems
     * 
     * Esto SÍ detecta:
     * - Uncaught exceptions
     * - Missing files (404)
     * - Syntax errors
     * - Browser API errors
     * 
     * VENTAJA:
     * Encuentra problemas que usuario ve
     * Browser warnings no se registran (solo errors)
     */
  });

  // =====================================================
  // 🔥 SMOKE TEST 6: Network errors
  // =====================================================

  /**
   * =====================================================
   * TEST 6: 🔥 Should handle network requests successfully
   * =====================================================
   * 
   * QUÉ PRUEBA:
   * No hay server errors (5xx)
   * Todos los requests retornan 2xx/3xx/4xx
   * No 500 (Internal Server Error)
   * 
   * CONCEPTOS HTTP:
   * 2xx = Success (200, 201, etc)
   * 3xx = Redirect (301, 302, etc)
   * 4xx = Client error (400, 404, 401, etc)
   * 5xx = Server error (500, 502, 503, etc)
   * 
   * ESTE TEST:
   * Rechaza cualquier 5xx
     * Acepta 2xx, 3xx, 4xx
     * 
     * PASOS:
     * 1. Escuchar responses
     * 2. Si response.status() >= 500 → error
     * 3. Navegar a login
     * 4. Verificar que requestsFailed === false
     */
  test('🔥 Debería manejar las solicitudes de red exitosamente', async ({ page }) => {
    /**
     * FLAG PARA ERRORS
     * 
     * let requestsFailed = false;
     * Comienza como false
     * Si hay 5xx → se pone true
     */
    let requestsFailed = false;

    /**
     * ESCUCHAR RESPONSES
     * 
     * page.on('response', (response) => { ... })
     * 
     * Cada request que completa:
     * - response es objeto Response
     * - response.status() retorna código HTTP
     * - response.url() retorna URL
     * 
     * LÓGICA:
     * if (response.status() >= 500) {
     *   requestsFailed = true;
     * }
     * Si code >= 500 → indica server error
     */
    page.on('response', (response) => {
      if (response.status() >= 500) {
        requestsFailed = true;
      }
    });

    /**
     * NAVEGAR A LOGIN
     * 
     * Mientras navega, se registran todas las responses
     * Si alguna es 5xx → requestsFailed = true
     */
    await page.goto(LOGIN_URL);
    await page.waitForLoadState('networkidle');

    /**
     * ASERCIÓN
     * 
     * expect(requestsFailed).toBeFalsy()
     * 
     * requestsFailed = false → PASA
     * requestsFailed = true → FALLA
     * 
     * Si falla → algún request retornó 5xx
     * Significa: SERVER ERROR
     */
    expect(requestsFailed).toBeFalsy();

    /**
     * CASOS DE 5xx:
     * 500 - Internal Server Error (bug en código)
     * 502 - Bad Gateway (server down)
     * 503 - Service Unavailable (mantenimiento)
     * 
     * Si falla este test:
     * - Servidor está down
     * - Problema de base de datos
     * - Bug en backend
     * - NO esperes pasar otros tests
     * - Contacta al team de backend
     */
  });

  /**
   * =====================================================
   * RESUMEN SMOKE TESTS
   * =====================================================
   * 
   * Si TODOS los smoke tests pasan:
   * ✓ Página carga
   * ✓ Formulario visible
   * ✓ Login funciona
   * ✓ Logout funciona
   * ✓ No hay JS errors
   * ✓ Server responde sin 5xx
   * ✓ APP ESTÁ VIVA Y LISTA
   * 
   * Si ALGUNO falla:
   * ✗ PROBLEMA CRÍTICO
   * ✗ Detener suite completa
   * ✗ No ejecutar tests detallados
   * ✗ Contactar al equipo
   * 
   * TIEMPO TOTAL:
   * ~10-15 segundos todos los tests
   * Muy rápido
   * Ideal para CI/CD
   * 
   * EJECUCIÓN:
   * npm run test:smoke
   * 
   * IDEAL PARA:
   * - CI/CD pipeline antes de suite completa
   * - Chequeo rápido local
   * - Sanity check después deploy
   * - Health monitoring
   */
}); // Fin de describe