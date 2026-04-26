/**
 * =====================================================
 * CONFIGURACIÓN - Variables de Entorno
 * =====================================================
 * 
 * Este archivo EXPORTA las variables de entorno
 * como un objeto centralizado que se puede usar
 * en cualquier parte del código.
 * 
 * FUENTE DE DATOS:
 * - Archivo .env (cargado por Playwright automáticamente)
 * - Variables de sistema del OS
 * - Valores por defecto definidos aquí
 * 
 * VENTAJAS:
 * - Código no tiene valores hardcodeados
 * - Fácil cambiar configuración sin editar código
 * - Diferentes valores para dev/test/prod
 * - Variables sensibles no están en el repo (Git)
 * 
 * CÓMO FUNCIONA:
 * 1. Creas archivo .env en la raíz del proyecto
 * 2. Pones: BASE_URL=https://staging.example.com
 * 3. Aquí accedes: process.env.BASE_URL
 * 4. Si no existe, usa valor por defecto
 */

/**
 * OBJETO ENV - Centraliza todas las variables de entorno
 * 
 * PROPIEDADES:
 * - BASE_URL: URL de la aplicación a testear
 * - ENVIRONMENT: dev/staging/production
 * - HEADLESS: true/false (navegador visible o no)
 * - SLOW_MO: milisegundos de pausa entre acciones
 * - TIMEOUT: tiempo máximo para esperas
 * - RETRIES: reintentos de tests fallidos
 * - WORKERS: número de workers paralelos
 * - LOG_LEVEL: DEBUG/INFO/WARN/ERROR
 */
export const ENV = {
  /**
   * BASE_URL - URL base de la aplicación a testear
   * 
   * VALOR POR DEFECTO:
   * 'https://example.com' (debes cambiar a tu app)
   * 
   * CÓMO CAMBIAR:
   * 1. En .env: BASE_URL=https://tu-app.com
   * 2. En terminal: BASE_URL=https://tu-app.com npm test
   * 
   * USO EN TESTS:
   * const url = ENV.BASE_URL + '/login';
   * await page.goto(url);
   * 
   * IMPORTA EN:
   * - constants.ts (construye LOGIN_URL, DASHBOARD_URL)
   * - Fixtures si necesitas URLs dinámicas
   */
  BASE_URL: process.env.BASE_URL || 'https://example.com',

  /**
   * ENVIRONMENT - Ambiente de ejecución
   * 
   * VALORES VÁLIDOS:
   * - 'development' → servidor local
   * - 'staging' → servidor de QA/tests
   * - 'production' → servidor en vivo
   * 
   * CÓMO CAMBIAR:
   * ENVIRONMENT=staging npm test
   * 
   * USO EN TESTS:
   * if (ENV.ENVIRONMENT === 'production') {
   *   // Usar datos reales
   * } else {
   *   // Usar datos de test
   * }
   * 
   * CASOS DE USO:
   * - Diferentes URLs por ambiente
   * - Diferentes usuarios de test
   * - Diferentes validaciones
   * - Saltar ciertos tests en producción
   */
  ENVIRONMENT: process.env.ENVIRONMENT || 'development',

  /**
   * HEADLESS - Ejecutar sin interfaz visual
   * 
   * VALORES:
   * - true → navegador se abre pero no visible (headless mode)
   * - false → navegador visible (útil para debug)
   * 
   * CÓMO CAMBIAR:
   * HEADLESS=false npm test
   * // Verás el navegador ejecutar los tests
   * 
   * CÓMO FUNCIONA:
   * - El valor de .env es string: "false"
   * - process.env.HEADLESS !== 'false' → true (headless)
   * - Si está explícitamente en 'false', usa false
   * 
   * CASOS DE USO:
   * - HEADLESS=true en CI/CD (sin interfaz gráfica)
   * - HEADLESS=false en desarrollo (ver qué pasa)
   * - HEADLESS=false para debug de tests fallidos
   * 
   * NOTA:
   * El navegador se abre de todas formas
   * Solo cambia si lo ves o no
   */
  HEADLESS: process.env.HEADLESS !== 'false',

  /**
   * SLOW_MO - Ralentizar las acciones (en milisegundos)
   * 
   * ÚTIL PARA:
   * - Debug visual: ver qué hace el test
   * - Videos: ver el test en cámara lenta
   * - Entender el flujo del test
   * 
   * VALORES TÍPICOS:
   * - 0 → rápido (acción inmediata)
   * - 500 → medio (0.5 segundo entre acciones)
   * - 1000 → lento (1 segundo entre acciones)
   * 
   * CÓMO CAMBIAR:
   * SLOW_MO=1000 npm test
   * // Verás cada acción en cámara lenta
   * 
   * USO EN PLAYWRIGHT:
   * Se usa automáticamente en playwright.config.ts
   * No necesitas usarlo directamente en tests
   * 
   * NOTA:
   * parseInt convierte string a número
   * '0' → 0 (rápido)
   * '1000' → 1000 (lento)
   * no especificado → 0 (por defecto)
   */
  SLOW_MO: parseInt(process.env.SLOW_MO || '0', 10),

  /**
   * TIMEOUT - Tiempo máximo de espera (en milisegundos)
   * 
   * USADO PARA:
   * - Esperadas de elementos: waitForSelector(selector, { timeout })
   * - Esperadas de navegación: waitForLoadState()
   * - Timeout global de test
   * 
   * VALOR POR DEFECTO:
   * 30000 (30 segundos)
   * 
   * CUÁNDO CAMBIAR:
   * - Conexión lenta: TIMEOUT=60000 npm test
   * - Tests rápidos: TIMEOUT=5000 npm test
   * 
   * USO EN TESTS:
   * await page.waitForSelector(selector, { timeout: 5000 });
   * // Espera máximo 5 segundos
   * 
   * NOTA:
   * Cada test tiene su propio timeout
   * Si un test tarda más, falla
   * Se configura en playwright.config.ts
   */
  TIMEOUT: parseInt(process.env.TIMEOUT || '30000', 10),

  /**
   * RETRIES - Reintentos de tests fallidos
   * 
   * USADO PARA:
   * - Si un test falla, vuelve a ejecutarse N veces
   * - Útil para problemas de timing/red intermitentes
   * 
   * VALORES:
   * - 0 → sin reintentos (falla una vez = falla)
   * - 1 → 1 reintento (máximo 2 ejecuciones)
   * - 2 → 2 reintentos (máximo 3 ejecuciones)
   * 
   * CÓMO CAMBIAR:
   * RETRIES=2 npm test
   * 
   * IMPORTANTE:
   * Se configura en playwright.config.ts, no aquí
   * Esta variable es para referencia
   * 
   * CUÁNDO USAR:
   * - En CI/CD (CI? → RETRIES=2)
   * - En desarrollo (DEV → RETRIES=0)
   * - Tests flaky (inestables)
   * 
   * ADVERTENCIA:
   * Los reintentos pueden ocultar problemas reales
   * Mejor arreglar el problema que aumentar reintentos
   */
  RETRIES: parseInt(process.env.RETRIES || '0', 10),

  /**
   * WORKERS - Número de workers paralelos
   * 
   * USADO PARA:
   * - Ejecutar múltiples tests al mismo tiempo
   * - Acelerar la ejecución total
   * 
   * VALORES:
   * - undefined → automático (usa CPUs disponibles)
   * - 1 → secuencial (un test a la vez)
   * - 4 → 4 tests en paralelo
   * - 10 → 10 tests en paralelo
   * 
   * CÓMO CAMBIAR:
   * WORKERS=4 npm test
   * 
   * CUÁNDO USAR:
   * - WORKERS=1 en CI/CD si hay problemas
   * - WORKERS=auto en desarrollo
   * - WORKERS=undefined para que decida solo
   * 
   * NOTA:
   * Más workers = más consumo de CPU/memoria
   * Si el servidor no aguanta, usar WORKERS=1
   * 
   * CÓMO FUNCIONA:
   * - WORKERS="4" (string) → 4
   * - Si no existe → undefined (Playwright decide)
   * - parseInt solo si existe y es válido
   */
  WORKERS: process.env.WORKERS ? parseInt(process.env.WORKERS, 10) : undefined,

  /**
   * LOG_LEVEL - Nivel de detalle del logging
   * 
   * VALORES VÁLIDOS:
   * - 'DEBUG' → muestra TODO (incluyendo detalles internos)
   * - 'INFO' → información normal (recomendado)
   * - 'WARN' → solo advertencias y errores
   * - 'ERROR' → solo errores críticos
   * 
   * CÓMO CAMBIAR:
   * LOG_LEVEL=DEBUG npm test
   * // Verás muchísima información
   * 
   * LOG_LEVEL=ERROR npm test
   * // Verás solo errores
   * 
   * USO EN CÓDIGO:
   * logger.debug('Mensaje de debug'); // Solo si LOG_LEVEL=DEBUG
   * logger.info('Mensaje info'); // Si LOG_LEVEL=DEBUG o INFO
   * logger.warn('Advertencia'); // Si LOG_LEVEL != ERROR
   * logger.error('Error'); // Siempre se muestra
   * 
   * RECOMENDACIÓN:
   * - Desarrollo: LOG_LEVEL=DEBUG
   * - Tests: LOG_LEVEL=INFO
   * - CI/CD: LOG_LEVEL=WARN
   * 
   * NOTA:
   * En utils/logger.ts se implementa la lógica
   * Aquí solo se define el valor
   */
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
};

/**
 * EXPORTA el objeto ENV como default
 * 
 * PERMITE USAR:
 * import ENV from '@config/env';
 * console.log(ENV.BASE_URL);
 * 
 * O:
 * import { ENV } from '@config/env';
 * console.log(ENV.BASE_URL);
 */
export default ENV;
