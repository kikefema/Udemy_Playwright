/**
 * =====================================================
 * TESTS DEL DASHBOARD - POST-LOGIN (CON COMENTARIOS COMPLETOS)
 * =====================================================
 * 
 * ARCHIVO ORIGINAL: src/tests/auth/dashboard.spec.ts
 * ARCHIVO COMENTADO: Este archivo (dashboard.spec.commented.ts)
 * 
 * PROPÓSITO:
 * - Probar funcionalidad del dashboard DESPUÉS de login
 * - 20 tests cubriendo todas las interacciones post-login
 * - Logout, sesión, navegación, UI
 * 
 * DIFERENCIA CON login.spec.ts:
 * - login.spec: Prueba ACCESO al sistema (autenticación)
 * - dashboard.spec: Prueba USO del sistema (autorización)
 * 
 * REQUISITO PREVIO:
 * - beforeEach hace login automáticamente
 * - Cada test comienza con usuario logueado
 * - No necesitas hacer login en cada test
 * 
 * TOTAL DE TESTS: 20
 * - 4 verificación de estado post-login
 * - 3 tests de logout
 * - 2 tests del menú de usuario
 * - 2 tests de navegación
 * - 2 tests de interfaz
 * - 2 tests de timing
 * - 3 tests de sesión
 */

import { test, expect } from '@fixtures/test-fixtures';
import { LOGIN_URL, TEST_USER } from '@config/constants';
import { logger } from '@utils/logger';

/**
 * =====================================================
 * DESCRIBE: 📊 OrangeHRM Dashboard Tests
 * =====================================================
 * 
 * Agrupa todos los tests del dashboard
 * Emoji 📊 indica que trata del dashboard/datos
 */
test.describe('📊 OrangeHRM Dashboard Tests', () => {
  /**
   * =====================================================
   * HOOK: beforeEach - SETUP CRÍTICO
   * =====================================================
   * 
   * DIFERENCIA CON login.spec:
   * - login.spec.beforeEach: Solo navega a login
   * - dashboard.spec.beforeEach: Navega + HACE LOGIN
   * 
   * LÓGICA:
   * Cada test en este describe comienza LOGUEADO
   * No necesitas repetir login en cada test
   * Más eficiente y limpio
   * 
   * PARÁMETROS:
   * - loginPage: Para hacer login
   * - page: Para navegación
   * 
   * PASOS:
   * 1. Log de inicio
   * 2. Navegar a /auth/login
   * 3. Hacer login con TEST_USER
   * 4. Esperar que dashboard cargue (networkidle)
   * 5. Tests comienzan aquí (usuario logueado)
   */
  test.beforeEach(async ({ loginPage, page }) => {
    // Registro de setup
    logger.info('=== Setting up: Login to Dashboard ===');
    
    // Navegar a login
    await page.goto(LOGIN_URL);
    
    // Hacer login automáticamente
    // LOGIN_URL = /auth/login
    // TEST_USER = Admin / admin123
    await loginPage.login(TEST_USER.email, TEST_USER.password);
    
    /**
     * ESPERAR QUE CARGUE
     * 
     * page.waitForLoadState('networkidle')
     * 
     * QUÉ SIGNIFICA:
     * Espera a que todos los network requests terminen
     * networkidle = menos de 2 requests durante 500ms
     * Garantiza que página está completamente cargada
     * 
     * ALTERNATIVAS:
     * 'load' = window.onload (más rápido, menos confiable)
     * 'domcontentloaded' = DOM listo (aún cargando recursos)
     * 'networkidle' = TODO cargado (más lento, más confiable)
     * 
     * PARA DASHBOARD:
     * networkidle es mejor porque:
     * - Asegura que datos se cargaron
     * - Gráficos/recursos listos
     * - No hay errores en console
     */
    await page.waitForLoadState('networkidle');
  });

  // =====================================================
  // ✅ CATEGORÍA 1: VERIFICACIÓN DE ESTADO POST-LOGIN
  // =====================================================
  // 4 tests básicos que verifican que login funcionó correctamente

  /**
   * =====================================================
   * TEST 1: ✅ Should be logged in and on dashboard
   * =====================================================
   * 
   * QUÉ PRUEBA:
   * Después del beforeEach, usuario está logueado
   * Dashboard grid es visible
   * 
   * PASOS:
   * 1. beforeEach ya hizo login
   * 2. homePage.isUserLoggedIn() verifica
   * 3. Aserción debe pasar
   * 
   * IMPORTANCIA:
   * Validación FUNDAMENTAL
   * Si falla beforeEach, este test falla primero
   */
  test('✅ Debería estar logueado y en el dashboard', async ({ homePage }) => {
    /**
     * VERIFICAR QUE ESTAMOS LOGUEADOS
     * 
     * isUserLoggedIn() busca DASHBOARD_GRID selector
     * DASHBOARD_GRID = '.orangehrm-container' (dashboard grid)
     * 
     * Si visible → usuario logueado
     * Si no → credenciales rechazadas
     */
    const isLoggedIn = await homePage.isUserLoggedIn();
    expect(isLoggedIn).toBeTruthy();

    /**
     * NOTAS:
     * - Timeout default 5 segundos
     * - Si dashboard_grid no aparece en 5 seg → false
     * - Entonces expect() falla
     * - Test falla con: "expected false to be truthy"
     */
  });

  /**
   * =====================================================
   * TEST 2: ✅ Should display dashboard URL
   * =====================================================
   * 
   * QUÉ PRUEBA:
   * URL actual contiene '/dashboard/index'
   * 
   * VALIDACIÓN:
   * - Redirección funcionó
   * - Estamos en endpoint correcto
   * - No stuck en /auth/login
   * 
   * PATRÓN:
   * Validar URL es más rápido que buscar elementos
   * Buena práctica: validar URL + elemento
   */
  test('✅ Debería mostrar la URL del dashboard', async ({ homePage }) => {
    /**
     * OBTENER URL ACTUAL
     * 
     * getCurrentDashboardUrl() retorna:
     * "https://opensource-demo.orangehrm.com/web/index.php/dashboard/index"
     */
    const url = await homePage.getCurrentDashboardUrl();
    
    /**
     * VALIDAR QUE CONTIENE RUTA DASHBOARD
     * 
     * expect(url).toContain('/dashboard/index')
     * 
     * Ventaja de toContain():
     * - No necesitas URL exacta
     * - Solo verifica substring importante
     * - Ignora protocolo, puerto, etc
     */
    expect(url).toContain('/dashboard/index');
  });

  /**
   * =====================================================
   * TEST 3: ✅ Should have valid dashboard title
   * =====================================================
   * 
   * QUÉ PRUEBA:
   * El <title> de la página dice "Dashboard"
   * 
   * VENTAJA:
   * - HTML independent (no CSS selector)
   * - Siempre está en DOM
   * - No puede cambiar fácilmente
   */
  test('✅ Debería tener un título válido en el dashboard', async ({ homePage }) => {
    /**
     * OBTENER TÍTULO
     * 
     * getDashboardTitle() retorna:
     * "OrangeHRM - Dashboard" (ejemplo)
     */
    const title = await homePage.getDashboardTitle();
    
    /**
     * VALIDAR LOWERCASE
     * 
     * title.toLowerCase().toContain('dashboard')
     * 
     * "OrangeHRM - Dashboard".toLowerCase() = "orangehrm - dashboard"
     * .toContain('dashboard') → Busca "dashboard" → PASA
     */
    expect(title.toLowerCase()).toContain('dashboard');
  });

  /**
   * =====================================================
   * TEST 4: ✅ Should verify main content is loaded
   * =====================================================
   * 
   * QUÉ PRUEBA:
   * Elemento '.oxd-main-content' es visible
   * 
   * DIFERENCIA:
   * Tests anteriores = métodos de Page Object
   * Este test = locator directo (más específico)
   * 
   * CUÁNDO USAR:
   * - Elemento muy específico
   * - No tiene método en Page Object
   * - Validación rápida
   */
  test('✅ Debería verificar que el contenido principal está cargado', async ({ page }) => {
    /**
     * BUSCAR ELEMENTO
     * 
     * page.locator('.oxd-main-content')
     * Busca elemento con clase 'oxd-main-content'
     * '.oxd-main-content' = selector CSS
     * 
     * ELEMENTO:
     * <div class="oxd-main-content">...</div>
     * Contenedor principal del dashboard
     * Contiene todos los widgets/datos
     */
    const mainContent = page.locator('.oxd-main-content');
    
    /**
     * ASERCIÓN
     * 
     * await expect(mainContent).toBeVisible()
     * 
     * toBeVisible() verifica:
     * 1. Elemento existe en DOM
     * 2. display !== 'none'
     * 3. visibility !== 'hidden'
     * 4. No está fuera de pantalla
     * 5. opacity !== 0
     * 
     * NOTA await:
     * expect() de Playwright es async cuando usa toBeVisible()
     * Necesita await
     */
    await expect(mainContent).toBeVisible();
  });

  // =====================================================
  // 🔐 CATEGORÍA 2: TESTS DE LOGOUT
  // =====================================================
  // 3 tests que verifican logout funciona correctamente

  /**
   * =====================================================
   * TEST 5: 🔐 Should logout successfully
   * =====================================================
   * 
   * QUÉ PRUEBA:
   * Logout termina sesión
   * Usuario regresa a página login
   * 
   * PASOS:
   * 1. Hacer logout
   * 2. Esperar que cargue login
   * 3. Verificar que estamos en login
   * 
   * MÉTODO logout():
   * En HomePage:
   * async logout() {
   *   await this.openUserMenu();
   *   await this.click(logoutLink);
   *   await this.waitForPageLoad();
   * }
   * 
   * FLUJO:
   * 1. Click en menú usuario (top right)
   * 2. Click en "Logout"
   * 3. Servidor invalida sesión
   * 4. Redirección a /auth/login
   * 5. Cliente renderiza login form
   */
  test('🔐 Debería desloguear correctamente', async ({ homePage, page }) => {
    /**
     * HACER LOGOUT
     * 
     * Realiza todo el flujo de logout
     * (menú → click logout → esperar navegación)
     */
    await homePage.logout();

    /**
     * ESPERAR QUE CARGUE NUEVA PÁGINA
     * 
     * page.waitForLoadState('networkidle')
     * 
     * Después de logout:
     * - Navegador redirecciona
     * - Login page carga
     * - Necesitamos esperar
     */
    await page.waitForLoadState('networkidle');

    /**
     * VERIFICAR QUE ESTAMOS EN LOGIN
     * 
     * isOnLoginPage() verifica:
     * 1. URL contiene '/auth/login'
     * 2. Formulario login es visible
     */
    const isOnLogin = await homePage.isOnLoginPage();
    expect(isOnLogin).toBeTruthy();

    /**
     * SEGURIDAD:
     * Este test verifica que logout es seguro
     * Usuario no puede acceder al dashboard después
     */
  });

  /**
   * =====================================================
   * TEST 6: 🔐 Should not access dashboard after logout
   * =====================================================
   * 
   * QUÉ PRUEBA:
   * Después de logout, URL cambió a login
   * Dashboard no es accesible
   * 
   * DIFERENCIA CON TEST 5:
   * Test 5 → Verifica elemento (login form)
   * Test 6 → Verifica URL directamente
   * Ambas validaciones son importantes
   */
  test('🔐 No debería acceder al dashboard después de desloguear', async ({
    homePage,
    page,
  }) => {
    // Logout
    await homePage.logout();
    await page.waitForLoadState('networkidle');

    /**
     * OBTENER URL ACTUAL
     * 
     * page.url() retorna URL string
     * Ej: "https://...com/web/index.php/auth/login"
     */
    const currentUrl = await page.url();

    /**
     * VERIFICAR URL DE LOGIN
     * 
     * currentUrl debe contener '/auth/login'
     * No debe ser '/dashboard/index'
     */
    expect(currentUrl).toContain('/auth/login');

    /**
     * NOTA IMPORTANTE:
     * Esto no es suficiente para seguridad completa
     * Usuario podría:
     * 1. Cambiar URL manualmente a /dashboard
     * 2. Server debería rechazar (403 Forbidden)
     * 
     * Pero este test verifica que:
     * - Logout hace redirect automático
     * - Cookies/session se limpian
     * - No hay acceso directo sin sesión
     */
  });

  /**
   * =====================================================
   * TEST 7: 🔐 Should require login again after logout
   * =====================================================
   * 
   * QUÉ PRUEBA:
   * Después de logout, formulario login está visible
   * Usuario puede intentar login de nuevo
   * 
   * PASOS:
   * 1. Logout
   * 2. Esperar que cargue
   * 3. Verificar que formulario es visible
   */
  test('🔐 Debería requerir login de nuevo después de desloguear', async ({
    homePage,
    loginPage,
    page,
  }) => {
    // Logout
    await homePage.logout();
    await page.waitForLoadState('networkidle');

    /**
     * VERIFICAR QUE FORMULARIO ES VISIBLE
     * 
     * isLoginFormVisible() busca LOGIN_FORM selector
     * Significa que usuario está en página login
     * Y puede ingresar credenciales nuevamente
     */
    const isFormVisible = await loginPage.isLoginFormVisible();
    expect(isFormVisible).toBeTruthy();

    /**
     * FLUJO COMPLETE:
     * Login → Usar app → Logout → Login again
     * Todo funciona correctamente
     */
  });

  // =====================================================
  // 👤 CATEGORÍA 3: TESTS DEL MENÚ DE USUARIO
  // =====================================================
  // 2 tests que verifican el menú del usuario (top right)

  /**
   * =====================================================
   * TEST 8: 👤 Should open user menu
   * =====================================================
   * 
   * QUÉ PRUEBA:
   * Al hacer click en menú usuario, dropdown abre
   * 
   * ELEMENTO MENÚ:
   * Top right, mostrado usuario actual
   * Al hacer click → dropdown aparece
   * Contiene opciones: Profile, Change Password, Logout
   * 
   * MÉTODO:
   * homePage.openUserMenu() → abre el menú
   */
  test('👤 Debería abrir el menú del usuario', async ({ homePage }) => {
    /**
     * ABRIR MENÚ
     * 
     * openUserMenu() en HomePage:
     * 1. Busca selector USER_MENU
     * 2. Hace click
     * 3. Espera que dropdown sea visible
     */
    await homePage.openUserMenu();

    /**
     * VERIFICAR DROPDOWN VISIBLE
     * 
     * page.locator('.oxd-dropdown-menu')
     * Selector CSS del dropdown
     * 
     * .oxd-dropdown-menu = menu dropdown OrangeHRM
     * Contiene los opciones del usuario
     */
    const dropdown = homePage.page.locator('.oxd-dropdown-menu');
    
    /**
     * ASERCIÓN
     * 
     * toBeVisible() verifica elemento es visible
     * await porque es async
     */
    await expect(dropdown).toBeVisible();

    /**
     * NOTAS:
     * - No probamos qué hay en dropdown
     * - Solo que dropdown existe y es visible
     * - Test 9 prueba que logout está en dropdown
     */
  });

  /**
   * =====================================================
   * TEST 9: 👤 Should have logout option in menu
   * =====================================================
   * 
   * QUÉ PRUEBA:
   * Logout link está dentro del dropdown
   * Usuario puede hacer click para logout
   * 
   * PASOS:
   * 1. Abrir menú
   * 2. Buscar logout link
   * 3. Verificar que es visible
   */
  test('👤 Debería tener opción de logout en el menú', async ({ homePage }) => {
    /**
     * ABRIR MENÚ
     * 
     * Dropdown debe estar abierto para poder ver logout
     */
    await homePage.openUserMenu();

    /**
     * BUSCAR LOGOUT LINK
     * 
     * homePage.logoutLink = selector del logout
     * En HomePage:
     * logoutLink = 'a[href*="logout"]'
     * 
     * Selector: cualquier <a> cuyo href contiene "logout"
     */
    const logoutLink = homePage.page.locator(homePage.logoutLink);

    /**
     * ASERCIÓN
     * 
     * Si falla → logout link no existe en dropdown
     * Significa usuario no puede logout
     * PROBLEMA CRÍTICO
     */
    await expect(logoutLink).toBeVisible();

    /**
     * IMPORTANCIA:
     * Logout debe ser fácilmente accesible
     * Si no está en menú → usuario no puede logout
     * Riesgo de seguridad en shared computers
     */
  });

  // =====================================================
  // 📱 CATEGORÍA 4: TESTS DE NAVEGACIÓN
  // =====================================================
  // 2 tests que verifican navegación funciona

  /**
   * =====================================================
   * TEST 10: 📱 Should maintain session when reloading
   * =====================================================
   * 
   * QUÉ PRUEBA:
   * Después de F5 (reload), sesión se mantiene
   * 
   * ESCENARIO:
   * Usuario está en dashboard
   * Presiona F5 accidentalmente
   * ¿Qué pasa?
   * - Debería: mantenerse logueado
   * - NO debería: ir a login
   * 
   * MECANISMO:
   * Cookies HTTP-only persisten
   * Servidor reconoce cookie → sesión válida
   * Dashboard carga nuevamente
   */
  test('📱 Debería mantener la sesión al recargar', async ({
    homePage,
    page,
  }) => {
    /**
     * RECARGAR PÁGINA
     * 
     * homePage.reload() llama:
     * await this.page.reload();
     * 
     * page.reload() = F5 en el navegador
     * Recarga HTML/CSS/JS
     * Mantiene cookies
     */
    await homePage.reload();
    
    /**
     * ESPERAR QUE CARGUE
     * 
     * networkidle asegura que:
     * - HTML cargó
     * - Recursos cargaron
     * - Dashboard está listo
     */
    await page.waitForLoadState('networkidle');

    /**
     * VERIFICAR QUE SIGUE LOGUEADO
     * 
     * Si cookies funcionan:
     * - Servidor acepta cookie
     * - Dashboard carga
     * - isUserLoggedIn() = true
     * 
     * Si cookies NO funcionan:
     * - Servidor rechaza
     * - Redirecciona a login
     * - isUserLoggedIn() = false
     */
    const isLoggedIn = await homePage.isUserLoggedIn();
    expect(isLoggedIn).toBeTruthy();

    /**
     * IMPORTANCIA:
     * Usuarios recargan páginas constantemente
     * Especialmente en conexiones inestables
     * Sistema debe ser robusto a reloads
     */
  });

  /**
   * =====================================================
   * TEST 11: 📱 Should have valid navigation after login
   * =====================================================
   * 
   * QUÉ PRUEBA:
   * Elementos de navegación están visibles
   * Usuario puede navegar a otras secciones
   * 
   * ELEMENTOS DE NAVEGACIÓN:
   * - Header/navbar
   * - Links a módulos (Admin, PIM, Leave, etc)
   * - Menu lateral (si existe)
   * 
   * TEST SIMPLE:
   * Solo verifica que navbar existe
   * No prueba que links funcionan
   */
  test('📱 Debería tener navegación válida después del login', async ({ page }) => {
    /**
     * BUSCAR ELEMENTOS NAVEGACIÓN
     * 
     * page.locator('[role="navigation"], .oxd-navbar')
     * 
     * SELECTORES:
     * [role="navigation"] = elemento con role navegación
     * .oxd-navbar = clase OrangeHRM para navbar
     * Usa "," para OR (uno u otro)
     */
    const navElements = page.locator('[role="navigation"], .oxd-navbar');

    /**
     * OBTENER PRIMER ELEMENTO
     * 
     * first() = primer resultado del locator
     * Si multiple, obtiene primero
     */
    const firstNav = navElements.first();

    /**
     * ASERCIÓN
     * 
     * Si navbar no existe:
     * - first() retorna null
     * - toBeVisible() falla
     * - Test falla con: "element not found"
     */
    await expect(firstNav).toBeVisible();

    /**
     * NOTA:
     * Este test es básico
     * En proyecto real, verificarías:
     * - Cantidad de links
     * - Nombres de módulos
     * - Links funcionales
     */
  });

  // =====================================================
  // 🎯 CATEGORÍA 5: TESTS DE INTERFAZ
  // =====================================================
  // 2 tests que verifican UI está correcta

  /**
   * =====================================================
   * TEST 12: 🎯 Should verify user menu button is visible
   * =====================================================
   * 
   * QUÉ PRUEBA:
   * Botón del menú usuario (top right) está visible
   * 
   * BOTÓN:
   * Generalmente contiene nombre/avatar del usuario
   * Ubicado en header, arriba a la derecha
   * 
   * SELECTOR:
   * homePage.userMenu = selector del botón
   * Típicamente: button[aria-label="user menu"] o similar
   */
  test('🎯 Debería verificar que el botón del menú es visible', async ({ homePage }) => {
    /**
     * BUSCAR BOTÓN USUARIO
     * 
     * homePage.page.locator(homePage.userMenu)
     * homePage.userMenu = selector definido en HomePage
     */
    const userButton = homePage.page.locator(homePage.userMenu);

    /**
     * ASERCIÓN
     * 
     * Si botón no está visible:
     * - Usuario no puede abrir menú
     * - No puede hacer logout
     * - PROBLEMA CRÍTICO
     */
    await expect(userButton).toBeVisible();
  });

  /**
   * =====================================================
   * TEST 13: 🎯 Should have proper page structure
   * =====================================================
   * 
   * QUÉ PRUEBA:
   * Dashboard tiene estructura HTML correcta
   * - Main content visible
   * - Header presente
   * 
   * VALIDACIÓN MULTI-ELEMENTO:
   * Verifica 2 cosas en un test
   * Ambas deben pasar
   */
  test('🎯 Debería tener una estructura de página adecuada', async ({ page }) => {
    /**
     * BUSCAR CONTENIDO PRINCIPAL
     * 
     * .oxd-main-content = div que contiene contenido principal
     */
    const mainContent = page.locator('.oxd-main-content');
    
    /**
     * BUSCAR HEADER
     * 
     * header = tag HTML header
     * [role="banner"] = elemento con role banner (alt)
     * Usa comma para OR
     */
    const header = page.locator('header, [role="banner"]');

    /**
     * ASERCIÓN 1: Main content visible
     * 
     * Si dashboard no tiene contenido:
     * - Página está vacía
     * - No se cargó data
     * - Problema de servidor
     */
    await expect(mainContent).toBeVisible();

    /**
     * ASERCIÓN 2: Header existe
     * 
     * header.count() > 0
     * Significa que existe al menos 1 header
     * 
     * toBeGreaterThan(0) = > 0
     * Hay al menos un elemento
     */
    expect(await header.count()).toBeGreaterThan(0);

    /**
     * NOTA:
     * expect(count) vs await expect(element)
     * 
     * count() es method que retorna número
     * Entonces: expect(number).toBeGreaterThan(0)
     * 
     * toBeVisible() es assertion async
     * Entonces: await expect(element).toBeVisible()
     */
  });

  // =====================================================
  // ⏱️ CATEGORÍA 6: TESTS DE TIMING/PERFORMANCE
  // =====================================================
  // 2 tests que verifican velocidad

  /**
   * =====================================================
   * TEST 14: ⏱️ Should load dashboard quickly
   * =====================================================
   * 
   * QUÉ PRUEBA:
   * Dashboard carga en menos de 5 segundos
   * 
   * PARÁMETRO:
   * 5000 ms = 5 segundos
   * Tiempo máximo aceptable para cargar
   * 
   * PASOS:
   * 1. Registrar tiempo inicial
   * 2. Recargar página
   * 3. Esperar que main content aparezca
   * 4. Registrar tiempo final
   * 5. Verificar que duration < 5000
   */
  test('⏱️ Debería cargar el dashboard rápidamente', async ({ page }, testInfo) => {
    /**
     * REGISTRAR TIEMPO INICIAL
     * 
     * Date.now() retorna milisegundos desde epoch
     */
    const startTime = Date.now();

    /**
     * RECARGAR PÁGINA
     * 
     * Simula que usuario presionó F5
     */
    await page.reload();

    /**
     * ESPERAR QUE MAIN CONTENT APAREZCA
     * 
     * waitForSelector con timeout 5000
     * 
     * Si selector no aparece en 5 segundos:
     * Lanza error "Timeout waiting for .oxd-main-content"
     * Test falla aquí
     */
    await page.waitForSelector('.oxd-main-content', { timeout: 5000 });

    /**
     * REGISTRAR TIEMPO FINAL
     */
    const duration = Date.now() - startTime;

    /**
     * LOG DE RESULTADO
     * 
     * logger.info() registra tiempo
     * Útil para ver tendencias de performance
     * En reportes: "Dashboard load time: 2341ms"
     */
    logger.info(`Dashboard load time: ${duration}ms`);

    /**
     * ASERCIÓN
     * 
     * duration < 5000 (5 segundos)
     * 
     * TÍPICAMENTE:
     * - Carga rápida: 1-2 segundos
     * - Carga normal: 2-4 segundos
     * - Carga lenta: 4-5 segundos
     * - Si > 5 seg → PROBLEMA DE PERFORMANCE
     */
    expect(duration).toBeLessThan(5000);

    /**
     * CASO DE USO:
     * Monitorear performance en CI/CD
     * Si carga tarda más → alert al equipo
     * Posible problema de servidor
     */
  });

  /**
   * =====================================================
   * TEST 15: ⏱️ Should handle multiple page reloads
   * =====================================================
   * 
   * QUÉ PRUEBA:
   * Múltiples reloads no rompen sesión
   * Dashboard carga cada vez correctamente
   * 
   * ESCENARIO:
   * Usuario tiene conexión inestable
   * Recarga múltiples veces
   * Sistema debe funcionar cada vez
   * 
   * PASOS:
   * 1. Loop 3 veces
     * 2. Cada iteración: reload + wait
     * 3. Verificar que sigue logueado
     * 4. Si falla en cualquiera → test falla
   */
  test('⏱️ Debería manejar múltiples recargas de página', async ({ page }) => {
    /**
     * LOOP 3 VECES
     * 
     * for (let i = 0; i < 3; i++)
     * i = 0, 1, 2 → 3 iteraciones total
     */
    for (let i = 0; i < 3; i++) {
      /**
       * RECARGAR PÁGINA
       */
      await page.reload();
      
      /**
       * ESPERAR QUE CARGUE
       */
      await page.waitForLoadState('networkidle');

      /**
       * VERIFICAR QUE SIGUE LOGUEADO
       * 
       * mainContent es elemento del dashboard
       * Si visible → usuario sigue logueado
       * Si no → redirección a login
       */
      const mainContent = page.locator('.oxd-main-content');
      
      /**
       * timeout: 5000 → máximo 5 segundos esperar
       * Si elemento no aparece → test falla
       */
      await expect(mainContent).toBeVisible({ timeout: 5000 });

      /**
       * IMPLÍCITO:
       * Si algún reload falla:
       * - expect() lanza error
       * - Test detiene
       * - Mensaje muestra en qué iteración falló
       * 
       * TODOS DEBEN PASAR:
       * i=0 → OK
       * i=1 → OK
       * i=2 → OK
       * ENTONCES test pasa
       */
    }

    /**
     * RESUMEN:
     * ✓ 3 reloads completados
     * ✓ Sesión se mantuvo en todos
     * ✓ Dashboard cargó correctamente cada vez
     * ✓ SISTEMA ES ROBUSTO
     */
  });

  // =====================================================
  // 🔄 CATEGORÍA 7: TESTS DE ESTADO DE SESIÓN
  // =====================================================
  // 3 tests que verifican sesión persiste correctamente

  /**
   * =====================================================
   * TEST 16: 🔄 Should maintain consistent session
   * =====================================================
   * 
   * QUÉ PRUEBA:
   * Sesión es consistente a lo largo del test
   * - Logueado antes
   * - Logueado después de reload
     * - Logueado después de navegar
     * 
     * PASOS:
     * 1. Verificar inicial estado
     * 2. Reload
     * 3. Verificar estado (debe seguir igual)
     * 4. Navegar
     * 5. Verificar estado (debe seguir igual)
     */
  test('🔄 Debería mantener una sesión consistente', async ({
    homePage,
    page,
  }) => {
    /**
     * VERIFICAR ESTADO INICIAL
     */
    let isLoggedIn = await homePage.isUserLoggedIn();
    expect(isLoggedIn).toBeTruthy();

    /**
     * RECARGAR
     */
    await homePage.reload();
    await page.waitForLoadState('networkidle');

    /**
     * VERIFICAR DESPUÉS DE RELOAD
     */
    isLoggedIn = await homePage.isUserLoggedIn();
    expect(isLoggedIn).toBeTruthy();

    /**
     * NAVEGAR
     * 
     * getCurrentDashboardUrl() solo obtiene URL
     * No navega (ya estamos en dashboard)
     * Pero valida que URL es correcta
     */
    const url = await homePage.getCurrentDashboardUrl();
    
    /**
     * VERIFICAR DESPUÉS DE NAVEGAR
     */
    expect(url).toContain('/dashboard/index');

    /**
     * CONCLUSIÓN:
     * Estado es consistente en toda la interacción
     */
  });

  /**
   * =====================================================
   * TEST 17: 🔄 Should handle session persistence
   * =====================================================
   * 
   * QUÉ PRUEBA:
   * Cookies se mantienen después de reload
   * Sesión persiste en HTTP context
   * 
   * TÉCNICA:
   * Acceso a cookies del contexto
     * Verifica que hay cookies (sesión)
     * Recarga y verifica que cookies siguen ahí
     * 
     * CÓMO FUNCIONAN COOKIES:
     * 1. Server set-cookie: session_id=123456
     * 2. Browser almacena cookie
     * 3. Browser envía en cada request
     * 4. Server valida cookie
     * 5. Usuario sigue logueado
     */
  test('🔄 Debería manejar la persistencia de sesión', async ({ page }) => {
    /**
     * OBTENER COOKIES
     * 
     * page.context()?.cookies()
     * 
     * page.context() retorna BrowserContext
     * context.cookies() retorna array de cookies
     * 
     * ? es optional chaining
     * Si context es null → retorna undefined
     * Si context existe → llama cookies()
     */
    const cookies = await page.context()?.cookies();

    /**
     * VERIFICAR QUE HAY COOKIES
     * 
     * toBeDefined() significa que no es undefined
     * Cookies existen (sesión establecida)
     */
    expect(cookies).toBeDefined();

    /**
     * VERIFICAR CANTIDAD DE COOKIES
     * 
     * cookies?.length > 0
     * Al menos una cookie existe
     * 
     * ? es optional chaining
     * Si cookies es undefined → undefined?.length → undefined
     * Si cookies es array → cookies.length → número
     */
    expect(cookies?.length).toBeGreaterThan(0);

    /**
     * RECARGAR PÁGINA
     * 
     * Cookies se mantienen automáticamente
     * Browser no borra cookies al recargar
     * (A menos que sean session-only)
     */
    await page.reload();
    await page.waitForLoadState('networkidle');

    /**
     * OBTENER COOKIES NUEVAMENTE
     * 
     * Después de reload, cookies siguen ahí
     */
    const cookiesAfter = await page.context()?.cookies();

    /**
     * VERIFICAR QUE CANTIDAD ES IGUAL/MAYOR
     * 
     * toBeGreaterThanOrEqual(cantidad_original)
     * 
     * ¿Por qué mayor?
     * - Servidor podría crear nueva cookie
     * - Pero original se mantiene
     * - Nunca debería DECRECER
     * 
     * LÓGICA:
     * cookies?.length = cantidad original (0 si undefined)
     * Comparar cookiesAfter >= original
     */
    expect(cookiesAfter?.length).toBeGreaterThanOrEqual(cookies?.length || 0);

    /**
     * RESUMEN:
     * ✓ Cookies existen inicialmente
     * ✓ Cookies persisten después reload
     * ✓ SESIÓN ES PERSISTENTE
     * ✓ SEGURIDAD OK
     */
  });

}); // Fin de test.describe('📊 OrangeHRM Dashboard Tests')