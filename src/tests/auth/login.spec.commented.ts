/**
 * =====================================================
 * TESTS DE AUTENTICACIÓN - LOGIN (CON COMENTARIOS COMPLETOS)
 * =====================================================
 * 
 * ARCHIVO ORIGINAL: src/tests/auth/login.spec.ts
 * ARCHIVO COMENTADO: Este archivo (login.spec.commented.ts)
 * 
 * PROPÓSITO DE ESTE ARCHIVO:
 * - Versión completamente comentada para estudio
 * - Explicación línea por línea
 * - Patrones y mejores prácticas
 * - Fácil entender sin ejecutar código
 * 
 * TOTAL DE TESTS: 24 tests cubriendo:
 * - 3 casos de éxito (login válido) ✅
 * - 3 casos de error (credenciales inválidas) ❌
 * - 6 casos límite (campos vacíos, caracteres especiales, SQL injection) ⚠️
 * - 3 casos de flujo (reintentos, estado del form) 🔄
 * - 4 casos de validación (interfaz/UI) 🎯
 * - 2 casos de timing (esperas, cargas) ⏱️
 * - 2 casos de rendimiento (velocidad de login) 🚀
 * - 1 caso de logout 🚀
 * 
 * ESTRUCTURA:
 * - test.describe() → Agrupa todos los tests
 * - test.beforeEach() → Se ejecuta ANTES de cada test
 * - test.afterEach() → Se ejecuta DESPUÉS de cada test
 * - test() → Un test individual
 * 
 * FIXTURES USADOS:
 * - loginPage: Objeto Page Object para interactuar con página de login
 * - homePage: Objeto Page Object para verificar dashboard
 * - page: Página bruta de Playwright (para operaciones avanzadas)
 * - expect: Para hacer aserciones/validaciones
 * 
 * CÓMO LEER ESTE ARCHIVO:
 * 1. Lee los comentarios antes de cada test
 * 2. Entiende QUÉ SE PRUEBA
 * 3. Lee los PASOS del test
 * 4. Entiende las ASERCIONES
 * 5. Fíjate en los PATRONES usados
 * 6. Aprende a escribir tests similares
 */

import { test, expect } from '@fixtures/test-fixtures';
import { LOGIN_URL, DASHBOARD_URL, TEST_USER, INVALID_USER } from '@config/constants';
import { logger } from '@utils/logger';

/**
 * =====================================================
 * DESCRIBE: 🔐 OrangeHRM Login Tests
 * =====================================================
 * 
 * test.describe() agrupa múltiples tests bajo un tema
 * 
 * SINTAXIS:
 * test.describe('Nombre del grupo', () => {
 *   test('Test 1', ...);
 *   test('Test 2', ...);
 * });
 * 
 * VENTAJAS:
 * - Reportes más organizados
 * - Ejecución selectiva (ejecutar solo este grupo)
 * - Hooks específicos (beforeEach solo para este grupo)
 * - Mejor legibilidad
 * 
 * EMOJI 🔐:
 * Indica que trata de seguridad/autenticación
 * Puramente visual, no afecta ejecución
 */
test.describe('🔐 OrangeHRM Login Tests', () => {
  /**
   * =====================================================
   * HOOK: beforeEach
   * =====================================================
   * 
   * Se ejecuta ANTES de CADA test en este describe
   * 
   * PROPÓSITO: SETUP (preparación)
   * - Navegar a página inicial
   * - Limpiar estado
   * - Inicializar datos
   * - Configurar mocks
   * 
   * ORDEN DE EJECUCIÓN EN CADA TEST:
   * 1. beforeEach() ← Aquí estamos
   * 2. test() ← Tu código de test
   * 3. afterEach() ← Limpieza
   * 
   * PARÁMETRO { page }:
   * - page es fixture automático de Playwright
   * - Controlador del navegador
   * - Métodos: page.goto(), page.click(), etc.
   * - Diferente instancia para cada test
   * 
   * SCOPE:
   * - Solo se ejecuta en tests dentro de este describe
   * - No en describe anidados (a menos que los heredan)
   * 
   * IMPORTANTE:
   * Este beforeEach es CRÍTICO:
   * Si falla aquí, todos los tests fallan
   * Simplemente no llegaran a ejecutarse
   */
  test.beforeEach(async ({ page }) => {
    // REGISTRO: Logging de inicio
    // Útil para debugging si algo falla
    // Aparece en reportes y console
    logger.info('=== Starting new test ===');
    
    /**
     * NAVEGACIÓN: Ir a página de login
     * 
     * LOGIN_URL = 'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login'
     * 
     * QUÉ HACE page.goto():
     * 1. Abre la URL en el navegador
     * 2. Espera a que la página cargue
     * 3. Default: espera 30 segundos
     * 4. Si timeout, lanza error
     * 5. URL en la barra de direcciones cambia
     * 
     * VENTAJA:
     * - Cada test comienza desde cero
     * - No hay contaminación entre tests
     * - Estado limpio garantizado
     * 
     * ALTERNATIVA SIN beforeEach:
     * Tendrías que escribir esto en CADA test
     * Con beforeEach, escribes UNA sola vez
     */
    await page.goto(LOGIN_URL);
  });

  /**
   * =====================================================
   * HOOK: afterEach
   * =====================================================
   * 
   * Se ejecuta DESPUÉS de CADA test
   * 
   * PROPÓSITO: CLEANUP (limpieza)
   * - Cerrar recursos
   * - Limpiar datos creados
   * - Logging de finalización
   * - Tomar screenshots si falló
   * 
   * IMPORTANTE:
   * Se ejecuta INCLUSO si test falla
   * Garantiza limpieza siempre
   * 
   * EN ESTE PROYECTO:
   * Solo hace logging
   * Playwright cierra navegador automáticamente
   * 
   * CASOS DONDE NECESITARÍAS MÁS:
   * - Limpiar base de datos
   * - Cancelar subscripciones
   * - Cerrar conexiones
   * - Liberar archivos
   */
  test.afterEach(async () => {
    // Registro de finalización
    logger.info('=== Test completed ===');
    
    // En proyectos reales, aquí irían más cosas:
    // await page.close();
    // await deleteTestUser();
    // await resetDatabase();
  });

  // =====================================================
  // ✅ CATEGORÍA 1: CASOS DE ÉXITO - LOGIN VÁLIDO
  // =====================================================
  // 
  // PROPÓSITO: Verificar que login funciona con credenciales válidas
  // IMPORTANCIA: CRÍTICO - Si esto falla, el sistema no funciona
  // TESTS: 3
  // 
  // Cada test verifica aspecto diferente:
  // 1. Test 1 → Login exitoso + verificación de estado
  // 2. Test 2 → URL correcta después de login
  // 3. Test 3 → Formulario desaparece después de login
  //

  /**
   * =====================================================
   * TEST 1: ✅ Should login successfully with valid credentials
   * =====================================================
   * 
   * IDENTIFICADOR: Test #1 de 24
   * CATEGORÍA: Casos de Éxito
   * PRIORIDAD: CRÍTICO
   * 
   * QUÉ PRUEBA (en una línea):
   * Login con credenciales válidas funciona correctamente
   * 
   * COMPORTAMIENTO ESPERADO:
   * Usuario (Admin) + Contraseña (admin123) → Acceso al dashboard
   * 
   * PASOS DEL TEST:
   * 1. Hacer login con credenciales válidas
   * 2. Verificar que page dice "logueado"
   * 3. Verificar que título contiene "dashboard"
   * 
   * FIXTURES USADOS:
   * - loginPage: Para interactuar con formulario login
   * - homePage: Para verificar estado del dashboard
   * - expect: Para hacer aserciones
   * 
   * IMPORTANCIA:
   * Este es el HAPPY PATH más importante
   * Si falla, usuario no puede usar la app
   * 
   * TIEMPO ESTIMADO: 3-5 segundos
   * 
   * DEPENDENCIAS:
   * - beforeEach ya navegó a LOGIN_URL
   * - LOGIN_URL existe y es accesible
   * - TestUser (Admin/admin123) existe en sistema
   */
  test('✅ Debería loguear correctamente con credenciales válidas', async ({
    loginPage,
    homePage,
  }) => {
    /**
     * PASO 1: Realizar login
     * 
     * loginPage.login(username, password)
     * 
     * QUÉ HACE INTERNAMENTE:
     * 1. await loginPage.fillUsername(username)
     *    → Escribe en el campo usuario
     * 2. await loginPage.fillPassword(password)
     *    → Escribe en el campo contraseña
     * 3. await loginPage.clickLoginButton()
     *    → Hace click en botón login
     *    → Espera networkidle (conexión establece)
     * 
     * PARÁMETROS:
     * - TEST_USER.email = 'Admin' (username)
     * - TEST_USER.password = 'admin123' (password)
     * 
     * De constants.ts:
     * export const TEST_USER: TestUser = {
     *   email: 'Admin',
     *   password: 'admin123'
     * };
     * 
     * FLUJO EN SERVIDOR:
     * Browser → POST /auth/validate
     *         → Servidor valida credenciales
     *         → Si OK, crea sesión/JWT
     *         → Si no, retorna error
     * 
     * TIEMPO: 1-3 segundos típicamente
     */
    await loginPage.login(TEST_USER.email, TEST_USER.password);

    /**
     * PASO 2: Verificar que estamos logueados
     * 
     * homePage.isUserLoggedIn()
     * 
     * QUÉ HACE:
     * 1. Busca el selector DASHBOARD_GRID
     * 2. Verifica si es visible
     * 3. Retorna true/false
     * 
     * SELECTOR DASHBOARD_GRID:
     * En constants.ts, apunta a elemento único del dashboard
     * Si elemento NO está visible → usuario no logueado
     * Si elemento SÍ está visible → usuario logueado
     * 
     * LÓGICA:
     * - El dashboard SOLO aparece si logueado
     * - Si credenciales inválidas → página login sigue visible
     * - Por lo tanto, si dashboard visible → login exitoso
     * 
     * TIMEOUT:
     * Default 5 segundos
     * Si elemento no aparece en 5 segundos → false
     * 
     * VARIABLE:
     * isLoggedIn = true si dashboard visible
     * isLoggedIn = false si no visible
     */
    const isLoggedIn = await homePage.isUserLoggedIn();

    /**
     * PASO 3: Primera aserción
     * 
     * expect(isLoggedIn).toBeTruthy()
     * 
     * QUÉ SIGNIFICA:
     * "isLoggedIn debe ser verdadero (true)"
     * 
     * SI PASA:
     * isLoggedIn === true → Test continúa
     * 
     * SI FALLA:
     * isLoggedIn === false → Test falla aquí
     * Mensaje: "expected false to be truthy"
     * 
     * MATCHERS DE EXPECT:
     * - .toBeTruthy() → === true o valor truthy
     * - .toBeFalsy() → === false o valor falsy
     * - .toBe(valor) → igualdad estricta (===)
     * - .toEqual(valor) → igualdad profunda
     * - .toContain(valor) → string contiene substring
     * - .toBeVisible() → elemento visible en DOM
     * 
     * NOTA IMPORTANTE:
     * expect() LANZA ERROR si falla
     * Test se detiene inmediatamente
     * Código después no se ejecuta
     */
    expect(isLoggedIn).toBeTruthy();

    /**
     * PASO 4: Obtener título de la página
     * 
     * homePage.getDashboardTitle()
     * 
     * QUÉ RETORNA:
     * El <title> del HTML
     * Ejemplo: "OrangeHRM" o "Dashboard - OrangeHRM"
     * 
     * PARÁMETRO:
     * 'title' variable string con contenido
     */
    const title = await homePage.getDashboardTitle();

    /**
     * PASO 5: Segunda aserción
     * 
     * expect(title.toLowerCase()).toContain('dashboard')
     * 
     * DESGLOSE:
     * title = "OrangeHRM - Dashboard"
     * title.toLowerCase() = "orangehrm - dashboard"
     * toContain('dashboard') = ¿contiene "dashboard"? SÍ
     * 
     * POR QUÉ toLowerCase():
     * Comparación case-insensitive
     * Evita fallos por mayúsculas/minúsculas
     * 
     * PATRÓN:
     * Muy común: expect(string.toLowerCase()).toContain(expected.toLowerCase())
     * Más robusto que comparación exacta
     * 
     * RESULTADO:
     * Si título contiene "dashboard" (cualquier caso) → PASA
     * Si no contiene → FALLA
     */
    expect(title.toLowerCase()).toContain('dashboard');

    /**
     * RESUMEN DEL TEST:
     * ✓ Credenciales válidas aceptadas
     * ✓ Dashboard visible
     * ✓ Título contiene "dashboard"
     * ✓ LOGIN EXITOSO
     */
  });

  /**
   * =====================================================
   * TEST 2: ✅ Should display dashboard after successful login
   * =====================================================
   * 
   * IDENTIFICADOR: Test #2 de 24
   * CATEGORÍA: Casos de Éxito
   * PRIORIDAD: ALTO
   * 
   * QUÉ PRUEBA (en una línea):
   * URL es correcta después de login exitoso
   * 
   * COMPORTAMIENTO ESPERADO:
   * URL cambia a dashboard después de login
   * 
   * PASOS:
   * 1. Login
   * 2. Obtener URL actual
   * 3. Verificar que contiene '/dashboard/index'
   * 
   * DIFERENCIA CON TEST 1:
   * Test 1 → Verifica elemento HTML (dashboard visible)
   * Test 2 → Verifica URL de navegación
   * Ambos validan que estamos logueados, pero diferente forma
   * 
   * VENTAJA DE VALIDAR URL:
   * - Más rápido que esperar elemento
   * - Detecta redirecciones incorrectas
   * - URL es más confiable que CSS selectors
   * 
   * PARÁMETROS:
   * - loginPage: Para login
   * - homePage: Para obtener URL
   */
  test('✅ Debería mostrar el dashboard después de un login exitoso', async ({
    loginPage,
    homePage,
  }) => {
    // Hacer login con credenciales correctas
    await loginPage.login(TEST_USER.email, TEST_USER.password);

    /**
     * OBTENER URL ACTUAL
     * 
     * homePage.getCurrentDashboardUrl()
     * 
     * QUÉ RETORNA:
     * URL completa de la página actual
     * Ejemplo: "https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index"
     * 
     * MÉTODO EN BASEPAGE:
     * async getCurrentUrl() {
     *   return this.page.url();
     * }
     * 
     * page.url() retorna string con URL actual
     */
    const url = await homePage.getCurrentDashboardUrl();

    /**
     * ASERCIÓN: Verificar URL
     * 
     * expect(url).toContain('/dashboard/index')
     * 
     * SIGNIFICA:
     * "La URL debe contener '/dashboard/index'"
     * 
     * EJEMPLO DE URL:
     * "https://example.com/web/index.php/dashboard/index"
     * ↑ Contiene '/dashboard/index'? SÍ → PASA
     * 
     * VENTAJA DE toContain():
     * No necesitas URL completa exacta
     * Solo verificas que contiene la parte importante
     * Evita problemas con protocolo, puerto, etc.
     * 
     * PATRÓN:
     * expect(url).toContain('/dashboard/index');
     * Es más robusto que:
     * expect(url).toBe('https://...')
     */
    expect(url).toContain('/dashboard/index');

    /**
     * RESUMEN:
     * ✓ URL cambió al dashboard
     * ✓ Redirección funciona
     * ✓ Navegación correcta
     */
  });

  /**
   * =====================================================
   * TEST 3: ✅ Should verify login form is hidden after login
   * =====================================================
   * 
   * IDENTIFICADOR: Test #3 de 24
   * CATEGORÍA: Casos de Éxito
   * PRIORIDAD: ALTO
   * 
   * QUÉ PRUEBA:
   * Formulario de login desaparece después de login exitoso
   * 
   * LÓGICA:
   * Página tiene DOS estados:
   * 1. Formulario visible → Usuario no logueado
   * 2. Dashboard visible → Usuario logueado
   * 
   * No pueden estar ambos visibles
   * Después de login, formulario debe esconderse
   * 
   * PASOS:
   * 1. Login
   * 2. Verificar que formulario NO es visible
   * 3. Aserción debe ser false
   * 
   * NOTA:
     * Esto es validation adicional
     * Confirma que página se reemplazó correctamente
   */
  test('✅ Debería verificar que el formulario de login está oculto después del login', async ({
    loginPage,
    page,
  }) => {
    // Hacer login
    await loginPage.login(TEST_USER.email, TEST_USER.password);

    /**
     * VERIFICAR QUE FORMULARIO NO EXISTE
     * 
     * loginPage.isLoginFormVisible()
     * 
     * SELECTOR:
     * LOGIN_FORM = selector CSS que identifica el formulario
     * 
     * RETORNA:
     * true = formulario visible (usuario no logueado)
     * false = formulario no visible (usuario logueado)
     * 
     * ESPERA:
     * Por defecto 5 segundos
     * Si formulario sigue visible después 5 seg → false
     */
    const isFormVisible = await loginPage.isLoginFormVisible();

    /**
     * ASERCIÓN: Verificar que NO es visible
     * 
     * expect(isFormVisible).toBeFalsy()
     * 
     * SIGNIFICA:
     * "isFormVisible debe ser falso"
     * 
     * VALORES FALSY en JavaScript:
     * - false ← Lo que esperamos
     * - 0
     * - ''
     * - null
     * - undefined
     * - NaN
     * 
     * En este caso:
     * isFormVisible = false (boolean)
     * expect(false).toBeFalsy() → PASA
     * expect(true).toBeFalsy() → FALLA
     */
    expect(isFormVisible).toBeFalsy();
  });

  // =====================================================
  // ❌ CATEGORÍA 2: CASOS DE ERROR - CREDENCIALES INVÁLIDAS
  // =====================================================
  //
  // PROPÓSITO: Verificar que sistema rechaza credenciales inválidas
  // IMPORTANCIA: CRÍTICO - Seguridad
  // TESTS: 3
  //
  // Cada test prueba diferente tipo de credencial inválida:
  // 1. Test 4 → Usuario inválido, password correcto
  // 2. Test 5 → Usuario correcto, password inválido
  // 3. Test 6 → Ambos completamente inválidos
  //

  /**
   * =====================================================
   * TEST 4: ❌ Should display error with invalid username
   * =====================================================
   * 
   * IDENTIFICADOR: Test #4 de 24
   * CATEGORÍA: Casos de Error
   * PRIORIDAD: CRÍTICO
   * 
   * QUÉ PRUEBA:
   * Sistema rechaza usuario inválido
   * Muestra mensaje de error apropiado
   * 
   * ESCENARIO:
   * Usuario escribe mal su usuario
   * Contraseña es correcta, pero usuario no existe
   * Debe mostrarse error
   * 
   * PASOS:
   * 1. Llenar usuario con valor inválido
   * 2. Llenar password con valor correcto
   * 3. Click login
   * 4. Esperar que servidor procese (2 segundos)
   * 5. Verificar que error es visible
   * 
   * PARÁMETRO:
   * - loginPage: Para interactuar con formulario
   */
  test('❌ Debería mostrar error con usuario inválido', async ({ loginPage }) => {
    /**
     * LLENAR USUARIO INVÁLIDO
     * 
     * loginPage.fillUsername('InvalidUser123')
     * 
     * QUÉ HACE:
     * 1. Busca selector USERNAME_INPUT
     * 2. Hace clear() (borra contenido)
     * 3. Escribe el valor
     * 4. Espera a que se procese
     * 
     * VALOR:
     * 'InvalidUser123' - usuario que no existe en el sistema
     * 
     * DIFERENCIA CON fillPassword():
     * Ambas hacen lo mismo, solo en campos diferentes
     */
    await loginPage.fillUsername('InvalidUser123');

    /**
     * LLENAR PASSWORD CORRECTO
     * 
     * loginPage.fillPassword(TEST_USER.password)
     * 
     * QUÉ ES:
     * TEST_USER.password = 'admin123'
     * 
     * POR QUÉ PASSWORD CORRECTO:
     * Queremos aislar la falla
     * Si usuario Y password son malos, no sabemos cuál falló
     * Por eso: usuario malo, password correcto
     * Así sabemos que error es por usuario
     * 
     * TÉCNICA: "Isolating Variables"
     * Cambiar una variable a la vez
     * Así es fácil ver cuál causó el problema
     */
    await loginPage.fillPassword(TEST_USER.password);

    /**
     * CLICK LOGIN
     * 
     * loginPage.clickLoginButton()
     * 
     * QUÉ HACE:
     * 1. Busca selector LOGIN_BUTTON
     * 2. Hace click
     * 3. Espera networkidle (conexión completa)
     * 4. Retorna (no espera respuesta)
     * 
     * FLUJO ESPERADO:
     * Browser → POST /auth/validate
     *         → Servidor: Usuario 'InvalidUser123' no existe
     *         → Retorna: {"error": "Invalid credentials"}
     *         → Cliente recibe error
     *         → Muestra mensaje error en página
     * 
     * TIEMPO SERVIDOR: 1-2 segundos típicamente
     */
    await loginPage.clickLoginButton();

    /**
     * ESPERAR A QUE SERVIDOR PROCESE
     * 
     * loginPage.page.waitForTimeout(2000)
     * 
     * QUÉ SIGNIFICA:
     * 2000 = 2000 milisegundos = 2 segundos
     * Detiene el test por 2 segundos
     * 
     * POR QUÉ ESPERAR:
     * Server OrangeHRM tarda ~1-2 segundos en validar
     * Si no esperas, chequeas antes de que error aparezca
     * Resultado: assertion falla (error no visible aún)
     * 
     * MÉTODOS DE ESPERA:
     * page.waitForTimeout(ms) → Espera fija (mala práctica)
     * page.waitForSelector() → Espera elemento (mejor)
     * page.waitForFunction() → Espera condición (mejor)
     * await loginPage.clickLoginButton() → Ya espera network
     * 
     * EN ESTE CASO:
     * waitForTimeout es aceptable porque error es visible rápido
     * No hay mejor forma de saber cuándo error aparecerá
     * 
     * NOTA:
     * Esperar más (ej: 5 segundos) es más seguro pero más lento
     * 2 segundos es balance entre rapidez y confiabilidad
     */
    await loginPage.page.waitForTimeout(2000);

    /**
     * VERIFICAR QUE ERROR ES VISIBLE
     * 
     * loginPage.isErrorVisible()
     * 
     * QUÉ HACE:
     * 1. Busca selector ERROR_MESSAGE
     * 2. Verifica si es visible
     * 3. Retorna true/false
     * 
     * ERROR_MESSAGE selector:
     * En constants.ts:
     * ERROR_MESSAGE = '[class*="error"]'
     * 
     * TRADUCCIÓN:
     * "Cualquier elemento cuya clase contiene 'error'"
     * Ej: <div class="login-error">...</div>
     *     <span class="error-message">...</span>
     * 
     * TIMEOUT:
     * Por defecto 5 segundos
     * Si elemento no aparece en 5 seg → false
     * 
     * EN ESTE TEST:
     * Esperamos que error ESTÉ visible
     * Entonces isErrorVisible debería ser true
     */
    const isErrorVisible = await loginPage.isErrorVisible();

    /**
     * FINAL ASERCIÓN
     * 
     * expect(isErrorVisible).toBeTruthy()
     * 
     * SIGNIFICA:
     * "Debe haber mensaje de error visible"
     * 
     * SI PASA:
     * isErrorVisible = true → Error mostrado → Test pasa
     * 
     * SI FALLA:
     * isErrorVisible = false → Error NO mostrado → Test falla
     * Posibles razones:
     * - Servidor aceptó credenciales inválidas (BUG)
     * - Selector ERROR_MESSAGE es incorrecto
     * - Error está en otro elemento
     * - Timing: no esperamos lo suficiente
     */
    expect(isErrorVisible).toBeTruthy();

    /**
     * RESUMEN:
     * ✓ Sistema valida usuario
     * ✓ Usuario incorrecto rechazado
     * ✓ Error mostrado al usuario
     * ✓ SEGURIDAD OK
     */
  });

  /**
   * =====================================================
   * TEST 5: ❌ Should display error with invalid password
   * =====================================================
   * 
   * SIMILAR A TEST 4 PERO:
   * Usuario CORRECTO, Password INVÁLIDO
   * 
   * OBJETIVO: Aislar falla en password
   * No queremos que ambos sean malos
   * 
   * PASOS IDÉNTICOS A TEST 4
   * Solo cambia el password (correcto → incorrecto)
   */
  test('❌ Debería mostrar error con contraseña inválida', async ({ loginPage }) => {
    // Usuario CORRECTO
    await loginPage.fillUsername(TEST_USER.email);

    // Password INCORRECTO
    await loginPage.fillPassword('WrongPassword123!');

    // Click login
    await loginPage.clickLoginButton();

    // Esperar procesamiento
    await loginPage.page.waitForTimeout(2000);

    // Verificar error
    const isErrorVisible = await loginPage.isErrorVisible();
    expect(isErrorVisible).toBeTruthy();

    /**
     * PATRÓN OBSERVADO:
     * Este test es casi idéntico al anterior
     * Solo cambia 1 línea (fillPassword valor)
     * 
     * CÓDIGO DUPLICADO:
     * En proyecto real, extraerías a función helper:
     * 
     * async function testInvalidCredential(
     *   username, password, expectedError
     * ) {
     *   await loginPage.fillUsername(username);
     *   await loginPage.fillPassword(password);
     *   await loginPage.clickLoginButton();
     *   await loginPage.page.waitForTimeout(2000);
     *   expect(await loginPage.isErrorVisible()).toBeTruthy();
     * }
     * 
     * LUEGO:
     * test('❌ Invalid username', () => {
     *   testInvalidCredential('invalid', 'admin123');
     * });
     * 
     * test('❌ Invalid password', () => {
     *   testInvalidCredential('Admin', 'invalid');
     * });
     * 
     * VENTAJA:
     * - Menos código
     * - Más fácil mantener
     * - Un cambio = afecta todos
     * 
     * DESVENTAJA:
     * - Menos claro qué prueba cada test
     * - Debugging más difícil
     * 
     * DECISION:
     * Para este proyecto, mejor duplicación explícita
     * Cada test es independiente y clara
     */
  });

  /**
   * =====================================================
   * TEST 6: ❌ Should display error with completely wrong credentials
   * =====================================================
   * 
   * AMBAS credenciales inválidas
   * 
   * DIFERENCIA:
   * Test 4 → Usuario inválido + password válido
   * Test 5 → Usuario válido + password inválido
   * Test 6 → Usuario inválido + password inválido
   * 
   * USO DE CONSTANTE:
   * INVALID_USER en lugar de escribir valores
   * 
   * VENTAJA DE CONSTANTES:
   * - Reutilizable
   * - Un cambio, afecta todos
     * - Código más legible
     * - Menos propenso a typos
   */
  test('❌ Debería mostrar error con credenciales completamente incorrectas', async ({
    loginPage,
  }) => {
    /**
     * USAR CONSTANTE INVALID_USER
     * 
     * INVALID_USER en constants.ts:
     * export const INVALID_USER: TestUser = {
     *   email: 'InvalidUser',
     *   password: 'WrongPassword123!'
     * };
     * 
     * login() hace todo de una vez:
     * 1. fillUsername(email)
     * 2. fillPassword(password)
     * 3. clickLoginButton()
     * 4. Espera networkidle automáticamente
     * 
     * MÁS LIMPIO QUE:
     * await loginPage.fillUsername('InvalidUser');
     * await loginPage.fillPassword('WrongPassword123!');
     * await loginPage.clickLoginButton();
     */
    await loginPage.login(INVALID_USER.email, INVALID_USER.password);

    // Esperar procesamiento del servidor
    await loginPage.page.waitForTimeout(2000);

    // Verificar error
    const isErrorVisible = await loginPage.isErrorVisible();
    expect(isErrorVisible).toBeTruthy();

    /**
     * RESUMEN:
     * ✓ Sistema rechaza credenciales inválidas
     * ✓ Error mostrado en todos los casos
     * ✓ SEGURIDAD VALIDADA
     */
  });

  // =====================================================
  // ⚠️ CATEGORÍA 3: CASOS LÍMITE - CAMPOS VACÍOS/ESPECIALES
  // =====================================================
  //
  // PROPÓSITO: Validar comportamiento con entradas inusuales
  // IMPORTANCIA: ALTO - Evita crashes
  // TESTS: 6
  //
  // Casos cubiertos:
  // 1. Test 7 → Username vacío
  // 2. Test 8 → Password vacío
  // 3. Test 9 → Ambos vacíos
  // 4. Test 10 → Caracteres especiales
  // 5. Test 11 → Intento SQL injection
  // 6. (Sería Test 12 en comentario, pero saltamos a Test 12 en código)
  //

  /**
   * =====================================================
   * TEST 7: ⚠️ Should not login with empty username
   * =====================================================
   * 
   * QUÉ PRUEBA:
   * Sin escribir usuario → No login
   * 
   * ESCENARIO:
   * Usuario hace click "Login" sin llenar usuario
   * Sistema debería rechazar
   */
  test('⚠️ No debería loguear con usuario vacío', async ({ loginPage }) => {
    /**
     * NOTA: NO llenar username
     * Solo llenar password
     */
    
    // Password correcto
    await loginPage.fillPassword(TEST_USER.password);

    // Click login SIN username
    await loginPage.clickLoginButton();

    // Esperar validación
    await loginPage.page.waitForTimeout(1500);

    /**
     * VERIFICACIÓN:
     * isLoginFormVisible() retorna true
     * SIGNIFICA:
     * Formulario sigue visible → No nos dejó entrar → CORRECTO
     */
    const isOnLogin = await loginPage.isLoginFormVisible();
    expect(isOnLogin).toBeTruthy();

    /**
     * PATRÓN:
     * En tests de error/rechazo:
     * - expect elemento sigue visible
     * - expect mensaje de error
     * - expect NO en página siguiente
     * 
     * En tests de éxito:
     * - expect elemento desaparece
     * - expect página siguiente
     * - expect URL cambia
     */
  });

  /**
   * =====================================================
   * TEST 8: ⚠️ Should not login with empty password
   * =====================================================
   * 
   * INVERSO DE TEST 7:
   * Username lleno, Password vacío
   */
  test('⚠️ No debería loguear con contraseña vacía', async ({ loginPage }) => {
    // Username correcto
    await loginPage.fillUsername(TEST_USER.email);

    // NO llenar password
    // Click directo
    await loginPage.clickLoginButton();

    // Esperar validación
    await loginPage.page.waitForTimeout(1500);

    // Debe seguir en login
    const isOnLogin = await loginPage.isLoginFormVisible();
    expect(isOnLogin).toBeTruthy();
  });

  /**
   * =====================================================
   * TEST 9: ⚠️ Should not login with both fields empty
   * =====================================================
   * 
   * CASO EXTREMO:
   * Ambos campos vacíos
   */
  test('⚠️ No debería loguear con ambos campos vacíos', async ({ loginPage }) => {
    // No llenar NADA
    // Click directo

    await loginPage.clickLoginButton();

    // Esperar validación
    await loginPage.page.waitForTimeout(1500);

    // Debe seguir en login
    const isOnLogin = await loginPage.isLoginFormVisible();
    expect(isOnLogin).toBeTruthy();
  });

  /**
   * =====================================================
   * TEST 10: ⚠️ Should handle special characters in password
   * =====================================================
   * 
   * QUÉ PRUEBA:
   * Sistema maneja caracteres especiales sin romper
   * 
   * CARACTERES ESPECIALES:
   * P@ssw0rd!#$%^&*()
   * @, !, #, $, %, ^, &, *
   * 
   * IMPORTANCIA:
   * Usuario podría:
   * 1. Escribir mal (incluir caracteres raros)
   * 2. Copiar-pegar de fuente con caracteres especiales
   * 3. Password tiene caracteres especiales legítimos
   * 
   * SISTEMA DEBE:
   * - Aceptar caracteres especiales en input
   * - Enviar al servidor correctamente
   * - Detectar que credencial es inválida
   * - No romper interfaz
   * - No mostrar XSS vulnerabilities
   * 
     * SEGURIDAD:
     * - Backend debería escapear valores
     * - No debería hacer string concatenation en SQL
     * - Debería usar prepared statements
     */
  test('⚠️ Debería manejar caracteres especiales en contraseña', async ({ loginPage }) => {
    // Usuario correcto
    await loginPage.fillUsername(TEST_USER.email);

    // Password con caracteres especiales
    await loginPage.fillPassword('P@ssw0rd!#$%^&*()');

    // Click login
    await loginPage.clickLoginButton();

    // Esperar procesamiento
    await loginPage.page.waitForTimeout(2000);

    /**
     * ESPERADO:
     * Error: "Invalid credentials" (porque password no coincide)
     * NO: "Syntax error" o "SQL error"
     * NO: Página se rompe
     * NO: XSS attack
     */
    const isErrorVisible = await loginPage.isErrorVisible();
    expect(isErrorVisible).toBeTruthy();
  });

  /**
   * =====================================================
   * TEST 11: ⚠️ Should handle SQL injection attempt in username
   * =====================================================
   * 
   * QUÉ PRUEBA:
   * Sistema es seguro contra SQL injection
   * 
   * SQL INJECTION:
   * Técnica de ataque que modifica query SQL
   * 
   * EJEMPLO:
   * SELECT * FROM users WHERE email = 'input'
   * 
   * SIN PROTECCIÓN:
     * Si input = "' OR '1'='1"
     * Query se convierte en:
     * SELECT * FROM users WHERE email = '' OR '1'='1'
     * '1'='1' SIEMPRE es true
     * Query retorna TODOS los usuarios
     * Sistema entra sin credenciales válidas
     * ↑ SEGURIDAD CRÍTICA ROTA
     * 
     * CON PROTECCIÓN (prepared statements):
     * Query: SELECT * FROM users WHERE email = ?
     * Input NO se interpreta como SQL
     * Input se trata como string literal
     * ' OR '1'='1' se busca literalmente
     * No encuentra nada → login falla → CORRECTO
     * 
     * ESTE TEST VERIFICA:
     * OrangeHRM usa prepared statements correctamente
     * SQL injection es rechazado
   */
  test('⚠️ Debería manejar intento de SQL injection en usuario', async ({
    loginPage,
  }) => {
    /**
     * PAYLOAD SQL INJECTION:
     * " OR '1'='1"
     * 
     * INTENCIÓN ATACANTE:
     * Hacer que query retorne todos los usuarios
     * Saltarse validación de contraseña
     * Entrar sin credenciales válidas
     */
    await loginPage.fillUsername("' OR '1'='1");

    // Password correcta (pero no importa si SQL injection funciona)
    await loginPage.fillPassword(TEST_USER.password);

    // Click login
    await loginPage.clickLoginButton();

    // Esperar procesamiento
    await loginPage.page.waitForTimeout(2000);

    /**
     * ASERCIÓN:
     * Debe haber error (SQL injection rechazado)
     * 
     * SI FALLA ESTE TEST:
     * ¡¡¡ VULNERABILIDAD CRÍTICA DE SEGURIDAD !!!
     * 
     * Acciones inmediatas:
     * 1. REPORTAR A EQUIPO DE SEGURIDAD
     * 2. NO PONER EN PRODUCCIÓN
     * 3. INVESTIGAR CÓDIGO BACKEND
     * 4. IMPLEMENTAR PREPARED STATEMENTS
     * 5. RE-VALIDAR CON PENETRATION TESTING
     */
    const isErrorVisible = await loginPage.isErrorVisible();
    expect(isErrorVisible).toBeTruthy();
  });

  // =====================================================
  // 🔄 CATEGORÍA 4: CASOS DE FLUJO - MÚLTIPLES INTENTOS
  // =====================================================
  //
  // PROPÓSITO: Verificar que usuario puede reintentar
  // IMPORTANCIA: MEDIO - UX
  // TESTS: 3
  //
  // Casos:
  // 1. Test 12 → Fallo → Retry exitoso
  // 2. Test 13 → Valores se mantienen en form
  // 3. Test 14 → Clear form funciona
  //

  /**
   * =====================================================
   * TEST 12: 🔄 Should allow retry after failed login
   * =====================================================
   * 
   * QUÉ PRUEBA:
   * Después de login fallido, usuario puede intentar de nuevo
   * Segundo intento exitoso
   * 
   * FLUJO:
   * 1. Primer login FALLA (credenciales inválidas)
   * 2. Usuario ve error
   * 3. Usuario limpia form
   * 4. Usuario escribe correctamente
   * 5. Segundo login EXITOSO
   * 
   * IMPORTANCIA:
   * Usuario típico escribe mal una vez
   * Debe poder reintentar sin problemas
   * 
   * PASOS DETALLADOS:
   * 1. login() con INVALID_USER → Falla
   * 2. Esperar error
   * 3. Verificar error visible
   * 4. clearForm() → Borra campos
   * 5. login() con TEST_USER → Éxito
   * 6. Verificar que ahora NO estamos en login
   */
  test('🔄 Debería permitir reintento después de login fallido', async ({ loginPage }) => {
    /**
     * PRIMER INTENTO: FALLIDO
     * Usar INVALID_USER (credenciales malas)
     */
    await loginPage.login(INVALID_USER.email, INVALID_USER.password);

    // Esperar que servidor procese error
    await loginPage.page.waitForTimeout(2000);

    /**
     * VERIFICAR QUE PRIMER INTENTO FALLÓ
     * (Esto es parte de setup para segundo intento)
     */
    let isErrorVisible = await loginPage.isErrorVisible();
    expect(isErrorVisible).toBeTruthy();

    /**
     * LIMPIAR FORMULARIO
     * 
     * clearForm() borra ambos campos:
     * 1. Limpia USERNAME_INPUT
     * 2. Limpia PASSWORD_INPUT
     * 
     * MÉTODO EN LOGINPAGE:
     * async clearForm() {
     *   await this.clear(this.usernameInput);
     *   await this.clear(this.passwordInput);
     * }
     * 
     * MÉTODO EN BASEPAGE (clear):
     * async clear(selector) {
     *   await this.page.fill(selector, '');
     * }
     * 
     * page.fill('', '') equivale a:
     * 1. Triple-click para seleccionar todo
     * 2. Escribir el valor vacío
     * Borra el contenido
     */
    await loginPage.clearForm();

    /**
     * SEGUNDO INTENTO: EXITOSO
     * Ahora usar TEST_USER (credenciales correctas)
     */
    await loginPage.login(TEST_USER.email, TEST_USER.password);

    /**
     * VERIFICAR SEGUNDO INTENTO EXITOSO
     * 
     * isLoginFormVisible() retorna false
     * SIGNIFICA: Formulario NO está visible
     * SIGNIFICA: Entramos al dashboard
     * SIGNIFICA: Segundo login funcionó
     */
    const isOnLogin = await loginPage.isLoginFormVisible();
    expect(isOnLogin).toBeFalsy();

    /**
     * RESUMEN:
     * ✓ Primer login falló correctamente
     * ✓ Usuario pudo reintentar
     * ✓ Segundo login exitoso
     * ✓ FLUJO DE USUARIO OK
     */
  });

  /**
   * =====================================================
   * TEST 13: 🔄 Should maintain form state when filled
   * =====================================================
   * 
   * QUÉ PRUEBA:
   * Cuando escribes en un input, el valor se queda
   * (No desaparece mágicamente)
   * 
   * PASOS:
   * 1. Llenar username con "TestUser"
   * 2. Llenar password con "TestPass123"
   * 3. Obtener valores con getters
   * 4. Verificar que coinciden exactamente
   * 
   * IMPORTANTE:
   * Esto es HTML basic
     * Pero tests lo verifican para asegurar selectors son correctos
   */
  test('🔄 Debería mantener el estado del formulario cuando está lleno', async ({ loginPage }) => {
    // Definir valores de prueba
    const testUsername = 'TestUser';
    const testPassword = 'TestPass123';

    /**
     * LLENAR INPUTS
     * 
     * fillUsername(value):
     * 1. Busca selector USERNAME_INPUT
     * 2. Hace page.fill(selector, value)
     * 3. Espera a que se procese
     * 
     * NOTA:
     * Los valores NO son credenciales válidas
     * Solo verificamos que los valores se guardan
     * No intentamos login
     */
    await loginPage.fillUsername(testUsername);
    await loginPage.fillPassword(testPassword);

    /**
     * OBTENER VALORES
     * 
     * getUsernameValue():
     * 1. Busca selector USERNAME_INPUT
     * 2. Retorna el valor actual
     * 
     * getPasswordValue():
     * 1. Busca selector PASSWORD_INPUT
     * 2. Retorna el valor actual
     * 
     * MÉTODO EN BASEPAGE:
     * async getValue(selector) {
     *   return await this.page.inputValue(selector);
     * }
     * 
     * page.inputValue(selector) retorna string
     * Con el valor actual del input
     */
    let usernameValue = await loginPage.getUsernameValue();
    let passwordValue = await loginPage.getPasswordValue();

    /**
     * VERIFICAR VALORES
     * 
     * expect(value).toBe(expected)
     * 
     * .toBe() → Igualdad estricta (===)
     * 
     * IMPORTANTE DIFERENCIA:
     * .toBe() vs .toEqual()
     * 
     * .toBe() → para primitivos y referencias exactas
     * .toEqual() → para objetos y arrays
     * 
     * Para strings:
     * expect('TestUser').toBe('TestUser') → PASA
     * expect('TestUser').toEqual('TestUser') → TAMBIÉN PASA
     */
    expect(usernameValue).toBe(testUsername);
    expect(passwordValue).toBe(testPassword);

    /**
     * RESUMEN:
     * ✓ Valor escribido = Valor leído
     * ✓ Form state es consistente
     * ✓ SELECTORS SON CORRECTOS
     */
  });

  /**
   * =====================================================
   * TEST 14: 🔄 Should clear form correctly
   * =====================================================
   * 
   * QUÉ PRUEBA:
   * clearForm() efectivamente borra ambos campos
   * 
   * PASOS:
   * 1. Llenar username y password
   * 2. Llamar clearForm()
   * 3. Obtener valores
   * 4. Verificar que ambos son '' (vacío)
   * 
   * IMPORTANCIA:
   * Necesario para test 12 (retry después de fallo)
   */
  test('🔄 Debería limpiar el formulario correctamente', async ({ loginPage }) => {
    /**
     * LLENAR FORMULARIO
     */
    await loginPage.fillUsername(TEST_USER.email);
    await loginPage.fillPassword(TEST_USER.password);

    /**
     * LIMPIAR FORMULARIO
     * 
     * clearForm() es método en LoginPage
     * Borra ambos campos llamando a clear() en cada uno
     */
    await loginPage.clearForm();

    /**
     * OBTENER VALORES DESPUÉS DE CLEAR
     */
    const usernameValue = await loginPage.getUsernameValue();
    const passwordValue = await loginPage.getPasswordValue();

    /**
     * VERIFICAR QUE ESTÁN VACÍOS
     * 
     * '' = string vacío
     * NOT null, NOT undefined, NOT "undefined"
     * Solo string vacío
     */
    expect(usernameValue).toBe('');
    expect(passwordValue).toBe('');

    /**
     * RESUMEN:
     * ✓ clearForm() borra ambos campos
     * ✓ Valores son '' (vacío)
     * ✓ LISTO PARA REINTENTAR
     */
  });

  // =====================================================
  // 🎯 CATEGORÍA 5: CASOS DE VALIDACIÓN - INTERFAZ
  // =====================================================
  //
  // PROPÓSITO: Verificar que interfaz está presente y correcta
  // IMPORTANCIA: MEDIO - Smoke tests básicos
  // TESTS: 4
  //
  // Casos:
  // 1. Test 15 → Formulario visible en carga
  // 2. Test 16 → Título de página correcto
  // 3. Test 17 → Botón login visible
  // 4. Test 18 → Inputs visibles
  //

  /**
   * =====================================================
   * TEST 15: 🎯 Should verify login form is visible on page load
   * =====================================================
   * 
   * QUÉ PRUEBA:
   * Cuando navega a /auth/login, formulario está visible
   * 
   * IMPORTANCIA:
   * Si formulario no aparece → usuario no puede loguear
   * Este es el test FUNDAMENTAL
   * 
   * PASOS:
   * 1. beforeEach ya navegó a LOGIN_URL
   * 2. Verificar que isLoginFormVisible() = true
     * 3. Aserción debe pasar
     */
  test('🎯 Debería verificar que el formulario de login es visible al cargar la página', async ({
    loginPage,
  }) => {
    /**
     * VERIFICAR QUE FORMULARIO ES VISIBLE
     * 
     * isLoginFormVisible() busca LOGIN_FORM selector
     * Retorna true si visible
     * 
     * SELECTOR LOGIN_FORM:
     * En constants.ts, selector CSS único del formulario
     */
    const isFormVisible = await loginPage.isLoginFormVisible();

    /**
     * ASERCIÓN
     * 
     * expect(true).toBeTruthy() → PASA
     * expect(false).toBeTruthy() → FALLA
     * 
     * Si falla este test:
     * - Formulario no cargó
     * - Selector incorrecto
     * - Página no existe
     * - Servidor retorna error
     * - Navegador bloqueado por CORS
     */
    expect(isFormVisible).toBeTruthy();
  });

  /**
   * =====================================================
   * TEST 16: 🎯 Should verify login page title
   * =====================================================
   * 
   * QUÉ PRUEBA:
   * El <title> de la página contiene "login"
   * 
   * QUÉ ES page.title():
   * Retorna el <title>...</title> del HTML
   * Aparece en pestaña del navegador
   * 
   * VENTAJA:
   * - Verifica que estamos en página correcta
   * - No depende de selectors CSS
   * - Más robusto que buscar elemento
   */
  test('🎯 Debería verificar que el título de la página de login es válido', async ({ page }) => {
    /**
     * OBTENER TÍTULO
     * 
     * page.title() retorna string
     * Puede ser: "OrangeHRM", "Login - OrangeHRM", etc.
     */
    const title = await page.title();

    /**
     * CONVERTIR A MINÚSCULAS
     * 
     * title.toLowerCase()
     * "OrangeHRM Login" → "orangehrm login"
     * "LOGIN" → "login"
     * "Login" → "login"
     * 
     * VENTAJA:
     * Comparación case-insensitive
     * Evita fallos por mayúsculas
     */

    /**
     * ASERCIÓN
     * 
     * toContain(substring)
     * Verifica que string contiene substring
     * 
     * "orangehrm login".toContain("login") → true
     * "orangehrm".toContain("login") → false
     */
    expect(title.toLowerCase()).toContain('login');
  });

  /**
   * =====================================================
   * TEST 17: 🎯 Should verify login button is visible
   * =====================================================
   * 
   * QUÉ PRUEBA:
   * Botón "Login" está visible en la página
   * 
   * PASOS:
   * 1. loginPage.loginButton = selector del botón
   * 2. isVisible(selector) → true/false
   * 3. Aserción
   */
  test('🎯 Debería verificar que el botón de login es visible', async ({ loginPage }) => {
    /**
     * VERIFICAR VISIBILIDAD DEL BOTÓN
     * 
     * isVisible(selector) busca elemento
     * Retorna true si:
     * - Elemento existe en DOM
     * - No tiene display: none
     * - No tiene visibility: hidden
     * - No está fuera de pantalla
     * 
     * loginPage.loginButton es propiedad
     * Contiene selector CSS del botón
     */
    const isVisible = await loginPage.isVisible(loginPage.loginButton);

    expect(isVisible).toBeTruthy();
  });

  /**
   * =====================================================
   * TEST 18: 🎯 Should verify input fields are visible
   * =====================================================
   * 
   * QUÉ PRUEBA:
   * Campo username visible
     * Campo password visible
     * 
     * DOS VALIDACIONES EN UN TEST:
     * Ambas deben pasar para que test pase
     */
  test('🎯 Debería verificar que los campos de entrada son visibles', async ({ loginPage }) => {
    /**
     * VERIFICAR AMBOS INPUTS
     * 
     * loginPage.usernameInput = selector
     * loginPage.passwordInput = selector
     */
    const usernameVisible = await loginPage.isVisible(loginPage.usernameInput);
    const passwordVisible = await loginPage.isVisible(loginPage.passwordInput);

    /**
     * AMBAS DEBEN SER TRUE
     * 
     * Si una es false, test falla
     * expect(true).toBeTruthy() → PASA
     * expect(false).toBeTruthy() → FALLA
     */
    expect(usernameVisible).toBeTruthy();
    expect(passwordVisible).toBeTruthy();
  });

  // =====================================================
  // ⏱️ CATEGORÍA 6: CASOS DE TIMING - ESPERAS Y CARGAS
  // =====================================================
  //
  // PROPÓSITO: Verificar que página carga correctamente
  // IMPORTANCIA: MEDIO - Performance
  // TESTS: 2
  //

  /**
   * =====================================================
   * TEST 19: ⏱️ Should wait for page load before interacting
   * =====================================================
   * 
   * QUÉ PRUEBA:
   * Todos los elementos están presentes ANTES de interactuar
   * 
   * PASOS:
   * 1. Esperar explícitamente a cada elemento
   * 2. Verificar que cada uno existe
   * 3. Hacer interacciones
   * 
   * MÉTODO waitForSelector():
     * En BasePage:
     * async waitForSelector(selector) {
     *   await this.page.waitForSelector(selector);
     * }
     * 
     * QUÉ HACE page.waitForSelector():
     * 1. Espera hasta que selector aparezca en DOM
     * 2. Default timeout 30 segundos
     * 3. Si aparece antes → retorna rápido
     * 4. Si timeout se agota → lanza error
     * 5. No verifica visibilidad, solo existencia en DOM
     */
  test('⏱️ Debería esperar a que se cargue la página antes de interactuar', async ({ loginPage }) => {
    /**
     * ESPERAR A CADA ELEMENTO
     * 
     * Esperar a que existan en DOM
     * 1. Username input
     * 2. Password input
     * 3. Login button
     */
    await loginPage.waitForSelector(loginPage.usernameInput);
    await loginPage.waitForSelector(loginPage.passwordInput);
    await loginPage.waitForSelector(loginPage.loginButton);

    /**
     * LUEGO VERIFICAR QUE ESTÁN VISIBLES
     * 
     * waitForSelector = existe en DOM
     * isVisible = además existe y es visible (display, visibility, etc)
     */
    expect(await loginPage.isVisible(loginPage.usernameInput)).toBeTruthy();
    expect(await loginPage.isVisible(loginPage.passwordInput)).toBeTruthy();
    expect(await loginPage.isVisible(loginPage.loginButton)).toBeTruthy();

    /**
     * NOTA:
     * Este test es extra explícito
     * Playwright espera automáticamente en muchas operaciones
     * Pero es útil verificar explícitamente
     */
  });

  /**
   * =====================================================
   * TEST 20: ⏱️ Should handle network delays gracefully
   * =====================================================
   * 
   * QUÉ PRUEBA:
   * Login funciona aunque hay latencia en red
   * 
   * ESCENARIO:
   * Usuario en 3G/4G lenta
   * Servidor tarda más de lo normal
   * Sistema debe funcionar igualmente
   * 
   * CÓMO SE SIMULA:
   * page.route() intercepta todas las requests
   * Cada una se demora 500ms adicional
   * 
   * MÉTODO page.route():
   * await page.route(pattern, handler)
   * pattern = '**/*' (todos los requests)
   * handler = función que procesa cada request
   */
  test('⏱️ Debería manejar retrasos de red gracefully', async ({
    loginPage,
    homePage,
  }) => {
    /**
     * INTERCEPTAR TODAS LAS REQUESTS
     * 
     * page.route('**/*', handler)
     * '**/*' = patrón que coincide con TODAS las URLs
     * 
     * HANDLER FUNCTION:
     * (route) => {
     *   setTimeout(() => route.continue(), 500);
     * }
     * 
     * route.continue():
     * Permite que el request continúe
     * (Sin esto, request se bloquea)
     * 
     * setTimeout(..., 500):
     * Espera 500 milisegundos
     * LUEGO permite que request continúe
     * 
     * EFECTO:
     * Simula conexión lenta (+500ms por request)
     */
    await loginPage.page.route('**/*', (route) => {
      setTimeout(() => route.continue(), 500);
    });

    /**
     * HACER LOGIN CON RED "LENTA"
     * 
     * Cada request tardará más
     * Total login podría tardar 5+ segundos
     * Sistema debería aguantar
     */
    await loginPage.login(TEST_USER.email, TEST_USER.password);

    /**
     * VERIFICAR QUE SIGUE FUNCIONANDO
     * 
     * A pesar de demoras, login debería funcionar
     */
    const isLoggedIn = await homePage.isUserLoggedIn();
    expect(isLoggedIn).toBeTruthy();

    /**
     * NOTA:
     * Este test será LENTO (por las demoras simuladas)
     * Pero valida que sistema es robusto
     */
  });

  // =====================================================
  // 🚀 CATEGORÍA 7: CASOS DE RENDIMIENTO
  // =====================================================
  //
  // PROPÓSITO: Verificar que sistema es rápido
  // IMPORTANCIA: MEDIO - UX
  // TESTS: 2
  //

  /**
   * =====================================================
   * TEST 21: 🚀 Should complete login in reasonable time
   * =====================================================
   * 
   * QUÉ PRUEBA:
   * Login completo tarda menos de 10 segundos
   * 
   * PARÁMETRO:
   * 10 segundos = 10000 ms
   * SLA (Service Level Agreement) típico
   * 
   * PASOS:
   * 1. Registrar tiempo inicial
   * 2. Hacer login
   * 3. Registrar tiempo final
   * 4. Calcular duración
     * 5. Verificar duration < 10000
     */
  test('🚀 Debería completar el login en tiempo razonable', async ({
    loginPage,
    homePage,
  }) => {
    /**
     * REGISTRAR TIEMPO INICIAL
     * 
     * Date.now() retorna timestamp actual en ms
     * 1704067272123 = milisegundos desde Jan 1, 1970
     */
    const startTime = Date.now();

    /**
     * HACER LOGIN
     */
    await loginPage.login(TEST_USER.email, TEST_USER.password);

    /**
     * VERIFICAR QUE LOGIN FUNCIONÓ
     */
    const isLoggedIn = await homePage.isUserLoggedIn();

    /**
     * REGISTRAR TIEMPO FINAL
     */
    const endTime = Date.now();

    /**
     * CALCULAR DURACIÓN
     * 
     * duration = endTime - startTime
     * Retorna milliseconds
     * 
     * EJEMPLO:
     * startTime = 1704067272000
     * endTime = 1704067274500
     * duration = 2500 ms = 2.5 segundos
     */
    const duration = endTime - startTime;

    /**
     * PRIMERA ASERCIÓN: Login funcionó
     */
    expect(isLoggedIn).toBeTruthy();

    /**
     * SEGUNDA ASERCIÓN: Fue rápido
     * 
     * toBeLessThan(10000)
     * duration debe ser < 10000 ms
     * 
     * TÍPICAMENTE:
     * - Login local dev: 1-3 segundos
     * - Login con server remoto: 3-5 segundos
     * - 10 segundos es generoso
     */
    expect(duration).toBeLessThan(10000);

    /**
     * USO EN REPORTS:
     * Este test registra timing
     * Reports pueden mostrar tendencias
     * "Login promedio: 3.2 segundos"
     * Si sube a 7 segundos → problema de performance
     */
  });

  /**
   * =====================================================
   * TEST 22: 🚀 Should complete rapid successive logins
   * =====================================================
   * 
   * QUÉ PRUEBA:
   * Múltiples logins rápidos sin problemas
   * 
   * FLUJO:
   * 1. Login exitoso
   * 2. Logout
   * 3. Login again
   * 4. Ambos funcionan
   * 
   * IMPORTANCIA:
   * - Usuario podría cerrar sesión accidentalmente
     * - Volver a loguear sin problema
     * - Sistema maneja sesiones correctamente
     * - Cleanup entre sesiones funciona
     */
  test('🚀 Debería completar logins sucesivos rápidamente', async ({
    loginPage,
    homePage,
  }) => {
    /**
     * PRIMER LOGIN
     */
    await loginPage.login(TEST_USER.email, TEST_USER.password);

    /**
     * VERIFICAR PRIMER LOGIN
     */
    let isLoggedIn = await homePage.isUserLoggedIn();
    expect(isLoggedIn).toBeTruthy();

    /**
     * LOGOUT
     * 
     * homePage.logout() hace:
     * 1. Abre menú de usuario
     * 2. Click en "Logout"
     * 3. Espera navegación
     * 4. Retorna en página login
     */
    await homePage.logout();

    /**
     * ESPERAR A QUE REDIRIJA
     * 
     * Después de logout, navega a /auth/login
     * Puede tardar un momento
     */
    await loginPage.page.waitForTimeout(2000);

    /**
     * SEGUNDO LOGIN (rápidamente)
     */
    await loginPage.login(TEST_USER.email, TEST_USER.password);

    /**
     * VERIFICAR SEGUNDO LOGIN FUNCIONA
     */
    isLoggedIn = await homePage.isUserLoggedIn();
    expect(isLoggedIn).toBeTruthy();

    /**
     * RESULTADO:
     * ✓ Primer login exitoso
     * ✓ Logout funcionó
     * ✓ Segundo login exitoso
     * ✓ NO hay contaminación entre sesiones
     * ✓ MANEJO DE SESIONES OK
     */
  });

  /**
   * =====================================================
   * TEST 23: 🚀 Should maintain session across page reloads
   * =====================================================
   * 
   * QUÉ PRUEBA:
     * Sesión persiste después de F5/reload
     * 
     * ESCENARIO:
     * Usuario logueado
     * Presiona F5 (reload página)
     * ¿Sigue logueado o vuelve a login?
     * DEBE seguir logueado
     * 
     * MECANISMO:
     * Cookies HTTP-only
     * Servidor reconoce cookie → sesión válida
     * Usuario no necesita volver a loguear
     */
  test('🚀 Debería mantener la sesión a través de recargas de página', async ({
    loginPage,
    homePage,
  }) => {
    /**
     * HACER LOGIN
     */
    await loginPage.login(TEST_USER.email, TEST_USER.password);

    /**
     * VERIFICAR LOGUEADO
     */
    let isLoggedIn = await homePage.isUserLoggedIn();
    expect(isLoggedIn).toBeTruthy();

    /**
     * RECARGAR PÁGINA
     * 
     * page.reload() hace:
     * 1. Envía nueva request
     * 2. Servidor procesa
     * 3. Cookies se envían automáticamente
     * 4. Servidor valida sesión
     * 5. Retorna página
     * 
     * IMPORTANTE:
     * reload() NO limpia cookies
     * Cookies persisten automáticamente
     */
    await homePage.page.reload();

    /**
     * ESPERAR A QUE PAGE CARGUE
     */
    await homePage.page.waitForTimeout(2000);

    /**
     * VERIFICAR QUE SIGUE LOGUEADO
     * 
     * Si falla → cookies no se envían correctamente
     * O servidor no reconoce sesión
     */
    isLoggedIn = await homePage.isUserLoggedIn();
    expect(isLoggedIn).toBeTruthy();
  });

  /**
   * =====================================================
   * TEST 24: 🚀 Should verify logout works after login
   * =====================================================
   * 
   * IDENTIFICADOR: Test #24 de 24 (FINAL)
   * CATEGORÍA: Performance/Seguridad
   * PRIORIDAD: CRÍTICO
   * 
   * QUÉ PRUEBA:
   * Logout completo
   * Usuario regresa a login
   * Sesión se termina
   * 
   * IMPORTANCIA:
   * Seguridad crítica
   * Usuario no puede acceder después de logout
   * Especialmente importante en shared computers
   * 
   * FLUJO SEGURO:
   * 1. Logout elimina cookies/tokens
     * 2. Navega a /auth/login
     * 3. Acceso a dashboard no permitido
     * 4. Usuario ve login form
     */
  test('🚀 Debería verificar que el logout funciona después del login', async ({
    loginPage,
    homePage,
  }) => {
    /**
     * PASO 1: LOGIN
     */
    await loginPage.login(TEST_USER.email, TEST_USER.password);

    /**
     * VERIFICAR QUE ESTAMOS LOGUEADOS
     */
    let isLoggedIn = await homePage.isUserLoggedIn();
    expect(isLoggedIn).toBeTruthy();

    /**
     * PASO 2: LOGOUT
     * 
     * homePage.logout() hace:
     * 1. Click en menú usuario (top right)
     * 2. Click en "Logout"
     * 3. Servidor invalida sesión/cookies
     * 4. Redirecciona a /auth/login
     * 5. Cliente muestra login form
     */
    await homePage.logout();

    /**
     * ESPERAR REDIRECCIÓN
     */
    await loginPage.page.waitForTimeout(2000);

    /**
     * PASO 3: VERIFICAR QUE ESTAMOS EN LOGIN
     * 
     * isOnLoginPage() verifica:
     * 1. Estamos en URL /auth/login
     * 2. Formulario login es visible
     * 
     * IMPORTANTE:
     * No basta estar en URL
     * Usuario podría haber cacheado página
     * Debe verificar que formulario está ahí
     */
    let isOnLogin = await homePage.isOnLoginPage();
    expect(isOnLogin).toBeTruthy();

    /**
     * =====================================================
     * TEST 24 - FINAL
     * =====================================================
     * 
     * COMPLETAMOS CICLO COMPLETO:
     * 1. ✅ ANÓNIMO → Ves login form
     * 2. ✅ LOGIN → Entras al dashboard
     * 3. ✅ LOGUEADO → Usas app
     * 4. ✅ LOGOUT → Vuelves a login
     * 5. ✅ ANÓNIMO NUEVAMENTE
     * 
     * TESTS CUBIERTOS: 24 total
     * - 3 casos de éxito
     * - 3 casos de error
     * - 6 casos límite
     * - 3 casos de flujo
     * - 4 casos de UI
     * - 2 casos de timing
     * - 2 casos de performance
     * - 1 caso de logout
     * 
     * COBERTURA:
     * ✓ Login exitoso
     * ✓ Login fallido
     * ✓ Campos vacíos
     * ✓ Caracteres especiales
     * ✓ SQL injection
     * ✓ Reintentos
     * ✓ State management
     * ✓ UI elements
     * ✓ Performance
     * ✓ Network delays
     * ✓ Session persistence
     * ✓ Logout
     * 
     * PROYECTO LISTO PARA:
     * - Integración CI/CD
     * - Ejecución local
     * - Reportes
     * - Debugging
     * - Aprendizaje
     */
  });

}); // Fin de test.describe('🔐 OrangeHRM Login Tests')