import { test, expect } from '@fixtures/test-fixtures';
import { LOGIN_URL, BASE_URL, TEST_USER } from '@config/constants';
import { logger } from '@utils/logger';

/**
 * Smoke Tests - Pruebas básicas de la aplicación
 * Verifican que los componentes críticos funcionan
 */
test.describe('🔥 OrangeHRM Smoke Tests', () => {
  test('🔥 Should load login page without errors', async ({ page }) => {
    logger.info('Loading login page...');
    
    await page.goto(LOGIN_URL);
    await page.waitForLoadState('networkidle');

    // Verificar que la página cargó
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title.toLowerCase()).toContain('login');
  });

  test('🔥 Should have login form visible', async ({ loginPage }) => {
    await loginPage.navigateToLogin(LOGIN_URL);

    const isFormVisible = await loginPage.isLoginFormVisible();
    expect(isFormVisible).toBeTruthy();

    // Verificar que los campos principales existen
    const usernameVisible = await loginPage.isVisible(loginPage.usernameInput);
    const passwordVisible = await loginPage.isVisible(loginPage.passwordInput);
    const buttonVisible = await loginPage.isVisible(loginPage.loginButton);

    expect(usernameVisible).toBeTruthy();
    expect(passwordVisible).toBeTruthy();
    expect(buttonVisible).toBeTruthy();
  });

  test('🔥 Should complete full login flow', async ({ loginPage, homePage }) => {
    logger.info('Testing complete login flow...');
    
    await loginPage.navigateToLogin(LOGIN_URL);
    await loginPage.login(TEST_USER.email, TEST_USER.password);

    const isLoggedIn = await homePage.isUserLoggedIn();
    expect(isLoggedIn).toBeTruthy();
  });

  test('🔥 Should complete full logout flow', async ({
    loginPage,
    homePage,
    page,
  }) => {
    logger.info('Testing complete logout flow...');
    
    // Login
    await loginPage.navigateToLogin(LOGIN_URL);
    await loginPage.login(TEST_USER.email, TEST_USER.password);

    // Logout
    await homePage.logout();
    await page.waitForLoadState('networkidle');

    // Verificar que estamos en login
    const isOnLogin = await homePage.isOnLoginPage();
    expect(isOnLogin).toBeTruthy();
  });

  test('🔥 Should not have JavaScript console errors', async ({
    loginPage,
    page,
  }) => {
    const errors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await loginPage.navigateToLogin(LOGIN_URL);
    
    // No debería haber errores críticos
    expect(errors.length).toBe(0);
  });

  test('🔥 Should handle network requests successfully', async ({ page }) => {
    let requestsFailed = false;

    page.on('response', (response) => {
      if (response.status() >= 500) {
        requestsFailed = true;
      }
    });

    await page.goto(LOGIN_URL);
    await page.waitForLoadState('networkidle');

    expect(requestsFailed).toBeFalsy();
  });

  test('🔥 Should verify database connectivity', async ({
    loginPage,
    homePage,
  }) => {
    // Si el login funciona, la BD está disponible
    await loginPage.navigateToLogin(LOGIN_URL);
    await loginPage.login(TEST_USER.email, TEST_USER.password);

    const isLoggedIn = await homePage.isUserLoggedIn();
    expect(isLoggedIn).toBeTruthy();
  });

  test('🔥 Should respond within acceptable time', async ({ page }) => {
    const startTime = Date.now();

    await page.goto(LOGIN_URL);
    await page.waitForLoadState('networkidle');

    const duration = Date.now() - startTime;
    logger.info(`Page load time: ${duration}ms`);

    // Debe cargar en menos de 10 segundos
    expect(duration).toBeLessThan(10000);
  });
});
