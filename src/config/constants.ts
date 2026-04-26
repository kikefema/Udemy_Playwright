/**
 * =====================================================
 * CONFIGURACIÓN - Constantes Globales
 * =====================================================
 * 
 * Este archivo centraliza TODAS las constantes del proyecto:
 * - URLs de la aplicación
 * - Datos de prueba comunes
 * - Selectores CSS
 * - Valores de configuración
 * 
 * VENTAJA DE CENTRALIZAR:
 * - Cambios en una sola línea se reflejan en todo el código
 * - Fácil mantenimiento si cambia la aplicación
 * - DRY (Don't Repeat Yourself)
 * - Código más legible
 * 
 * ESTRUCTURA:
 * - URLs base
 * - Timeouts
 * - Usuarios de prueba
 * - Selectores CSS
 * - Configuración de ambientes
 */

// ===================================
// 1. URLs BASE - ORANGEHRM
// ===================================

/**
 * URL BASE de la aplicación OrangeHRM
 * 
 * Se lee de la variable de entorno BASE_URL si existe
 * Si no existe, usa la URL por defecto de demo
 * 
 * USO:
 * - Todas las URLs que NO son "/" se construyen a partir de esta
 * - Útil para cambiar entre dev/staging/prod solo cambiando BASE_URL
 * 
 * EJEMPLO:
 * BASE_URL = 'https://opensource-demo.orangehrmlive.com/web/index.php'
 * 
 * CÓMO CAMBIAR AMBIENTE:
 * 1. En .env: BASE_URL=https://staging.example.com/web/index.php
 * 2. Todos los tests usan la nueva URL automáticamente
 */
export const BASE_URL = process.env.BASE_URL || 'https://opensource-demo.orangehrmlive.com/web/index.php';

/**
 * URL de la página de LOGIN
 * 
 * Se construye a partir de BASE_URL + "/auth/login"
 * Usada en tests de login y logout
 * 
 * VALOR COMPLETO:
 * 'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login'
 */
export const LOGIN_URL = `${BASE_URL}/auth/login`;

/**
 * URL del DASHBOARD (página principal después de login)
 * 
 * Se construye a partir de BASE_URL + "/dashboard/index"
 * Usada para navegar al dashboard o validar redirecciones
 * 
 * VALOR COMPLETO:
 * 'https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index'
 */
export const DASHBOARD_URL = `${BASE_URL}/dashboard/index`;

// ===================================
// 2. TIMEOUTS - ESPERAS MÁXIMAS (en milisegundos)
// ===================================

/**
 * SHORT_TIMEOUT - Espera corta (5 segundos)
 * 
 * USADO PARA:
 * - Elementos que DEBERÍAN estar presentes rápidamente
 * - Validaciones de error
 * - Elementos que no requieren carga de datos
 * 
 * EJEMPLO:
 * await page.waitForSelector(selector, { timeout: SHORT_TIMEOUT });
 */
export const SHORT_TIMEOUT = 5000;

/**
 * MEDIUM_TIMEOUT - Espera media (10 segundos)
 * 
 * USADO PARA:
 * - Elementos que se cargan con datos
 * - Redirecciones después de acciones
 * - Elementos que requieren procesamiento
 * 
 * EJEMPLO:
 * await page.waitForSelector(selector, { timeout: MEDIUM_TIMEOUT });
 */
export const MEDIUM_TIMEOUT = 10000;

/**
 * LONG_TIMEOUT - Espera larga (30 segundos)
 * 
 * USADO PARA:
 * - Operaciones pesadas
 * - Carga de mucho contenido
 * - Esperas excepcionales
 * 
 * EJEMPLO:
 * await page.waitForSelector(selector, { timeout: LONG_TIMEOUT });
 * 
 * NOTA:
 * Este es el timeout por defecto en playwright.config.ts
 */
export const LONG_TIMEOUT = 30000;

// ===================================
// 3. DATOS DE PRUEBA - USUARIOS
// ===================================

/**
 * USUARIO VÁLIDO para tests de login exitoso
 * 
 * Estos son datos reales del demo de OrangeHRM
 * IMPORTANTE: NO usar credenciales reales en código fuente
 * En producción, estos deberían estar en .env o secretos seguros
 * 
 * USO:
 * await loginPage.login(TEST_USER.email, TEST_USER.password);
 * // Ya está el usuario logueado
 * 
 * NOTA SOBRE EL CAMPO "email":
 * Se llama email pero es en realidad el USUARIO/USERNAME
 * OrangeHRM usa email como nombre de usuario
 * Valor: 'Admin' (usuario)
 */
export const TEST_USER = {
  email: 'Admin', // En realidad es el usuario/username
  password: 'admin123',
};

/**
 * USUARIO INVÁLIDO para tests de login fallido
 * 
 * Estos datos NO existen en la aplicación
 * Usados para validar que:
 * - Los logins fallidos muestran error
 * - La validación de credenciales funciona
 * - La seguridad rechaza credenciales incorrectas
 * 
 * USO:
 * await loginPage.login(INVALID_USER.email, INVALID_USER.password);
 * const hasError = await loginPage.isErrorVisible();
 * expect(hasError).toBeTruthy();
 * 
 * CASOS DE USO:
 * - Test: "Should display error with invalid credentials"
 * - Test: "Should reject wrong password"
 * - Test: "Should not login with fake user"
 */
export const INVALID_USER = {
  email: 'InvalidUser',
  password: 'WrongPassword123!',
};

// ===================================
// 4. SELECTORES CSS - ORANGEHRM
// ===================================

/**
 * SELECTORES - Localizadores CSS de elementos
 * 
 * Estos selectores se usan en LoginPage, HomePage, etc.
 * Centralizarlos aquí permite cambios fáciles si la UI cambia
 * 
 * VENTAJAS:
 * - Un cambio en HTML → se actualiza en UN lugar
 * - Los Page Objects no tienen selectores hardcoded
 * - Fácil encontrar todos los selectores del proyecto
 * 
 * TIPOS DE SELECTORES:
 * - [name="..."] → por atributo name
 * - [type="submit"] → por atributo type
 * - .clase → por clase CSS
 * - #id → por id (raro en OrangeHRM)
 * - a:has-text("...") → por texto (Playwright)
 */
export const SELECTORS = {
  // ===== PÁGINA DE LOGIN =====
  
  /** Input del usuario - se usa en: await page.fillInput(USERNAME_INPUT, user) */
  USERNAME_INPUT: 'input[name="username"]',
  
  /** Input de contraseña - se usa en: await page.fillInput(PASSWORD_INPUT, pass) */
  PASSWORD_INPUT: 'input[name="password"]',
  
  /** Botón de submit del formulario - se usa en: await page.click(LOGIN_BUTTON) */
  LOGIN_BUTTON: 'button[type="submit"]',
  
  /** Mensaje de error - se usa en: await page.isVisible(ERROR_MESSAGE) */
  ERROR_MESSAGE: '.oxd-alert-content',
  
  /** Contenedor principal del login - se usa en: await page.isVisible(LOGIN_FORM) */
  LOGIN_FORM: '.orangehrm-login-container',

  // ===== PÁGINA DE DASHBOARD =====
  
  /** Grid principal del dashboard - se usa para validar login exitoso */
  DASHBOARD_GRID: '.orangehrm-dashboard-grid',
  
  /** Botón de menú de usuario - se usa en: await page.click(USER_MENU) */
  USER_MENU: '.oxd-userdropdown',
  
  /** Link de logout dentro del menú - se usa en: await page.click(LOGOUT_BUTTON) */
  LOGOUT_BUTTON: 'a:has-text("Logout")',
  
  /** Texto de bienvenida (si existe) */
  WELCOME_TEXT: 'h6',
};

// ===================================
// 5. NAVEGADORES SOPORTADOS
// ===================================

/**
 * Lista de navegadores en los que ejecutar los tests
 * 
 * VALORES VÁLIDOS:
 * - 'chromium' → Chrome, Chromium, Edge
 * - 'firefox' → Firefox
 * - 'webkit' → Safari
 * 
 * USO:
 * - En playwright.config.ts para crear proyectos
 * - Para ejecutar tests en múltiples navegadores
 * 
 * NOTA:
 * En playwright.config.ts, solo 'chromium' está habilitado
 * Para habilitar más, descomenta las secciones en config
 */
export const BROWSERS = ['chromium', 'firefox', 'webkit'];

// ===================================
// 6. AMBIENTES/ENTORNOS
// ===================================

/**
 * AMBIENTES de ejecución
 * 
 * VALORES:
 * - 'development' → Servidor local/dev
 * - 'staging' → Servidor de pruebas
 * - 'production' → Servidor en vivo
 * 
 * USO:
 * if (ENVIRONMENT === 'production') {
 *   // Hacer algo especial solo en producción
 * }
 * 
 * SE LEE DE:
 * - Variable de entorno ENVIRONMENT en .env
 * - O se especifica al ejecutar: npm test -- --reporter=verbose
 * 
 * NOTA:
 * En nuestro caso, usamos producción (la demo de OrangeHRM es pública)
 */
export const ENVIRONMENTS = {
  DEV: 'development',
  STAGING: 'staging',
  PROD: 'production',
};
