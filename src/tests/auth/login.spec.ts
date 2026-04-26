import { test, expect } from '@fixtures/test-fixtures';
import { LOGIN_URL, DASHBOARD_URL, TEST_USER, INVALID_USER } from '@config/constants';
import { logger } from '@utils/logger';

test.describe('🔐 OrangeHRM Login Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navegar a la página de login antes de cada test
    logger.info('=== Starting new test ===');
    await page.goto(LOGIN_URL);
  });

  test.afterEach(async () => {
    logger.info('=== Test completed ===');
  });

  // ==========================================
  // ✅ CASOS DE ÉXITO - LOGIN VÁLIDO
  // ==========================================

  test('✅ Should login successfully with valid credentials', async ({
    loginPage,
    homePage,
  }) => {
    // Realizar login con credenciales válidas
    await loginPage.login(TEST_USER.email, TEST_USER.password);

    // Verificar que se redirige al dashboard
    const isLoggedIn = await homePage.isUserLoggedIn();
    expect(isLoggedIn).toBeTruthy();

    // Verificar que el título contiene Dashboard
    const title = await homePage.getDashboardTitle();
    expect(title.toLowerCase()).toContain('dashboard');
  });

  test('✅ Should display dashboard after successful login', async ({
    loginPage,
    homePage,
  }) => {
    await loginPage.login(TEST_USER.email, TEST_USER.password);

    // Verificar URL del dashboard
    const url = await homePage.getCurrentDashboardUrl();
    expect(url).toContain('/dashboard/index');
  });

  test('✅ Should verify login form is hidden after login', async ({
    loginPage,
    page,
  }) => {
    await loginPage.login(TEST_USER.email, TEST_USER.password);

    // El formulario de login no debe estar visible
    const isFormVisible = await loginPage.isLoginFormVisible();
    expect(isFormVisible).toBeFalsy();
  });

  // ==========================================
  // ❌ CASOS DE ERROR - CREDENCIALES INVÁLIDAS
  // ==========================================

  test('❌ Should display error with invalid username', async ({ loginPage }) => {
    // Intentar login con usuario inválido
    await loginPage.fillUsername('InvalidUser123');
    await loginPage.fillPassword(TEST_USER.password);
    await loginPage.clickLoginButton();

    // Debe esperar un poco para que se procese
    await loginPage.page.waitForTimeout(2000);

    // Verificar que se muestra mensaje de error
    const isErrorVisible = await loginPage.isErrorVisible();
    expect(isErrorVisible).toBeTruthy();
  });

  test('❌ Should display error with invalid password', async ({ loginPage }) => {
    // Intentar login con contraseña incorrecta
    await loginPage.fillUsername(TEST_USER.email);
    await loginPage.fillPassword('WrongPassword123!');
    await loginPage.clickLoginButton();

    // Esperar a que se procese
    await loginPage.page.waitForTimeout(2000);

    // Verificar error
    const isErrorVisible = await loginPage.isErrorVisible();
    expect(isErrorVisible).toBeTruthy();
  });

  test('❌ Should display error with completely wrong credentials', async ({
    loginPage,
  }) => {
    await loginPage.login(INVALID_USER.email, INVALID_USER.password);

    // Esperar error
    await loginPage.page.waitForTimeout(2000);
    const isErrorVisible = await loginPage.isErrorVisible();
    expect(isErrorVisible).toBeTruthy();
  });

  // ==========================================
  // ⚠️ CASOS LÍMITE - CAMPOS VACÍOS/ESPECIALES
  // ==========================================

  test('⚠️ Should not login with empty username', async ({ loginPage }) => {
    // Dejar usuario vacío y llenar contraseña
    await loginPage.fillPassword(TEST_USER.password);
    await loginPage.clickLoginButton();

    // Esperar a que valide
    await loginPage.page.waitForTimeout(1500);

    // Debería haber error o estar en login aún
    const isOnLogin = await loginPage.isLoginFormVisible();
    expect(isOnLogin).toBeTruthy();
  });

  test('⚠️ Should not login with empty password', async ({ loginPage }) => {
    // Llenar usuario pero dejar contraseña vacía
    await loginPage.fillUsername(TEST_USER.email);
    await loginPage.clickLoginButton();

    // Esperar validación
    await loginPage.page.waitForTimeout(1500);

    // Debería haber error o estar en login aún
    const isOnLogin = await loginPage.isLoginFormVisible();
    expect(isOnLogin).toBeTruthy();
  });

  test('⚠️ Should not login with both fields empty', async ({ loginPage }) => {
    // Sin llenar nada, hacer clic en login
    await loginPage.clickLoginButton();

    // Esperar validación
    await loginPage.page.waitForTimeout(1500);

    // Debería estar en login aún
    const isOnLogin = await loginPage.isLoginFormVisible();
    expect(isOnLogin).toBeTruthy();
  });

  test('⚠️ Should handle special characters in password', async ({ loginPage }) => {
    await loginPage.fillUsername(TEST_USER.email);
    await loginPage.fillPassword('P@ssw0rd!#$%^&*()');
    await loginPage.clickLoginButton();

    await loginPage.page.waitForTimeout(2000);

    // Debería mostrar error de credenciales inválidas
    const isErrorVisible = await loginPage.isErrorVisible();
    expect(isErrorVisible).toBeTruthy();
  });

  test('⚠️ Should handle SQL injection attempt in username', async ({
    loginPage,
  }) => {
    await loginPage.fillUsername("' OR '1'='1");
    await loginPage.fillPassword(TEST_USER.password);
    await loginPage.clickLoginButton();

    await loginPage.page.waitForTimeout(2000);

    const isErrorVisible = await loginPage.isErrorVisible();
    expect(isErrorVisible).toBeTruthy();
  });

  // ==========================================
  // 🔄 CASOS DE FLUJO - MÚLTIPLES INTENTOS
  // ==========================================

  test('🔄 Should allow retry after failed login', async ({ loginPage }) => {
    // Primer intento fallido
    await loginPage.login(INVALID_USER.email, INVALID_USER.password);
    await loginPage.page.waitForTimeout(2000);

    let isErrorVisible = await loginPage.isErrorVisible();
    expect(isErrorVisible).toBeTruthy();

    // Segundo intento exitoso
    await loginPage.clearForm();
    await loginPage.login(TEST_USER.email, TEST_USER.password);

    // Verificar que ahora sí entra
    const isOnLogin = await loginPage.isLoginFormVisible();
    expect(isOnLogin).toBeFalsy();
  });

  test('🔄 Should maintain form state when filled', async ({ loginPage }) => {
    const testUsername = 'TestUser';
    const testPassword = 'TestPass123';

    // Llenar formulario
    await loginPage.fillUsername(testUsername);
    await loginPage.fillPassword(testPassword);

    // Verificar valores
    let usernameValue = await loginPage.getUsernameValue();
    let passwordValue = await loginPage.getPasswordValue();

    expect(usernameValue).toBe(testUsername);
    expect(passwordValue).toBe(testPassword);
  });

  test('🔄 Should clear form correctly', async ({ loginPage }) => {
    // Llenar formulario
    await loginPage.fillUsername(TEST_USER.email);
    await loginPage.fillPassword(TEST_USER.password);

    // Limpiar formulario
    await loginPage.clearForm();

    // Verificar que están vacíos
    const usernameValue = await loginPage.getUsernameValue();
    const passwordValue = await loginPage.getPasswordValue();

    expect(usernameValue).toBe('');
    expect(passwordValue).toBe('');
  });

  // ==========================================
  // 🎯 CASOS DE VALIDACIÓN - INTERFAZ
  // ==========================================

  test('🎯 Should verify login form is visible on page load', async ({
    loginPage,
  }) => {
    const isFormVisible = await loginPage.isLoginFormVisible();
    expect(isFormVisible).toBeTruthy();
  });

  test('🎯 Should verify login page title', async ({ page }) => {
    const title = await page.title();
    expect(title.toLowerCase()).toContain('login');
  });

  test('🎯 Should verify login button is visible', async ({ loginPage }) => {
    const isVisible = await loginPage.isVisible(loginPage.loginButton);
    expect(isVisible).toBeTruthy();
  });

  test('🎯 Should verify input fields are visible', async ({ loginPage }) => {
    const usernameVisible = await loginPage.isVisible(loginPage.usernameInput);
    const passwordVisible = await loginPage.isVisible(loginPage.passwordInput);

    expect(usernameVisible).toBeTruthy();
    expect(passwordVisible).toBeTruthy();
  });

  // ==========================================
  // ⏱️ CASOS DE TIMING - ESPERAS Y CARGAS
  // ==========================================

  test('⏱️ Should wait for page load before interacting', async ({ loginPage }) => {
    // Esperar que todos los elementos estén listos
    await loginPage.waitForSelector(loginPage.usernameInput);
    await loginPage.waitForSelector(loginPage.passwordInput);
    await loginPage.waitForSelector(loginPage.loginButton);

    // Verificar que están visibles
    expect(await loginPage.isVisible(loginPage.usernameInput)).toBeTruthy();
    expect(await loginPage.isVisible(loginPage.passwordInput)).toBeTruthy();
    expect(await loginPage.isVisible(loginPage.loginButton)).toBeTruthy();
  });

  test('⏱️ Should handle network delays gracefully', async ({
    loginPage,
    homePage,
  }) => {
    // Simular conexión lenta
    await loginPage.page.route('**/*', (route) => {
      setTimeout(() => route.continue(), 500);
    });

    await loginPage.login(TEST_USER.email, TEST_USER.password);

    const isLoggedIn = await homePage.isUserLoggedIn();
    expect(isLoggedIn).toBeTruthy();
  });

  // ==========================================
  // 🚀 CASOS DE RENDIMIENTO
  // ==========================================

  test('🚀 Should complete login in reasonable time', async ({
    loginPage,
    homePage,
  }) => {
    const startTime = Date.now();

    await loginPage.login(TEST_USER.email, TEST_USER.password);
    const isLoggedIn = await homePage.isUserLoggedIn();

    const endTime = Date.now();
    const duration = endTime - startTime;

    expect(isLoggedIn).toBeTruthy();
    expect(duration).toBeLessThan(10000); // Menos de 10 segundos
  });

  test('🚀 Should handle rapid successive logins', async ({ loginPage, page }) => {
    // Primer login
    await loginPage.login(TEST_USER.email, TEST_USER.password);
    let isLoaded = await loginPage.page.waitForSelector('.oxd-main-content', {
      timeout: 5000,
    });
    expect(isLoaded).toBeTruthy();

    // Logout
    await page.goto(LOGIN_URL);
    await loginPage.waitForSelector(loginPage.loginForm);

    // Segundo login
    await loginPage.login(TEST_USER.email, TEST_USER.password);
    isLoaded = await loginPage.page.waitForSelector('.oxd-main-content', {
      timeout: 5000,
    });
    expect(isLoaded).toBeTruthy();
  });
});
