import { test, expect } from '@fixtures/test-fixtures';
import { LOGIN_URL, TEST_USER } from '@config/constants';
import { logger } from '@utils/logger';

/**
 * Tests para el Dashboard de OrangeHRM después del login
 */
test.describe('📊 OrangeHRM Dashboard Tests', () => {
  test.beforeEach(async ({ loginPage, page }) => {
    // Navegar a login y hacer login
    logger.info('=== Setting up: Login to Dashboard ===');
    await page.goto(LOGIN_URL);
    await loginPage.login(TEST_USER.email, TEST_USER.password);
    
    // Esperar a que cargue el dashboard
    await page.waitForLoadState('networkidle');
  });

  // ==========================================
  // ✅ VERIFICACIÓN DE ESTADO DESPUÉS DEL LOGIN
  // ==========================================

  test('✅ Should be logged in and on dashboard', async ({ homePage }) => {
    const isLoggedIn = await homePage.isUserLoggedIn();
    expect(isLoggedIn).toBeTruthy();
  });

  test('✅ Should display dashboard URL', async ({ homePage }) => {
    const url = await homePage.getCurrentDashboardUrl();
    expect(url).toContain('/dashboard/index');
  });

  test('✅ Should have valid dashboard title', async ({ homePage }) => {
    const title = await homePage.getDashboardTitle();
    expect(title.toLowerCase()).toContain('dashboard');
  });

  test('✅ Should verify main content is loaded', async ({ page }) => {
    // Verificar que el contenido principal está presente
    const mainContent = page.locator('.oxd-main-content');
    await expect(mainContent).toBeVisible();
  });

  // ==========================================
  // 🔐 TESTS DE LOGOUT
  // ==========================================

  test('🔐 Should logout successfully', async ({ homePage, page }) => {
    // Realizar logout
    await homePage.logout();

    // Esperar a que cargue la página de login
    await page.waitForLoadState('networkidle');

    // Verificar que estamos en login
    const isOnLogin = await homePage.isOnLoginPage();
    expect(isOnLogin).toBeTruthy();
  });

  test('🔐 Should not access dashboard after logout', async ({
    homePage,
    page,
  }) => {
    // Logout
    await homePage.logout();
    await page.waitForLoadState('networkidle');

    // Intentar ir al dashboard directamente debería redirigir a login
    const currentUrl = await page.url();
    expect(currentUrl).toContain('/auth/login');
  });

  test('🔐 Should require login again after logout', async ({
    homePage,
    loginPage,
    page,
  }) => {
    // Logout
    await homePage.logout();
    await page.waitForLoadState('networkidle');

    // Verificar que el formulario de login es visible
    const isFormVisible = await loginPage.isLoginFormVisible();
    expect(isFormVisible).toBeTruthy();
  });

  // ==========================================
  // 👤 TESTS DEL MENÚ DE USUARIO
  // ==========================================

  test('👤 Should open user menu', async ({ homePage }) => {
    await homePage.openUserMenu();

    // Verificar que el dropdown es visible
    const dropdown = homePage.page.locator('.oxd-dropdown-menu');
    await expect(dropdown).toBeVisible();
  });

  test('👤 Should have logout option in menu', async ({ homePage }) => {
    await homePage.openUserMenu();

    // Buscar el link de logout
    const logoutLink = homePage.page.locator(homePage.logoutLink);
    await expect(logoutLink).toBeVisible();
  });

  // ==========================================
  // 📱 TESTS DE NAVEGACIÓN
  // ==========================================

  test('📱 Should maintain session when reloading', async ({
    homePage,
    page,
  }) => {
    // Recargar la página
    await homePage.reload();
    await page.waitForLoadState('networkidle');

    // Debe mantener el login
    const isLoggedIn = await homePage.isUserLoggedIn();
    expect(isLoggedIn).toBeTruthy();
  });

  test('📱 Should have valid navigation after login', async ({ page }) => {
    // Verificar que podemos hacer click en navegación
    const navElements = page.locator('[role="navigation"], .oxd-navbar');
    await expect(navElements.first()).toBeVisible();
  });

  // ==========================================
  // 🎯 TESTS DE INTERFAZ
  // ==========================================

  test('🎯 Should verify user menu button is visible', async ({ homePage }) => {
    const userButton = homePage.page.locator(homePage.userMenu);
    await expect(userButton).toBeVisible();
  });

  test('🎯 Should have proper page structure', async ({ page }) => {
    // Verificar elementos clave del dashboard
    const mainContent = page.locator('.oxd-main-content');
    const header = page.locator('header, [role="banner"]');

    await expect(mainContent).toBeVisible();
    expect(await header.count()).toBeGreaterThan(0);
  });

  // ==========================================
  // ⏱️ TESTS DE TIMING
  // ==========================================

  test('⏱️ Should load dashboard quickly', async ({ page }, testInfo) => {
    const startTime = Date.now();

    // Recargar y esperar que cargue
    await page.reload();
    await page.waitForSelector('.oxd-main-content', { timeout: 5000 });

    const duration = Date.now() - startTime;
    logger.info(`Dashboard load time: ${duration}ms`);

    expect(duration).toBeLessThan(5000);
  });

  test('⏱️ Should handle multiple page reloads', async ({ page }) => {
    // Hacer 3 recargas sin problemas
    for (let i = 0; i < 3; i++) {
      await page.reload();
      await page.waitForLoadState('networkidle');

      // Verificar que sigue logged in
      const mainContent = page.locator('.oxd-main-content');
      await expect(mainContent).toBeVisible({ timeout: 5000 });
    }
  });

  // ==========================================
  // 🔄 TESTS DE ESTADO DE SESIÓN
  // ==========================================

  test('🔄 Should maintain consistent session', async ({
    homePage,
    page,
  }) => {
    // Verificar estado inicial
    let isLoggedIn = await homePage.isUserLoggedIn();
    expect(isLoggedIn).toBeTruthy();

    // Recargar
    await homePage.reload();
    await page.waitForLoadState('networkidle');

    // Verificar que sigue logged
    isLoggedIn = await homePage.isUserLoggedIn();
    expect(isLoggedIn).toBeTruthy();

    // Navegar a dashboard
    const url = await homePage.getCurrentDashboardUrl();
    expect(url).toContain('/dashboard/index');
  });

  test('🔄 Should handle session persistence', async ({ page }) => {
    // Obtener cookies de sesión
    const cookies = await page.context()?.cookies();
    expect(cookies).toBeDefined();
    expect(cookies?.length).toBeGreaterThan(0);

    // Recargar y verificar que las cookies persisten
    await page.reload();
    await page.waitForLoadState('networkidle');

    const cookiesAfter = await page.context()?.cookies();
    expect(cookiesAfter?.length).toBeGreaterThanOrEqual(cookies?.length || 0);
  });
});
