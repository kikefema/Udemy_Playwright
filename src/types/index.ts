/**
 * =====================================================
 * TIPOS - Definiciones de TypeScript Personalizadas
 * =====================================================
 * 
 * QUÉ SON TIPOS EN TYPESCRIPT:
 * - Definen la forma de un objeto
 * - Verifican que pasemos datos correctamente
 * - Ayuda a evitar errores
 * - El IDE te ayuda con autocomplete
 * 
 * INTERFACES vs TYPE:
 * - interface TestUser {...} → Para objetos que pueden extenderse
 * - type Environment = 'a' | 'b' → Para tipos simples o uniones
 * 
 * VENTAJAS DE USAR TIPOS:
 * - Type-safe (TypeScript verifica)
 * - Autocomplete en IDE
 * - Documentación automática
 * - Errores en tiempo de compilación (no en runtime)
 * - Código más mantenible
 * 
 * USO:
 * - Se importan en: helpers.ts, tests, Page Objects
 * - Se verifican automáticamente en compile time
 * - Si usas algo incorrecto, TypeScript lo detecta
 */

/**
 * INTERFACE: TestUser
 * 
 * Define estructura de un usuario de test
 * 
 * PROPIEDADES:
 * - email: string → Email del usuario
 * - password: string → Contraseña del usuario
 * 
 * USO:
 * Cuando necesitas un usuario para login
 * 
 * EJEMPLO:
 * const user: TestUser = {
 *   email: 'admin@orangehrm.com',
 *   password: 'admin123'
 * };
 * 
 * En constants.ts:
 * export const TEST_USER: TestUser = {
 *   email: 'Admin',
 *   password: 'admin123'
 * };
 * 
 * En tests:
 * const user: TestUser = TEST_USER;
 * await loginPage.login(user.email, user.password);
 * 
 * VENTAJA:
 * - Si intentas: user.username (no existe)
 * - TypeScript lanza error
 * - Evita typos como: user.pasword (falta 's')
 * 
 * NOTA:
 * En OrangeHRM:
 * - email es "Admin" (el username)
 * - password es "admin123"
 * - Aunque se llama email, realmente es username
 * (así está configurado en el proyecto)
 * 
 * OPCIONES FUTURAS:
 * Si necesitas más campos:
 * interface TestUser {
 *   email: string;
 *   password: string;
 *   firstName?: string;  // opcional (?)
 *   lastName?: string;   // opcional (?)
 * }
 */
export interface TestUser {
  email: string;
  password: string;
}

/**
 * INTERFACE: TestData
 * 
 * Define estructura de datos de test generados
 * 
 * PROPIEDADES:
 * - email: string → Email generado para el test
 * - username: string → Username generado
 * - timestamp: string → Cuándo se generó (ISO string)
 * 
 * USO:
 * Cuando generas datos dinámicos para tests
 * 
 * GENERACIÓN:
 * En helpers.ts, función generateTestData():
 * ```
 * function generateTestData(prefix: string): TestData {
 *   return {
 *     email: `${prefix}_${timestamp}@test.com`,
 *     username: `user_${timestamp}`,
 *     timestamp: new Date().toISOString()
 *   };
 * }
 * ```
 * 
 * EJEMPLO DE USO:
 * const testData: TestData = generateTestData('smoke_test');
 * console.log(testData.email); // smoke_test_1704067272000@test.com
 * 
 * VENTAJAS:
 * - Datos únicos para cada test
 * - Timestamp para debugging
 * - Evita conflictos entre tests paralelos
 * - Fácil identificar desde cuándo corre
 * 
 * CASOS DE USO:
 * - Crear usuarios temporales
 * - Generar datos para formularios
 * - Tests que requieren datos dinámicos
 * - Evitar conflictos en tests paralelos
 * 
 * NOTA:
 * En nuestros tests actuales no se usa mucho
 * porque OrangeHRM Demo usa Admin/admin123
 * Pero está aquí para tests futuros con registro
 */
export interface TestData {
  email: string;
  username: string;
  timestamp: string;
}

/**
 * TYPE: Environment
 * 
 * Define qué ambientes/entornos son válidos
 * 
 * VALORES PERMITIDOS:
 * - 'development' → Ambiente local (laptop)
 * - 'staging' → Servidor de pruebas (más real)
 * - 'production' → Servidor en vivo (con datos reales)
 * 
 * USO:
 * Cuando necesitas saber en qué ambiente estás corriendo
 * 
 * EJEMPLO:
 * const env: Environment = 'production';
 * 
 * En constants.ts:
 * const ENVIRONMENT: Environment = 'production';
 * 
 * SI USAS VALOR INVÁLIDO:
 * const env: Environment = 'testing'; // ERROR: no permitido
 * 
 * VENTAJA:
 * TypeScript verifica que solo uses valores válidos
 * 
 * CONFIGURACIÓN:
 * En env.ts:
 * const ENVIRONMENT: Environment = 
 *   (process.env.ENVIRONMENT as Environment) || 'development';
 * 
 * En .env:
 * ENVIRONMENT=production
 * 
 * COMPORTAMIENTO POR AMBIENTE:
 * - development: Headless=false (ves el navegador)
 * - staging: Timeout normal, logs detallados
 * - production: Timeout reducido, menos logs
 * 
 * VENTAJAS:
 * - Código diferente según donde corre
 * - Tests saben en qué ambiente están
 * - Configuración centralizada
 * - Type-safe
 * 
 * FUTURO:
 * Si necesitas más ambientes:
 * type Environment = 'development' | 'staging' | 'production' | 'qa';
 */
export type Environment = 'development' | 'staging' | 'production';

/**
 * INTERFACE: PageOptions
 * 
 * Define opciones para navegación de páginas
 * 
 * PROPIEDADES:
 * - url?: string → URL a la que navegar (opcional)
 * - timeout?: number → Timeout en milisegundos (opcional)
 * 
 * NOTA: El ? significa OPCIONAL
 * - No necesitas proporcionar ambos
 * - Puedes usar solo url, solo timeout, o ambos
 * 
 * USO:
 * Cuando necesitas navegar con opciones personalizadas
 * 
 * EJEMPLO SIN OPTIONS:
 * await page.goto('https://example.com');
 * 
 * EJEMPLO CON OPTIONS:
 * const options: PageOptions = {
 *   url: 'https://example.com',
 *   timeout: 30000  // 30 segundos
 * };
 * await page.goto(options.url, { timeout: options.timeout });
 * 
 * EN BASEPAGE (Potencial uso):
 * async goto(options: PageOptions) {
 *   await this.page.goto(options.url || this.baseUrl, {
 *     waitUntil: 'networkidle',
 *     timeout: options.timeout || 30000
 *   });
 * }
 * 
 * LLAMADA:
 * await basePage.goto({ url: 'https://...', timeout: 20000 });
 * 
 * VENTAJAS:
 * - Navegación más flexible
 * - Timeout personalizado por navegación
 * - Type-safe
 * - Documentación integrada
 * 
 * NOTA:
 * En nuestro proyecto actual se usa poco
 * Principalmente en BasePage.goto()
 * Pero está disponible para tests avanzados
 */
export interface PageOptions {
  url?: string;
  timeout?: number;
}
