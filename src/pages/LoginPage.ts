import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { logger } from '@utils/logger';
import { SELECTORS } from '@config/constants';

/**
 * =====================================================
 * PAGE OBJECT - LoginPage
 * =====================================================
 * 
 * Representa la página de login de OrangeHRM.
 * Contiene todos los selectores y métodos específicos
 * para interactuar con la página de login.
 * 
 * HEREDA de BasePage:
 * - Todos los métodos base (goto, click, fillInput, etc.)
 * - Los selectores son específicos de esta página
 * 
 * RESPONSABILIDAD:
 * - Encapsular la lógica de login
 * - Manejar los elementos de la página de login
 * - NO validar el resultado (eso lo hace el test)
 * 
 * FLUJO DE ACCESO:
 * 1. navigateToLogin() - Ir a la página
 * 2. login() - Llenar campos y hacer clic
 * 3. Tests validan que se logró el login
 */
export class LoginPage extends BasePage {
  // ===================================
  // SELECTORES DE ORANGEHRM
  // ===================================
  // Estos selectores se usan en TODOS los métodos para interactuar

  /** Campo de entrada para el usuario (nombre de usuario) */
  readonly usernameInput = SELECTORS.USERNAME_INPUT;
  // Valor: 'input[name="username"]'

  /** Campo de entrada para la contraseña */
  readonly passwordInput = SELECTORS.PASSWORD_INPUT;
  // Valor: 'input[name="password"]'

  /** Botón para enviar el formulario de login */
  readonly loginButton = SELECTORS.LOGIN_BUTTON;
  // Valor: 'button[type="submit"]'

  /** Elemento que contiene el mensaje de error */
  readonly errorMessage = SELECTORS.ERROR_MESSAGE;
  // Valor: '.oxd-alert-content'

  /** Contenedor principal del formulario de login */
  readonly loginForm = SELECTORS.LOGIN_FORM;
  // Valor: '.orangehrm-login-container'

  /**
   * Constructor - Hereda de BasePage
   * 
   * @param page - Instancia de Playwright Page
   * 
   * NOTA: Los selectores son constantes (readonly)
   * Si cambia la estructura HTML, actualizar en constants.ts
   */
  constructor(page: Page) {
    super(page);
  }

  // ===================================
  // MÉTODOS PRINCIPALES
  // ===================================

  /**
   * Navega a la página de login y espera a que cargue
   * 
   * @param url - URL de la página de login
   * 
   * COMPORTAMIENTO:
   * 1. Navega a la URL
   * 2. Espera a que el formulario sea visible
   * 3. Registra en logs
   * 
   * CUÁNDO USAR:
   * - Al inicio de un test de login
   * - En beforeEach para ir a la página antes de cada test
   * 
   * USO:
   * await loginPage.navigateToLogin('https://..../auth/login');
   * // Ahora está lista la página para interactuar
   * 
   * DIFERENCIA CON goto():
   * - goto(): solo navega, no espera
   * - navigateToLogin(): navega + espera a formulario
   */
  async navigateToLogin(url: string): Promise<void> {
    logger.info(`Navigating to login: ${url}`);
    await this.goto(url);
    await this.waitForSelector(this.loginForm);
  }

  /**
   * Realiza el login completo en un paso
   * 
   * @param username - Nombre de usuario (ej: "Admin")
   * @param password - Contraseña (ej: "admin123")
   * 
   * COMPORTAMIENTO:
   * 1. Llena el campo de usuario
   * 2. Llena el campo de contraseña
   * 3. Hace clic en el botón de login
   * 4. Espera a que la página cargue (networkidle)
   * 5. Registra todo en logs
   * 
   * RETORNA:
   * - void (no retorna nada)
   * 
   * NO VALIDA:
   * - Si el login fue exitoso o no
   * - Los tests son responsables de validar
   * 
   * USO:
   * await loginPage.login('Admin', 'admin123');
   * // En el test, validar que el login funcionó:
   * // const isLoggedIn = await homePage.isUserLoggedIn();
   * 
   * PASO A PASO:
   * const startTime = Date.now();
   * // → Llena usuario
   * // → Llena contraseña
   * // → Hace clic
   * // → Espera networkidle
   * const duration = Date.now() - startTime;
   * // Típicamente toma 3-5 segundos
   */
  async login(username: string, password: string): Promise<void> {
    logger.info(`Attempting login with username: ${username}`);
    await this.fillInput(this.usernameInput, username);
    await this.fillInput(this.passwordInput, password);
    await this.click(this.loginButton);
    
    // Espera a que se procese el login (requests de red terminan)
    // Esto es importante para que se cargue la respuesta del servidor
    await this.page.waitForLoadState('networkidle');
  }

  // ===================================
  // MÉTODOS PARA LLENAR CAMPOS INDIVIDUALES
  // ===================================
  // Útiles para tests que llenan campos uno por uno
  // O para validaciones paso a paso

  /**
   * Solo llena el campo de usuario
   * 
   * @param username - Nombre de usuario a escribir
   * 
   * CUÁNDO USAR:
   * - Cuando quieres llenar usuario pero NO hacer login todavía
   * - Cuando quieres validar que el campo acepta el texto
   * - Cuando quieres un control más granular del flujo
   * 
   * USO:
   * await loginPage.fillUsername('Admin');
   * // El campo tiene "Admin" pero no hizo clic en login
   * 
   * COMBINADO CON OTROS MÉTODOS:
   * await loginPage.fillUsername('Admin');
   * await loginPage.fillPassword('admin123');
   * await loginPage.clickLoginButton();
   * // Equivalente a: await loginPage.login('Admin', 'admin123');
   */
  async fillUsername(username: string): Promise<void> {
    await this.fillInput(this.usernameInput, username);
  }

  /**
   * Solo llena el campo de contraseña
   * 
   * @param password - Contraseña a escribir
   * 
   * CUÁNDO USAR:
   * - Cuando quieres llenar contraseña pero NO hacer login
   * - Cuando quieres cambiar la contraseña después de llenar usuario
   * - Cuando necesitas control granular del flujo
   * 
   * USO:
   * await loginPage.fillPassword('admin123');
   * // El campo tiene "admin123" pero no hizo clic en login
   * 
   * NOTA: Generalmente se usa junto con fillUsername()
   */
  async fillPassword(password: string): Promise<void> {
    await this.fillInput(this.passwordInput, password);
  }

  /**
   * Solo hace clic en el botón de login
   * 
   * COMPORTAMIENTO:
   * 1. Hace clic en el botón submit
   * 2. Espera a que la página cargue (networkidle)
   * 3. Registra en logs
   * 
   * CUÁNDO USAR:
   * - Cuando ya lleaste los campos y quieres hacer clic
   * - Para separar la acción de llenar de la acción de enviar
   * - Para validar el formulario paso a paso
   * 
   * USO:
   * await loginPage.fillUsername('Admin');
   * await loginPage.fillPassword('admin123');
   * // Ahora validar que los campos están llenos
   * const username = await loginPage.getUsernameValue();
   * expect(username).toBe('Admin');
   * // Finalmente hacer clic
   * await loginPage.clickLoginButton();
   * 
   * IMPORTANTE:
   * - Espera networkidle después de clickear
   * - Esto es diferente a BasePage.click() que no espera
   * - Se hace porque es una acción que causa navegación/cambio
   */
  async clickLoginButton(): Promise<void> {
    await this.click(this.loginButton);
    await this.page.waitForLoadState('networkidle');
  }

  // ===================================
  // MÉTODOS PARA VALIDAR ERRORES
  // ===================================

  /**
   * Verifica si el mensaje de error es visible
   * 
   * @returns true si el error es visible, false si no
   * 
   * COMPORTAMIENTO:
   * - Retorna true solo si el selector del error está visible
   * - Retorna false si no existe o está oculto
   * - NO genera error si falla
   * 
   * CUÁNDO USAR:
   * - Después de intentar login fallido
   * - Validar que se mostró un mensaje de error
   * - Validar credenciales incorrectas
   * 
   * USO:
   * await loginPage.fillUsername('WrongUser');
   * await loginPage.fillPassword('WrongPassword');
   * await loginPage.clickLoginButton();
   * const hasError = await loginPage.isErrorVisible();
   * expect(hasError).toBeTruthy(); // O .toBeFalsy()
   * 
   * CASOS DE USO:
   * ✓ expect(isErrorVisible).toBeTruthy() - Esperamos error
   * ✓ expect(isErrorVisible).toBeFalsy() - No esperamos error
   * ✗ expect(isErrorVisible).toThrow() - No genera error
   */
  async isErrorVisible(): Promise<boolean> {
    return await this.isVisible(this.errorMessage);
  }

  /**
   * Obtiene el texto del mensaje de error
   * 
   * @returns El texto del mensaje de error o vacío
   * 
   * COMPORTAMIENTO:
   * - Lee el texto del elemento con class .oxd-alert-content
   * - Elimina espacios en blanco al inicio/final (trim)
   * - Retorna vacío si no hay error
   * 
   * CUÁNDO USAR:
   * - Validar el CONTENIDO específico del mensaje de error
   * - Validar mensajes localizados
   * - Validar errores específicos diferentes
   * 
   * USO:
   * await loginPage.clickLoginButton(); // Sin usuario/contraseña
   * const errorMsg = await loginPage.getErrorMessage();
   * expect(errorMsg).toContain('Invalid');
   * // O validar mensaje exacto:
   * expect(errorMsg).toBe('Invalid username or password');
   * 
   * DIFERENCIA CON isErrorVisible():
   * - isErrorVisible(): solo verifica que existe
   * - getErrorMessage(): obtiene el contenido específico
   */
  async getErrorMessage(): Promise<string> {
    const text = await this.getText(this.errorMessage);
    return text?.trim() || '';
  }

  // ===================================
  // MÉTODOS PARA VALIDAR FORMULARIO
  // ===================================

  /**
   * Verifica si el formulario de login es visible
   * 
   * @returns true si el formulario está visible, false si no
   * 
   * COMPORTAMIENTO:
   * - Valida que el elemento .orangehrm-login-container existe y es visible
   * - Retorna false si el formulario está oculto o no existe
   * - NO genera error si falla
   * 
   * CUÁNDO USAR:
   * - Validar que estamos en la página de login
   * - Validar que el formulario se ocultó después de login exitoso
   * - Validar que volvemos a login después de logout
   * 
   * USO:
   * // Al inicio: formulario debe estar visible
   * let isVisible = await loginPage.isLoginFormVisible();
   * expect(isVisible).toBeTruthy();
   * 
   * // Después de login: formulario debe desaparecer
   * await loginPage.login('Admin', 'admin123');
   * isVisible = await loginPage.isLoginFormVisible();
   * expect(isVisible).toBeFalsy();
   * 
   * // Después de logout: formulario debe aparecer de nuevo
   * await homePage.logout();
   * isVisible = await loginPage.isLoginFormVisible();
   * expect(isVisible).toBeTruthy();
   */
  async isLoginFormVisible(): Promise<boolean> {
    return await this.isVisible(this.loginForm);
  }

  // ===================================
  // MÉTODOS PARA LIMPIAR CAMPOS
  // ===================================

  /**
   * Limpia/borra TODOS los campos del formulario
   * 
   * COMPORTAMIENTO:
   * - Limpia el campo de usuario
   * - Limpia el campo de contraseña
   * - NO hace clic en nada
   * - NO valida nada
   * 
   * CUÁNDO USAR:
   * - Después de un test fallido, limpiar para nuevo intento
   * - Preparar el formulario para un nuevo login
   * - Validar que la limpieza funciona
   * 
   * USO:
   * // Primer intento (fallido)
   * await loginPage.login('WrongUser', 'WrongPass');
   * let hasError = await loginPage.isErrorVisible();
   * expect(hasError).toBeTruthy();
   * 
   * // Limpiar para segundo intento
   * await loginPage.clearForm();
   * 
   * // Segundo intento (correcto)
   * await loginPage.login('Admin', 'admin123');
   * hasError = await loginPage.isErrorVisible();
   * expect(hasError).toBeFalsy();
   * 
   * NOTA: No es lo mismo que recargar la página
   * Solo limpia los valores, no recarga nada
   */
  async clearForm(): Promise<void> {
    await this.page.fill(this.usernameInput, '');
    await this.page.fill(this.passwordInput, '');
  }

  // ===================================
  // MÉTODOS PARA OBTENER VALORES
  // ===================================

  /**
   * Obtiene el valor actual del campo de usuario
   * 
   * @returns El texto actualmente en el campo usuario
   * 
   * COMPORTAMIENTO:
   * - Lee el valor del input (value attribute)
   * - Retorna exactamente lo que está en el campo
   * - Retorna vacío si el campo está vacío
   * 
   * CUÁNDO USAR:
   * - Validar que fillUsername() funcionó
   * - Validar que el campo tiene el valor correcto
   * - Validar que clear() funcionó
   * 
   * USO:
   * await loginPage.fillUsername('Admin');
   * const value = await loginPage.getUsernameValue();
   * expect(value).toBe('Admin');
   * 
   * // Validar que se limpió
   * await loginPage.clearForm();
   * const emptyValue = await loginPage.getUsernameValue();
   * expect(emptyValue).toBe('');
   * 
   * DIFERENCIA CON getText():
   * - getUsernameValue(): lee el VALUE del input
   * - getText(): lee el textContent (visible) del elemento
   * - Para inputs, siempre usar inputValue()
   */
  async getUsernameValue(): Promise<string> {
    return await this.page.inputValue(this.usernameInput);
  }

  /**
   * Obtiene el valor actual del campo de contraseña
   * 
   * @returns El texto actualmente en el campo contraseña
   * 
   * COMPORTAMIENTO:
   * - Lee el valor del input (value attribute)
   * - Los navegadores modernos NO permiten leer contraseñas
   * - Pero si es un input text normal con type="password"
   * - inputValue() retorna el valor sin procesar
   * 
   * CUÁNDO USAR:
   * - Validar que fillPassword() funcionó
   * - Validar que el campo tiene el valor correcto
   * - Validar que clear() funcionó
   * 
   * USO:
   * await loginPage.fillPassword('admin123');
   * const value = await loginPage.getPasswordValue();
   * expect(value).toBe('admin123');
   * 
   * // Validar que se limpió
   * await loginPage.clearForm();
   * const emptyValue = await loginPage.getPasswordValue();
   * expect(emptyValue).toBe('');
   * 
   * NOTA IMPORTANTE:
   * - En algunos navegadores/aplicaciones, no puedes leer
   *   el valor de campos password por seguridad
   * - Este método puede retornar vacío aunque hay contenido
   * - Usa isErrorVisible() para validar en lugar de leer valores
   */
  async getPasswordValue(): Promise<string> {
    return await this.page.inputValue(this.passwordInput);
  }
}
