import { Page, expect } from '@playwright/test';
import { logger } from '@utils/logger';

/**
 * =====================================================
 * CLASE BASE - BasePage
 * =====================================================
 * 
 * Esta es la clase padre de todos los Page Objects.
 * Contiene métodos comunes y reutilizables para
 * interactuar con la página web.
 * 
 * PATRÓN POM (Page Object Model):
 * - La lógica de interacción está en BasePage y sus subclases
 * - Los tests solo usan estos métodos, nunca selectores directos
 * - Cambios en la UI se hacen en un solo lugar
 * 
 * EJEMPLO DE USO:
 * class LoginPage extends BasePage {
 *   async login(user: string) {
 *     await this.fillInput('input[name="username"]', user);
 *   }
 * }
 */
export class BasePage {
  // Almacena la instancia de la página de Playwright
  readonly page: Page;

  /**
   * Constructor - Inicializa la clase con una instancia de Page
   * 
   * @param page - Instancia de Playwright Page obtenida del fixture
   * 
   * NOTA: Esta clase NO debe instanciarse directamente en tests
   * Siempre se hereda en subclases (LoginPage, HomePage, etc.)
   */
  constructor(page: Page) {
    this.page = page;
  }

  // ===================================
  // MÉTODOS DE NAVEGACIÓN
  // ===================================

  /**
   * Navega a una URL específica
   * 
   * @param url - La URL completa o relativa a la que navegar
   * 
   * COMPORTAMIENTO:
   * - Registra la navegación en los logs
   * - Navega a la URL
   * - NO espera a que la página cargue completamente
   * 
   * USO:
   * await page.goto('https://example.com/login');
   * 
   * NOTA: Para esperar a que la página cargue, usar waitForPageLoad()
   */
  async goto(url: string): Promise<void> {
    logger.info(`Navigating to: ${url}`);
    await this.page.goto(url);
  }

  /**
   * Espera a que la página termine de cargar completamente
   * 
   * COMPORTAMIENTO:
   * - Espera a que no haya más requests de red (networkidle)
   * - Útil para asegurar que todos los elementos están disponibles
   * - Timeout por defecto es 30 segundos
   * 
   * USO:
   * await page.goto(url);
   * await page.waitForPageLoad();
   * 
   * ESTADOS DE CARGA:
   * - 'load': solo espera el evento load
   * - 'domcontentloaded': espera DOM completamente cargado
   * - 'networkidle': espera a que no haya requests pendientes
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  // ===================================
  // MÉTODOS DE INTERACCIÓN CON ELEMENTOS
  // ===================================

  /**
   * Rellena un campo de input de texto
   * 
   * @param selector - Selector CSS del elemento input
   * @param text - Texto a escribir en el campo
   * 
   * COMPORTAMIENTO:
   * - Limpia el campo primero (si tiene contenido)
   * - Escribe el texto completo
   * - Registra la acción en logs
   * - NO presiona Enter al final
   * 
   * SELECTORES VÁLIDOS:
   * - Por nombre: 'input[name="username"]'
   * - Por id: '#email'
   * - Por clase: '.form-input'
   * - Por atributo: '[data-testid="user-input"]'
   * 
   * USO:
   * await page.fillInput('input[name="email"]', 'test@example.com');
   */
  async fillInput(selector: string, text: string): Promise<void> {
    logger.info(`Filling input "${selector}" with: ${text}`);
    await this.page.fill(selector, text);
  }

  /**
   * Hace clic en un elemento
   * 
   * @param selector - Selector CSS del elemento a clickear
   * 
   * COMPORTAMIENTO:
   * - Espera a que el elemento sea clickeable
   * - Realiza un clic normal
   * - Registra la acción en logs
   * - NO espera a navegación
   * 
   * CASOS DE USO:
   * - Clickear botones (sin cambio de página)
   * - Abrir menús dropdown
   * - Seleccionar checkboxes/radios
   * - Expandir/contraer elementos
   * 
   * USO:
   * await page.click('button[type="submit"]');
   * 
   * NOTA: Para clicks que causan navegación, usar clickAndWaitForNavigation()
   */
  async click(selector: string): Promise<void> {
    logger.info(`Clicking on: ${selector}`);
    await this.page.click(selector);
  }

  /**
   * Hace clic y espera a que ocurra una navegación a nueva página
   * 
   * @param selector - Selector CSS del elemento a clickear
   * 
   * COMPORTAMIENTO:
   * - Usa Promise.all para hacer click y esperar simultáneamente
   * - Espera a que se complete la navegación ANTES de continuar
   * - Si no ocurre navegación, se queda esperando (timeout)
   * 
   * CASOS DE USO:
   * - Clickear link que va a otra página
   * - Clickear botón de logout
   * - Clickear botón que redirige
   * 
   * USO:
   * await page.clickAndWaitForNavigation('a[href="/dashboard"]');
   * 
   * NOTA: Si el click no causa navegación, este método fallará
   * Usar click() normal para elementos que no navegan
   */
  async clickAndWaitForNavigation(selector: string): Promise<void> {
    logger.info(`Clicking on: ${selector} and waiting for navigation`);
    await Promise.all([
      this.page.waitForNavigation(),
      this.page.click(selector),
    ]);
  }

  // ===================================
  // MÉTODOS DE CONSULTA/LECTURA
  // ===================================

  /**
   * Obtiene el texto visible de un elemento
   * 
   * @param selector - Selector CSS del elemento
   * @returns El texto del elemento o vacío si no existe
   * 
   * COMPORTAMIENTO:
   * - Lee el textContent del elemento
   * - Retorna null si el elemento no existe
   * - NO incluye texto de elementos hijos ocultos
   * 
   * USO:
   * const errorText = await page.getText('.error-message');
   * expect(errorText).toContain('Invalid');
   * 
   * DIFERENCIA CON innerText:
   * - textContent: texto literal (incluye espacios, saltos)
   * - innerText: texto visible (respeta CSS)
   */
  async getText(selector: string): Promise<string> {
    return await this.page.textContent(selector);
  }

  /**
   * Verifica si un elemento es visible en la página
   * 
   * @param selector - Selector CSS del elemento
   * @returns true si es visible, false si no
   * 
   * COMPORTAMIENTO:
   * - Retorna true solo si el elemento está visible
   * - Retorna false si: no existe, está oculto (display:none), etc.
   * - Retorna false si está fuera del viewport (excepto en some cases)
   * 
   * USO:
   * const isVisible = await page.isVisible('.login-form');
   * if (!isVisible) throw new Error('Form not found');
   * 
   * NOTA: No es lo mismo que "existe"
   * Un elemento puede existir pero estar oculto (display: none)
   */
  async isVisible(selector: string): Promise<boolean> {
    return await this.page.isVisible(selector);
  }

  /**
   * Espera a que un elemento sea visible/presente en el DOM
   * 
   * @param selector - Selector CSS del elemento
   * @param timeout - Tiempo máximo de espera en ms (opcional)
   * 
   * COMPORTAMIENTO:
   * - Espera ACTIVAMENTE a que el elemento esté presente
   * - Si el timeout se alcanza, falla el test
   * - Timeout por defecto es 30 segundos (del config)
   * 
   * CASOS DE USO:
   * - Esperar a que aparezca un modal
   * - Esperar a que un elemento dinámico cargue
   * - Validar que un elemento será visible
   * 
   * USO:
   * await page.waitForSelector('.modal', { timeout: 5000 });
   * 
   * DIFERENCIA CON isVisible():
   * - waitForSelector: ESPERA a que aparezca (activo)
   * - isVisible: VERIFICA ahora mismo (pasivo)
   */
  async waitForSelector(selector: string, timeout?: number): Promise<void> {
    await this.page.waitForSelector(selector, { timeout });
  }

  // ===================================
  // MÉTODOS DE ASERCIONES/VALIDACIONES
  // ===================================

  /**
   * Valida que un elemento sea visible (aserción)
   * 
   * @param selector - Selector CSS del elemento
   * 
   * COMPORTAMIENTO:
   * - Es una aserción (Expect de Playwright)
   * - Si falla, el test se detiene
   * - Genera un mensaje de error claro si falla
   * 
   * USO:
   * await page.expectVisible('.success-message');
   * // Si no está visible, el test FALLA
   * 
   * DIFERENCIA CON isVisible():
   * - expectVisible: VALIDA y puede fallar el test
   * - isVisible: RETORNA true/false, no falla el test
   */
  async expectVisible(selector: string): Promise<void> {
    await expect(this.page.locator(selector)).toBeVisible();
  }

  /**
   * Valida que un elemento sea invisible/no exista (aserción)
   * 
   * @param selector - Selector CSS del elemento
   * 
   * COMPORTAMIENTO:
   * - Es una aserción (Expect de Playwright)
   * - Si el elemento está visible, el test FALLA
   * - Útil para validar que algo desapareció
   * 
   * USO:
   * await page.expectHidden('.loading-spinner');
   * // Si el spinner sigue visible, el test FALLA
   * 
   * CASOS DE USO:
   * - Validar que un modal cerró
   * - Validar que un mensaje de error desapareció
   * - Validar que un elemento fue eliminado
   */
  async expectHidden(selector: string): Promise<void> {
    await expect(this.page.locator(selector)).toBeHidden();
  }

  /**
   * Valida que un texto específico esté en la página (aserción)
   * 
   * @param text - Texto a buscar en la página
   * 
   * COMPORTAMIENTO:
   * - Busca el texto en toda la página (cualquier elemento)
   * - Hace búsqueda exacta (no parcial)
   * - Si el texto no existe, el test FALLA
   * 
   * USO:
   * await page.expectTextInPage('Welcome, Admin');
   * // Si el texto no está, el test FALLA
   * 
   * CASOS DE USO:
   * - Validar mensajes de éxito
   * - Validar que se cargó el contenido correcto
   * - Validar textos en la UI
   */
  async expectTextInPage(text: string): Promise<void> {
    await expect(this.page).toContainText(text);
  }

  // ===================================
  // MÉTODOS DE INFORMACIÓN DE LA PÁGINA
  // ===================================

  /**
   * Obtiene la URL actual de la página
   * 
   * @returns La URL completa actual
   * 
   * COMPORTAMIENTO:
   * - Retorna la URL del navegador ahora mismo
   * - Incluye protocolo, dominio, ruta y parámetros
   * 
   * USO:
   * const url = await page.getCurrentUrl();
   * expect(url).toContain('/dashboard');
   * 
   * EJEMPLO DE RETORNO:
   * 'https://example.com/dashboard?tab=home'
   */
  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  // ===================================
  // MÉTODOS DE NAVEGACIÓN DEL NAVEGADOR
  // ===================================

  /**
   * Recarga la página actual (F5)
   * 
   * COMPORTAMIENTO:
   * - Recarga completamente la página
   * - Mantiene el estado de la sesión (cookies, storage)
   * - Puede ser más lento que navegar a la misma URL
   * 
   * CASOS DE USO:
   * - Validar que la página sigue funcional después de reload
   * - Simular que el usuario presiona F5
   * - Validar persistencia de datos
   * 
   * USO:
   * await page.reload();
   * expect(page.isVisible('.dashboard')).toBeTruthy();
   */
  async reload(): Promise<void> {
    logger.info('Reloading page');
    await this.page.reload();
  }

  /**
   * Va atrás en el historial del navegador (botón atrás)
   * 
   * COMPORTAMIENTO:
   * - Va a la página anterior del historial
   * - Si no hay página anterior, falla
   * - Mantiene la sesión y cookies
   * 
   * CASOS DE USO:
   * - Validar flujo de navegación
   * - Simular que el usuario presiona botón atrás
   * - Tests de funcionalidad del botón back
   * 
   * USO:
   * await page.goBack();
   * // Debería estar en la página anterior
   * 
   * NOTA: Poco usado en tests de automatización
   */
  async goBack(): Promise<void> {
    logger.info('Going back');
    await this.page.goBack();
  }

  // ===================================
  // MÉTODOS DE UTILIDAD
  // ===================================

  /**
   * Toma una captura de pantalla (screenshot)
   * 
   * @param name - Nombre del archivo sin extensión
   * 
   * COMPORTAMIENTO:
   * - Guarda una imagen PNG en la carpeta screenshots/
   * - Crea la carpeta si no existe
   * - Nombre completo: screenshots/{name}.png
   * 
   * CASOS DE USO:
   * - Capturar pantalla cuando falla un test
   * - Documentar resultado visual
   * - Debug visual de problemas
   * 
   * USO:
   * await page.takeScreenshot('login-success');
   * // Genera: screenshots/login-success.png
   * 
   * NOTA: Playwright automáticamente guarda screenshots de fallos
   * Este método es para capturas manuales
   */
  async takeScreenshot(name: string): Promise<void> {
    logger.info(`Taking screenshot: ${name}`);
    await this.page.screenshot({ path: `screenshots/${name}.png` });
  }

  /**
   * Limpia todas las cookies de la sesión actual
   * 
   * COMPORTAMIENTO:
   * - Borra TODAS las cookies del contexto
   * - NO borra LocalStorage ni SessionStorage
   * - NO afecta a otros contextos
   * 
   * CASOS DE USO:
   * - Simular logout sin ir a la página
   * - Limpiar sesión entre tests
   * - Forzar login nuevamente
   * 
   * USO:
   * await page.clearCookies();
   * // Las cookies de sesión se borraron
   * 
   * NOTA: Para limpiar TODO (cookies + storage), usar:
   * await page.context()?.clearCookies();
   * await page.evaluate(() => localStorage.clear());
   */
  async clearCookies(): Promise<void> {
    logger.info('Clearing cookies');
    await this.page.context()?.clearCookies();
  }
}
