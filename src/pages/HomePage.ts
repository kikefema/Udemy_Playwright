import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { logger } from '@utils/logger';
import { SELECTORS } from '@config/constants';

/**
 * =====================================================
 * PAGE OBJECT - HomePage (Dashboard)
 * =====================================================
 * 
 * Representa el Dashboard de OrangeHRM después del login.
 * Contiene todos los selectores y métodos específicos
 * para interactuar con la página del dashboard.
 * 
 * RESPONSABILIDAD:
 * - Encapsular la lógica del dashboard
 * - Manejar menú de usuario y logout
 * - Validar que estamos logueados
 * 
 * FLUJO TÍPICO:
 * 1. loginPage.login() - Hacer login
 * 2. homePage.isUserLoggedIn() - Validar que estamos en dashboard
 * 3. homePage.openUserMenu() - Interactuar con dashboard
 * 4. homePage.logout() - Cerrar sesión
 */
export class HomePage extends BasePage {
  // ===================================
  // SELECTORES DE ORANGEHRM DASHBOARD
  // ===================================

  /** Contenedor principal del dashboard (grid de widgets) */
  readonly dashboardGrid = SELECTORS.DASHBOARD_GRID;
  // Valor: '.orangehrm-dashboard-grid'

  /** Botón para abrir el menú de usuario */
  readonly userMenu = '.oxd-userdropdown-button';

  /** Link/botón para cerrar sesión dentro del menú dropdown */
  readonly logoutLink = 'a:has-text("Logout")';

  /** Contenedor del menú dropdown cuando está abierto */
  readonly userMenuDropdown = '.oxd-dropdown-menu';

  /**
   * Constructor - Hereda de BasePage
   * 
   * @param page - Instancia de Playwright Page
   */
  constructor(page: Page) {
    super(page);
  }

  // ===================================
  // MÉTODOS PARA VERIFICAR ESTADO DE LOGIN
  // ===================================

  /**
   * Verifica si el usuario está actualmente logueado
   * 
   * @returns true si estamos en dashboard, false si no
   * 
   * COMPORTAMIENTO:
   * 1. Busca el elemento dashboardGrid (.orangehrm-dashboard-grid)
   * 2. Si existe dentro de 5 segundos, retorna true
   * 3. Si no aparece, retorna false (sin error)
   * 4. Timeout corto (5 segundos) para no esperar mucho
   * 
   * CUÁNDO USAR:
   * - Después de intentar login
   * - Validar que estamos en dashboard
   * - Validar que no nos redirigió a login
   * 
   * USO:
   * await loginPage.login('Admin', 'admin123');
   * const isLoggedIn = await homePage.isUserLoggedIn();
   * expect(isLoggedIn).toBeTruthy();
   * 
   * DIFERENCIA CON isLoginFormVisible():
   * - isUserLoggedIn(): verifica que estamos EN dashboard
   * - isLoginFormVisible(): verifica que estamos EN login
   * - Usar isUserLoggedIn() para después de login
   * - Usar isLoginFormVisible() para después de logout
   * 
   * NOTA:
   * - No espera networkidle (usa timeout corto)
   * - Si el dashboard tarda más de 5s, puede fallar
   * - Aumentar timeout si la red es lenta
   */
  async isUserLoggedIn(): Promise<boolean> {
    try {
      await this.page.waitForSelector(this.dashboardGrid, { timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Obtiene el título de la página del dashboard
   * 
   * @returns El título (<title>) de la página HTML
   * 
   * COMPORTAMIENTO:
   * - Lee el texto del <title> en el <head>
   * - El título generalmente es algo como "Dashboard - OrangeHRM"
   * - Útil para validar que estamos en la página correcta
   * 
   * CUÁNDO USAR:
   * - Validar que la página es el dashboard
   * - Validar cambios de página
   * - Validar redirecciones correctas
   * 
   * USO:
   * const title = await homePage.getDashboardTitle();
   * expect(title.toLowerCase()).toContain('dashboard');
   * 
   * EJEMPLOS DE TÍTULOS:
   * - 'Dashboard' (página de dashboard)
   * - 'OrangeHRM' (página principal)
   * - 'Login - OrangeHRM' (página de login)
   * 
   * NOTA:
   * - El título puede variar según la aplicación
   * - Mejor usar isUserLoggedIn() para más confiabilidad
   */
  async getDashboardTitle(): Promise<string> {
    return await this.page.title();
  }

  // ===================================
  // MÉTODOS DEL MENÚ DE USUARIO
  // ===================================

  /**
   * Abre el menú dropdown de usuario
   * 
   * COMPORTAMIENTO:
   * 1. Hace clic en el botón de menú (.oxd-userdropdown-button)
   * 2. Espera a que el dropdown sea visible
   * 3. Registra en logs
   * 
   * CUÁNDO USAR:
   * - Antes de hacer logout
   * - Validar que el menú se abre
   * - Acceder a opciones del menú
   * 
   * USO:
   * await homePage.openUserMenu();
   * // Ahora el dropdown está visible
   * const logoutBtn = await homePage.page.locator('a:has-text("Logout")');
   * await expect(logoutBtn).toBeVisible();
   * 
   * ESTRUCTURA DEL MENÚ:
   * - Botón: .oxd-userdropdown-button
   * - Dropdown: .oxd-dropdown-menu
   * - Links dentro: a (Mi Perfil, Logout, etc.)
   * 
   * NOTA:
   * - El menú se abre solo si el usuario está logueado
   * - No funciona en página de login
   * - El dropdown desaparece si haces clic afuera
   */
  async openUserMenu(): Promise<void> {
    logger.info('Opening user menu');
    await this.click(this.userMenu);
    await this.page.waitForSelector(this.userMenuDropdown);
  }

  /**
   * Realiza logout/cierre de sesión
   * 
   * COMPORTAMIENTO:
   * 1. Abre el menú de usuario (si no está abierto)
   * 2. Hace clic en el link de Logout
   * 3. Espera a que la página cargue (networkidle)
   * 4. Se redirige a la página de login
   * 5. La sesión se cierra y las cookies se invalidan
   * 
   * CUÁNDO USAR:
   * - Al final de un test para limpiar la sesión
   * - Para validar flujo de logout
   * - Para validar que el logout redirige a login
   * 
   * USO:
   * await homePage.logout();
   * // Ahora estamos en la página de login
   * const isOnLogin = await homePage.isOnLoginPage();
   * expect(isOnLogin).toBeTruthy();
   * 
   * O con validación de formulario:
   * await homePage.logout();
   * const isFormVisible = await loginPage.isLoginFormVisible();
   * expect(isFormVisible).toBeTruthy();
   * 
   * NOTA:
   * - Espera networkidle (esto es importante)
   * - Si el logout es muy rápido, puede no esperar bien
   * - Usar esta en lugar de link directo a logout page
   */
  async logout(): Promise<void> {
    logger.info('Performing logout');
    await this.openUserMenu();
    await this.click(this.logoutLink);
    await this.page.waitForLoadState('networkidle');
  }

  // ===================================
  // MÉTODOS DE NAVEGACIÓN Y ESTADO
  // ===================================

  /**
   * Verifica si estamos actualmente en la página de login
   * 
   * @returns true si la URL contiene '/auth/login', false si no
   * 
   * COMPORTAMIENTO:
   * - Obtiene la URL actual
   * - Verifica si contiene '/auth/login'
   * - Retorna true/false
   * 
   * CUÁNDO USAR:
   * - Después de logout, validar que fuimos a login
   * - Validar que se cerró la sesión correctamente
   * - Validar redirecciones
   * 
   * USO:
   * await homePage.logout();
   * const isOnLogin = await homePage.isOnLoginPage();
   * expect(isOnLogin).toBeTruthy();
   * // Si falla, significa que no fue a login
   * 
   * EJEMPLOS DE URLS:
   * ✓ 'https://...../auth/login' → true
   * ✓ 'https://...../auth/login?redirect=dashboard' → true
   * ✗ 'https://...../dashboard' → false
   * ✗ 'https://...../profile' → false
   * 
   * NOTA:
   * - Búsqueda por string es poco segura
   * - Mejor usar una expresión regular si necesitas precisión
   * - '/auth/login' está casi siempre en URLs de login
   */
  async isOnLoginPage(): Promise<boolean> {
    const url = await this.getCurrentUrl();
    return url.includes('/auth/login');
  }

  /**
   * Obtiene la URL completa actual del dashboard
   * 
   * @returns La URL actual del navegador
   * 
   * COMPORTAMIENTO:
   * - Lee la URL del navegador
   * - Incluye protocolo, dominio, ruta y parámetros
   * - Útil para validar redirecciones
   * 
   * CUÁNDO USAR:
   * - Validar que se redirigió al dashboard
   * - Validar URLs específicas de páginas
   * - Debug de problemas de navegación
   * 
   * USO:
   * const url = await homePage.getCurrentDashboardUrl();
   * expect(url).toContain('/dashboard/index');
   * 
   * EJEMPLOS DE URLS:
   * - 'https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index'
   * - 'https://...../dashboard/index?lang=en'
   * 
   * DIFERENCIA CON isOnLoginPage():
   * - isOnLoginPage(): solo verifica si es login
   * - getCurrentDashboardUrl(): obtiene URL completa para validaciones
   * 
   * NOTA:
   * - Esta es una envoltura de BasePage.getCurrentUrl()
   * - El nombre es descriptivo pero hace lo mismo
   * - Podría refactorizarse a solo getCurrentUrl()
   */
  async getCurrentDashboardUrl(): Promise<string> {
    return await this.getCurrentUrl();
  }
}
