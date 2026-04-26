/**
 * =====================================================
 * PLAYWRIGHT CONFIGURATION - CON COMENTARIOS COMPLETOS
 * =====================================================
 * 
 * ARCHIVO ORIGINAL: playwright.config.ts
 * ESTE ARCHIVO: playwright.config.commented.ts
 * 
 * QUÉ ES ESTO:
 * Configuración central de Playwright
 * Define CÓMO ejecutar los tests
 * Afecta TODOS los tests
 * 
 * IMPORTANCIA:
 * - Error aquí = todos los tests afectados
 * - Cambios aquí = cambia comportamiento global
 * - Review regular = mantiene tests rápidos
 * 
 * PATRÓN:
 * export default defineConfig({ ... })
 * defineConfig() = función que valida config
 * Retorna objeto de configuración
 */

import { defineConfig, devices } from '@playwright/test';

/**
 * =====================================================
 * SECCIÓN 1: VARIABLES DE ENTORNO (COMENTADAS)
 * =====================================================
 * 
 * Código comentado abajo:
 * // import dotenv from 'dotenv';
 * // import path from 'path';
 * // dotenv.config({ path: path.resolve(__dirname, '.env') });
 * 
 * QUÉ HACE:
 * Carga variables desde archivo .env
 * 
 * POR QUÉ ESTÁ COMENTADO:
 * Proyecto usa variables del SISTEMA
 * No usa archivo .env local
 * Variables se definen en terminal/CI
 * 
 * CUÁNDO DESCOMMENTAR:
 * Si necesitas file .env local
 * npm install dotenv primero
 * Crea .env en raíz del proyecto
 * NUNCA commites .env (solo .env.example)
 * 
 * VARIABLES COMUNES EN .env:
 * BASE_URL=https://localhost:3000
 * ENVIRONMENT=local
 * HEADLESS=false
 * SLOW_MO=100
 * TIMEOUT=30000
 */

// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * =====================================================
 * CONFIGURACIÓN PRINCIPAL: defineConfig({...})
 * =====================================================
 * 
 * PARÁMETROS PRINCIPALES:
 * - testDir: dónde están los tests
 * - testMatch: qué archivos son tests
 * - fullyParallel: ejecutar tests en paralelo
 * - forbidOnly: fallar si hay test.only
 * - retries: reintentos en CI
 * - workers: cuántos workers en paralelo
 * - reporter: cómo mostrar resultados
 * - timeout: límite de tiempo por test
 * - use: opciones compartidas
 * - projects: qué browsers usar
 */
export default defineConfig({
  /**
   * =====================================================
   * PARÁMETRO 1: testDir
   * =====================================================
   * 
   * QUÉ SIGNIFICA:
   * testDir: './src/tests'
   * 
   * INTERPRETAR:
   * './' = raíz del proyecto
   * '/src/tests' = ir a src → ir a tests
   * RUTA: c:\Users\...\Udemy_Playwright\src\tests
   * 
   * QUÉ BUSCA:
   * Playwright BUSCA en todo este directorio
   * Incluye subdirectorios (recursivo)
   * Busca archivos que cumplan testMatch
   * 
   * ESTRUCTURA ACTUAL:
   * src/tests/
   *   ├── auth/
   *   │   ├── login.spec.ts
   *   │   └── dashboard.spec.ts
   *   └── smoke/
   *       └── smoke.spec.ts
   * 
   * TODOS estos se ejecutan porque:
   * ✓ Están en ./src/tests
   * ✓ Cumplen pattern **.spec.ts
   * 
   * SI CAMBIAS:
   * testDir: './tests'
   * → Busca en /tests (no /src/tests)
   * → Podría no encontrar nada
   * → NO EJECUTA TESTS
   * 
   * BEST PRACTICE:
   * - Usar carpeta src/tests
   * - Organizar por funcionalidad (auth/, dashboard/, etc)
   * - Usar estructura clara
   */
  testDir: './src/tests',

  /**
   * =====================================================
   * PARÁMETRO 2: testMatch
   * =====================================================
   * 
   * QUÉ SIGNIFICA:
   * testMatch: '**/*.spec.ts'
   * 
   * PATRÓN GLOB EXPLICADO:
   * ** = cualquier número de carpetas
   * *.spec.ts = archivo terminado en .spec.ts
   * 
   * EJEMPLOS QUE COINCIDEN:
   * ✓ login.spec.ts
   * ✓ dashboard.spec.ts
   * ✓ smoke.spec.ts
   * ✓ src/tests/auth/login.spec.ts
   * ✓ src/tests/auth/subfolder/test.spec.ts
   * 
   * EJEMPLOS QUE NO COINCIDEN:
   * ✗ login.test.ts (termina en .test.ts)
   * ✗ login.ts (no tiene .spec)
   * ✗ login.spec.js (es JavaScript, no TypeScript)
   * ✗ utils.spec.ts (está fuera testDir)
   * 
   * VARIACIONES:
   * testMatch: '**/*.{test,spec}.ts'
   * → Acepta .test.ts O .spec.ts
   * 
   * testMatch: '**/!(*.skip).spec.ts'
   * → Ignora archivos que contienen .skip
   * 
   * CUÁNDO CAMBIAR:
   * - Si renombras extensión test
   * - Si agregas nuevos patrones
   * - Si quieres ignorar algunos tests
   * 
   * CURRENT SETUP:
   * Busca en testDir='./src/tests'
   * Pattern testMatch='**/*.spec.ts'
   * RESULTADO: Encuentra los 3 test files principales
   */
  testMatch: '**/*.spec.ts',

  /**
   * =====================================================
   * PARÁMETRO 3: fullyParallel
   * =====================================================
   * 
   * QUÉ SIGNIFICA:
   * fullyParallel: true
   * 
   * true = ejecutar todos los tests EN PARALELO
   * false = ejecutar tests SECUENCIALMENTE
   * 
   * EJEMPLO CON PARALELO (true):
   * Test 1: █████░░░░░░░░░░░░░ (5 segundos)
   * Test 2: ░███████░░░░░░░░░░ (7 segundos)
   * Test 3: ░███████░░░░░░░░░░ (7 segundos)
   * Test 4: ░░███████░░░░░░░░░ (7 segundos)
   * ------- TOTAL: ~7 segundos
   * 
   * EJEMPLO SIN PARALELO (false):
   * Test 1: ███░░░░░░░░░░░░░░░░ (5 segundos)
   * Test 2: ░███░░░░░░░░░░░░░░░ (7 segundos)
   * Test 3: ░░░███░░░░░░░░░░░░░ (7 segundos)
   * Test 4: ░░░░███░░░░░░░░░░░░ (7 segundos)
   * ------- TOTAL: ~26 segundos
   * 
   * VENTAJAS DE PARALELO:
   * ✓ Mucho más rápido (3-5x más rápido)
   * ✓ Usa recursos del PC
   * ✓ Feedback más rápido
   * ✓ Ideal para CI/CD
   * 
   * DESVENTAJAS DE PARALELO:
   * ✗ Tests compiten por recursos
   * ✗ Puede causar flakiness
   * ✗ Debugging más difícil
   * ✗ Si tests comparten estado → problemas
   * 
   * CASOS DONDE CAMBIAR:
   * fullyParallel: false
   * - Si tests comparten base de datos
   * - Si tests comparten sesión
   * - Debugging/troubleshooting
   * - Tests muy lentos
   * 
   * PROYECTO ACTUAL:
   * fullyParallel: true
   * Cada test es independiente
   * Cada abre su propio navegador
   * NO comparten estado
   * SEGURO usar paralelo
   * 
   * NOTA IMPORTANTE:
   * Describe blocks ejecutan SECUENCIALMENTE
   * describe A: login tests
   * describe B: dashboard tests
   * A ejecuta primero, luego B
   * PERO dentro de cada describe → paralelo
   */
  fullyParallel: true,

  /**
   * =====================================================
   * PARÁMETRO 4: forbidOnly
   * =====================================================
   * 
   * QUÉ SIGNIFICA:
   * forbidOnly: !!process.env.CI
   * 
   * DESGLOSAR:
   * process.env.CI
   * → Variable de entorno llamada CI
   * → En CI/CD = 'true' o '1'
   * → En local = undefined
   * 
   * !!variable
   * → Convierte a booleano
   * → !!undefined = false
   * → !!'true' = true
   * 
   * RESULTADO:
   * Si estás en CI: forbidOnly = true
   * Si estás localmente: forbidOnly = false
   * 
   * QUÉ HACE forbidOnly:
   * 
   * Si forbidOnly = true:
   * - Si hay test.only() en código → FALLA
   * - Previene accidentes
   * 
   * Si forbidOnly = false:
   * - test.only() está permitido
   * - Útil para debugging local
   * 
   * EJEMPLO:
   * 
   * test.only('Just this one', async () => {
   *   // Solo este test se ejecuta
   * });
   * 
   * test('Other', async () => {
   *   // Este se ignora
   * });
   * 
   * EN LOCAL:
   * ✓ Puedes usar test.only()
   * ✓ Sirve para debugging
   * ✓ test.only() se ejecuta
   * 
   * EN CI:
   * ✗ forbidOnly=true
   * ✗ Si hay test.only() → BUILD FALLA
   * ✗ Previene accidentes
   * 
   * CASO REAL:
   * Dev olvida remover test.only()
   * Commiteó a git
   * En CI detecta forbidOnly violación
   * Build falla
   * Previene que llegue a producción
   * 
   * BEST PRACTICE:
   * Siempre usa !!process.env.CI
   * Previene bugs en CI
   */
  forbidOnly: !!process.env.CI,

  /**
   * =====================================================
   * PARÁMETRO 5: retries
   * =====================================================
   * 
   * QUÉ SIGNIFICA:
   * retries: process.env.CI ? 2 : 0
   * 
   * LÓGICA:
   * Si estás en CI → retries = 2
   * Si estás localmente → retries = 0
   * 
   * QUÉ HACE:
   * Si un test falla → reintentar N veces
   * 
   * EJEMPLO CON retries: 2:
   * Test 'Login' falla en intento 1
   * Reintentar (intento 2)
   * Pasa en intento 2
   * ✓ TEST PASA FINALMENTE
   * 
   * RAZONES PARA FALLOS TEMPORALES:
   * - Network flaky (internet inestable)
   * - Browser timing issues
   * - Server lento
   * - Race conditions
   * - Flakiness en tests (mala escritura)
   * 
   * EN LOCAL: retries = 0
   * ✓ Falla inmediatamente si hay problema
   * ✓ Mejor para debugging
   * ✓ Ves el error real
   * 
   * EN CI: retries = 2
   * ✓ Tolera fallos temporales
   * ✓ Network puede ser inestable
   * ✓ Menos false negatives
   * ✗ Puede pasar tests que están rotos
   * 
   * VALORES TÍPICOS:
   * retries: 0 = Sin reintentos (local)
   * retries: 1 = 1 reintento
   * retries: 2 = 2 reintentos (CI common)
   * retries: 3+ = Demasiados, problemas subyacentes
   * 
   * NOTA IMPORTANTE:
   * Retries = ADICIONAL
   * retries: 2 = 3 intentos totales (inicial + 2 retries)
   * 
   * CUIDADO:
   * Si test es flaky → más retries no es solución
   * Hay que arreglarlo, no esconderlo con retries
   * 
   * PROYECTO ACTUAL:
   * retries: process.env.CI ? 2 : 0
   * Buen balance:
   * - Local: debugging rápido (0 retries)
   * - CI: tolerancia a fallos (2 retries)
   */
  retries: process.env.CI ? 2 : 0,

  /**
   * =====================================================
   * PARÁMETRO 6: workers
   * =====================================================
   * 
   * QUÉ SIGNIFICA:
   * workers: process.env.CI ? 1 : undefined
   * 
   * LÓGICA:
   * Si estás en CI → workers = 1
   * Si estás localmente → workers = undefined (default)
   * 
   * QUÉ HACE:
   * Número de workers = cuántos tests EN PARALELO
   * 
   * VALORES:
   * workers: 1 = Un test a la vez (SECUENCIAL)
   * workers: 2 = Dos tests simultáneamente
   * workers: 4 = Cuatro tests simultáneamente
   * workers: undefined = Auto (# de CPUs)
   * 
   * EJEMPLO LOCAL (undefined):
   * CPU con 8 cores
   * workers: undefined → workers: 8
   * 8 tests EN PARALELO
   * 
   * EN CI: workers: 1
   * ✓ Un test a la vez
   * ✓ CI recursos limitados
   * ✓ Evita contención
   * ✓ Más estable
   * ✗ Más lento
   * 
   * LOCAL: workers: undefined
   * ✓ Usa todos los cores
   * ✓ Muy rápido
   * ✓ Feedback instantáneo
   * 
   * POR QUÉ DIFERENTE EN CI:
   * - CI servers tienen pocos cores
   * - Resources compartidos con otros jobs
   * - 1 worker = más estable
   * - Evita flakiness por resource contention
   * 
   * COMBINADO CON fullyParallel:
   * fullyParallel: true + workers: 8
   * = 8 tests EN PARALELO
   * 
   * fullyParallel: true + workers: 1
   * = 1 test a la vez (debido a workers: 1)
   * fullyParallel no afecta si workers: 1
   * 
   * PROYECTO ACTUAL:
   * Buena configuración:
   * - Local: paralelo rápido
   * - CI: secuencial estable
   */
  workers: process.env.CI ? 1 : undefined,

  /**
   * =====================================================
   * PARÁMETRO 7: reporter
   * =====================================================
   * 
   * QUÉ SIGNIFICA:
   * reporter: [
   *   ['html'],
   *   ['list'],
   * ]
   * 
   * Array de reporters
   * Cada uno formatea salida diferente
   * 
   * REPORTER 1: 'html'
   * =====================================================
   * 
   * QUÉ GENERA:
   * Archivo HTML interactivo con resultados
   * 
   * UBICACIÓN:
   * playwright-report/index.html
   * 
   * CONTENIDO:
   * ✓ Test results (pass/fail)
   * ✓ Screenshots de fallos
   * ✓ Videos (si está configurado)
   * ✓ Traces para debugging
   * ✓ Timeline de ejecución
   * ✓ Estadísticas
   * 
   * CÓMO VERLO:
   * npx playwright show-report
   * → Abre en navegador automáticamente
   * 
   * VENTAJAS:
   * ✓ Visual
   * ✓ Fácil de compartir
   * ✓ Debugging detallado
   * ✓ Perfecto para revisar en CI
   * 
   * REPORTER 2: 'list'
   * =====================================================
   * 
   * QUÉ GENERA:
   * Salida en terminal (stdout)
   * Formato: lista simple
   * 
   * EJEMPLO SALIDA:
   * ✓ Login - should login successfully (2.5s)
   * ✓ Dashboard - should display user menu (1.2s)
   * ✗ Logout - should logout correctly (3.1s)
   *   Error: button not found
   * 
   * VENTAJAS:
   * ✓ Realtime feedback
   * ✓ Fácil de leer en terminal
   * ✓ Funciona en CI
   * ✓ Integra con logging
   * 
   * OTROS REPORTERS DISPONIBLES:
   * 
   * 'dot': Imprime . ✓ F ✗
   *   Muy compact
   * 
   * 'json': Salida JSON
   *   Para parsear programáticamente
   * 
   * 'junit': XML para Jenkins/CI
   *   Para integración con sistemas
   * 
   * 'github': GitHub Actions format
   *   Muestra en PR comentarios
   * 
   * PROYECTO ACTUAL:
   * 2 reporters: buena combinación
   * html = análisis detallado
   * list = feedback inmediato
   */
  reporter: [
    ['html'],
    ['list'],
  ],

  /**
   * =====================================================
   * PARÁMETRO 8: timeout
   * =====================================================
   * 
   * QUÉ SIGNIFICA:
   * timeout: 30 * 1000
   * 
   * CÁLCULO:
   * 30 * 1000 = 30,000 milisegundos = 30 segundos
   * 
   * QUÉ DEFINE:
   * Tiempo MÁXIMO para que se ejecute UN TEST
   * 
   * EJEMPLO:
   * test('Login', async () => { ... });
   * 
   * Este test tiene 30 segundos
   * Si tarda > 30 segundos → FALLA
   * 
   * Error: test timeout of 30000ms exceeded
   * 
   * PASOS EN UN TEST:
   * 1. navigateToLogin (2s)
   * 2. fillUsername (0.5s)
   * 3. fillPassword (0.5s)
   * 4. click button (0.5s)
   * 5. waitForNavigation (2s)
   * 6. assertions (0.5s)
   * TOTAL: ~6 segundos
   * 
   * Timeout: 30s → SUFICIENTE
   * 
   * CASOS DE TIMEOUT:
   * - Server muy lento
   * - Network lento
   * - Test infinito (bug)
   * - waitFor que nunca se cumple
   * 
   * TIMEOUT vs expect.timeout:
   * 
   * timeout: 30s
   * = Timeout del TEST COMPLETO
   * 
   * expect: { timeout: 5s } (abajo)
   * = Timeout de ASERCIONES
   * 
   * PROYECTO ACTUAL:
   * timeout: 30 * 1000 (30 segundos)
   * 
   * RECOMENDACIONES:
   * - Tests simples: 10-15s
   * - Tests complejos: 20-30s
   * - Nunca > 60s (muy largo)
   * - Si necesitas > 30s, test mal escrito
   */
  timeout: 30 * 1000,

  /**
   * =====================================================
   * PARÁMETRO 9: expect.timeout
   * =====================================================
   * 
   * QUÉ SIGNIFICA:
   * expect: {
   *   timeout: 5000
   * }
   * 
   * 5000 milisegundos = 5 segundos
   * 
   * QUÉ DEFINE:
   * Tiempo MÁXIMO para que se cumpla UNA ASERCIÓN
   * 
   * DIFERENCIA CON timeout:
   * 
   * timeout: 30s = Test completo
   * expect.timeout: 5s = Cada expect()
   * 
   * EJEMPLO:
   * 
   * expect(element).toBeVisible();
   * Espera máximo 5 segundos
   * Si > 5s element no visible → FALLA
   * 
   * PARÁMETRO ESPECIAL: 0
   * expect: { timeout: 0 }
   * = Sin timeout
   * = Espera infinitamente
   * = NO RECOMENDADO
   * 
   * CASOS COMUNES:
   * 
   * expect(page).toHaveURL('...')
   * Espera que URL cambie
   * 5s es bueno para navegaciones
   * 
   * expect(element).toBeVisible()
   * Espera que elemento aparezca
   * 5s tolerante para renders
   * 
   * expect(text).toContain('...')
   * Verifica texto
   * 5s okay para AJAX renders
   * 
   * PROYECTO ACTUAL:
   * expect.timeout: 5000
   * 
   * RECOMENDACIONES:
   * - Elemento visible: 5-10s
   * - Navegación: 5s
   * - Texto dinámico: 10-15s
   * - Esperar AJAX: 15-30s
   * - Nunca 0 (infinito)
   * 
   * OVERRIDE POR TEST:
   * Puedes cambiar en test:
   * 
   * await expect(element).toBeVisible({
   *   timeout: 10000 // 10 segundos
   * });
   */
  expect: {
    timeout: 5000,
  },

  /**
   * =====================================================
   * PARÁMETRO 10: use (OPCIONES COMPARTIDAS)
   * =====================================================
   * 
   * QUÉ SIGNIFICA:
   * use: { ... }
   * 
   * Opciones que se APLICAN A TODOS los projects
   * Si defines en use: se heredan
   * Si defines en project: override use
   * 
   * OPCIONES PRINCIPALES:
   */
  use: {
    /**
     * OPCIÓN 1: baseURL
     * =====================================================
     * 
     * QUÉ HACE:
     * baseURL: process.env.BASE_URL || 'https://example.com'
     * 
     * PATRÓN:
     * process.env.BASE_URL = variable de entorno
     * || 'https://example.com' = valor default
     * 
     * CONCATENACIÓN:
     * 
     * Si hace:
     * page.goto('/auth/login');
     * 
     * Playwright CONCATENA:
     * baseURL + '/auth/login'
     * = 'https://opensource-demo.orangehrm.com/web/index.php/auth/login'
     * (si BASE_URL está seteada)
     * 
     * VENTAJA:
     * ✓ Cambiar URL sin tocar tests
     * ✓ Local: localhost:3000
     * ✓ Production: example.com
     * ✓ QA: qa.example.com
     * ✓ Un solo comando para cambiar
     * 
     * PROYECTO ACTUAL:
     * baseURL = env.BASE_URL (en env.ts)
     * = 'https://opensource-demo.orangehrm.com/web/index.php'
     * 
     * EN TESTS:
     * page.goto(LOGIN_URL)
     * LOGIN_URL = BASE_URL + '/auth/login'
     * = completa URL
     */
    baseURL:
      process.env.BASE_URL || 'https://example.com',

    /**
     * OPCIÓN 2: trace
     * =====================================================
     * 
     * QUÉ HACE:
     * trace: 'on-first-retry'
     * 
     * Crea TRACE de test execution
     * Trace = grabación detallada:
     * - Network requests
     * - DOM changes
     * - Screenshots cada paso
     * - Console logs
     * - Performance metrics
     * 
     * VALORES:
     * 'on-first-retry' = crea trace si test falló 1 vez
     * 'on' = siempre crea trace
     * 'off' = nunca crea trace
     * 'retain-on-failure' = solo si falla
     * 
     * PATRÓN USADO: 'on-first-retry'
     * ✓ Test pasa = sin trace (no necesario)
     * ✓ Test falla 1ª vez = crea trace
     * ✓ Trace sirve para debugging
     * 
     * CÓMO VER TRACE:
     * npx playwright show-trace trace.zip
     * Abre viewer interactivo
     * Puedes ver:
     * - Cada step
     * - Estado de DOM
     * - Network requests
     * - Screenshots
     * 
     * VENTAJAS:
     * ✓ Debugging muy detallado
     * ✓ Ves exactamente qué pasó
     * ✓ Network debugging
     * ✓ Performance analysis
     * 
     * DESVENTAJAS:
     * ✗ Archivo .zip grande
     * ✗ Toma tiempo crear
     * ✗ Muchos archivos
     * 
     * RECOMENDACIÓN:
     * 'on-first-retry' es perfecto
     * Balance entre info y performance
     */
    trace: 'on-first-retry',

    /**
     * OPCIÓN 3: screenshot
     * =====================================================
     * 
     * QUÉ HACE:
     * screenshot: 'only-on-failure'
     * 
     * Toma screenshot de página
     * 
     * VALORES:
     * 'only-on-failure' = solo si test falla
     * 'on' = siempre toma screenshot
     * 'off' = nunca toma screenshot
     * 
     * VENTAJAS:
     * ✓ Ver estado visual cuando falla
     * ✓ Debugging visual
     * ✓ Verificar UI correcta
     * ✓ Comparar con expected
     * 
     * PROYECTO ACTUAL:
     * screenshot: 'only-on-failure'
     * 
     * CUANDO TEST FALLA:
     * Playwright toma screenshot
     * Guarda en: test-results/[testname].png
     * 
     * EJEMPLO UBICACIÓN:
     * test-results/
     *   test01-should-login-chromium/
     *     ├── test-finished-1.png (último estado)
     *     └── video.webm (si video: on)
     * 
     * CÓMO VER:
     * En HTML report aparecen screenshots
     * Click en failed test → ver screenshot
     * 
     * NOTA:
     * Screenshot toma tiempo
     * 'only-on-failure' es buen balance
     */
    screenshot: 'only-on-failure',

    /**
     * OPCIÓN 4: video
     * =====================================================
     * 
     * QUÉ HACE:
     * video: 'retain-on-failure'
     * 
     * Graba VIDEO del test
     * 
     * VALORES:
     * 'retain-on-failure' = solo si falla
     * 'on' = siempre grabar
     * 'off' = nunca grabar
     * 'retain-all' = todos (heavy)
     * 
     * VENTAJAS:
     * ✓ Ver secuencia de eventos
     * ✓ Debugging visual timeline
     * ✓ Ver clicks, typing
     * ✓ Velocidad de ejecución
     * 
     * DESVENTAJAS:
     * ✗ Archivo .webm muy grande
     * ✗ Toma tiempo grabar
     * ✗ Ralentiza tests
     * 
     * PROYECTO ACTUAL:
     * video: 'retain-on-failure'
     * 
     * UBICACIÓN:
     * test-results/[testname]/video.webm
     * 
     * CÓMO VER:
     * 1. HTML report → failed test
     * 2. Click en video.webm
     * 3. Abre en player
     * 4. Ver ejecución frame-by-frame
     * 
     * PERFORMANCE TIP:
     * Videos solo en CI
     * Local: video: 'off' (más rápido)
     * 
     * PROYECTO PODRÍA MEJORAR:
     * Usar: process.env.CI ? 'retain-on-failure' : 'off'
     * Vídeos solo en CI
     */
    video: 'retain-on-failure',
  },

  /**
   * =====================================================
   * PARÁMETRO 11: projects (BROWSERS)
   * =====================================================
   * 
   * QUÉ SIGNIFICA:
   * projects: [
   *   {
   *     name: 'chromium',
   *     use: { ...devices['Desktop Chrome'] }
   *   }
   * ]
   * 
   * Define qué BROWSERS ejecutar tests
   * 
   * PROYECTO ACTUAL:
   * Solo Chromium activo
   * Firefox, WebKit, Mobile comentados
   * 
   * QUÉ SIGNIFICA:
   * - Tests ejecutan SOLO en Chrome
   * - 1 run = 1 ejecución
   * 
   * SI DESCOMENTAS:
   * Firefox, WebKit, Mobile
   * - Tests ejecutan en 4 browsers
   * - 1 run = 4 ejecuciones (4x más lento)
   * 
   * PROYECTO ACTUAL - EXPLICADO:
   */
  projects: [
    /**
     * PROJECT 1: Chromium
     * =====================================================
     * 
     * {
     *   name: 'chromium',
     *   use: { ...devices['Desktop Chrome'] }
     * }
     * 
     * name: 'chromium'
     * = Nombre del proyecto
     * = Aparece en reportes
     * = En HTML: "Tests | Chromium"
     * 
     * use: { ...devices['Desktop Chrome'] }
     * 
     * devices['Desktop Chrome']
     * = Objeto con configuración Chrome
     * Incluye:
     * - browserName: 'chromium'
     * - viewport: { width: 1280, height: 720 }
     * - userAgent: 'Mozilla/5.0...'
     * - locale: 'en-US'
     * 
     * ... (spread operator)
     * = Copia todas las propiedades
     * = Puedes override:
     * 
     * use: {
     *   ...devices['Desktop Chrome'],
     *   viewport: { width: 1024, height: 768 } // override
     * }
     * 
     * CUÁNDO USAR:
     * - Desktop Chrome: navegadores desktop actuales
     * - Chrome es 70% del market share
     * - Tests más rápidos (solo Chromium)
     * - Suficiente para mayoría de casos
     * 
     * CÓMO EJECUTAR SOLO ESTE:
     * npx playwright test --project=chromium
     */
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    /**
     * PROJECT 2: Firefox (COMENTADO)
     * =====================================================
     * 
     * // {
     * //   name: 'firefox',
     * //   use: { ...devices['Desktop Firefox'] }
     * // }
     * 
     * SI DESCOMENTAS:
     * Tests corren en Firefox también
     * 
     * CUÁNDO DESCOMENTAR:
     * - Soporte oficial para Firefox
     * - 15% market share en algunos países
     * - Web specifics (CSS, JS differences)
     * - Testing cross-browser
     * 
     * CUÁNDO NO:
     * - Proyecto interno
     * - Usuarios son principalmente Chrome
     * - Performance crítica (2x más lento)
     * - CI/CD con recursos limitados
     * 
     * NOTA:
     * Firefox tarda más a descargar
     * Primera ejecución: ~1-2 minutos
     * Siguientes: más rápido (caché)
     */

    /**
     * PROJECT 3: WebKit (COMENTADO)
     * =====================================================
     * 
     * // {
     * //   name: 'webkit',
     * //   use: { ...devices['Desktop Safari'] }
     * // }
     * 
     * WebKit = Motor Safari
     * 
     * CUÁNDO DESCOMENTAR:
     * - iOS support importante
     * - Safari specific bugs
     * - Enterprise apps (Mac users)
     * 
     * CUÁNDO NO:
     * - Mobile Safari es 2% en desktop
     * - Complicaciones específicas de Safari
     * - Performance crítica
     * 
     * NOTA:
     * WebKit tiene quirks:
     * - No soporta headless bien
     * - Performance variable
     * - CSS differences
     */

    /**
     * PROJECT 4: Mobile (COMENTADO)
     * =====================================================
     * 
     * // {
     * //   name: 'Mobile Chrome',
     * //   use: { ...devices['Pixel 5'] }
     * // }
     * // {
     * //   name: 'Mobile Safari',
     * //   use: { ...devices['iPhone 12'] }
     * // }
     * 
     * CUÁNDO DESCOMENTAR:
     * - Mobile app testing
     * - Responsive design crítica
     * - Mobile es mayoría de users
     * 
     * CONFIGURACIONES DISPONIBLES:
     * devices['Pixel 5'] = Android phone
     * devices['iPhone 12'] = iOS phone
     * devices['iPad Pro'] = Tablet
     * devices['Pixel 5'] = small phone
     * 
     * VENTAJA:
     * Simula exacto dispositivo
     * Incluyendo:
     * - Viewport size
     * - User agent
     * - Device pixel ratio
     * - Touch events
     * 
     * DESVENTAJA:
     * Más lento (emulación)
     * Más complejo (gestures, touch)
     * 
     * NOTA:
     * 'Mobile Chrome' ≠ 'Chromium'
     * Mobile Chrome es emulado
     * Chromium es desktop
     */

    /**
     * PROJECT 5: Branded Browsers (COMENTADO)
     * =====================================================
     * 
     * // {
     * //   name: 'Microsoft Edge',
     * //   use: { ...devices['Desktop Edge'], channel: 'msedge' }
     * // }
     * // {
     * //   name: 'Google Chrome',
     * //   use: { ...devices['Desktop Chrome'], channel: 'chrome' }
     * // }
     * 
     * channel: 'msedge' = usa Edge instalado
     * channel: 'chrome' = usa Chrome instalado
     * 
     * DIFERENCIA CON CHROMIUM:
     * 
     * chromium (sin channel)
     * - Playwright descarga Chromium
     * - Headless-friendly
     * - Sandbox features
     * 
     * channel: 'chrome'
     * - Usa Chrome instalado en PC
     * - Real browser
     * - User extensions
     * - Slow
     * 
     * CUÁNDO USAR CHANNEL:
     * - Testing con real browser
     * - User extension testing
     * - Exact match testing
     * 
     * CUÁNDO NO:
     * - Performance critical
     * - CI/CD (requiere instalación)
     * - Headless needed
     * 
     * PROYECTO ACTUAL:
     * Comentado (no necesario)
     * Chromium es suficiente
     */
  ],

  /**
   * =====================================================
   * PARÁMETRO 12: webServer (COMENTADO)
   * =====================================================
   * 
   * // webServer: {
   * //   command: 'npm run start',
   * //   url: 'http://localhost:3000',
   * //   reuseExistingServer: !process.env.CI,
   * // }
   * 
   * QUÉ HACE:
   * Inicia un servidor antes de tests
   * 
   * CUÁNDO DESCOMENTAR:
   * Proyecto Next.js, React, Node local
   * Necesita servidor corriendo
   * 
   * PARÁMETROS:
   * 
   * command: 'npm run start'
   * = Qué comando ejecutar
   * = Playwright ejecuta antes de tests
   * = Cuando tests terminan → kill server
   * 
   * url: 'http://localhost:3000'
   * = URL del servidor
   * = Playwright espera que esté ready
   * = Max 30 segundos por default
   * 
   * reuseExistingServer: !process.env.CI
   * = true en local: reusar si ya está corriendo
   * = false en CI: always restart
   * 
   * PROYECTO ACTUAL:
   * Comentado porque:
   * - Tests van a orangehrm.com (externa)
   * - No necesita servidor local
   * - No hay Next.js/React local
   * 
   * SI FUERA LOCAL FULL STACK:
   * Descomentar y configurar
   */

  /**
   * =====================================================
   * CONFIGURACIÓN FINAL - RESUMEN
   * =====================================================
   * 
   * PROYECTO ACTUAL:
   * - Tests en: src/tests/**/*.spec.ts
   * - 47 tests totales (login, dashboard, smoke)
   * - Ejecuta en: Chromium (desktop)
   * - Paralelo: Sí (fullyParallel: true)
   * - Timeout: 30 segundos por test
   * - Workers: Auto en local, 1 en CI
   * - Retries: 0 en local, 2 en CI
   * - Reporters: HTML + List
   * - Capturas: Screenshots si fallan
   * - Videos: Grabar si fallan
   * - Traces: Crear si fallan
   * - Base URL: De env.BASE_URL
   * 
   * GOOD PRACTICES IMPLEMENTADAS:
   * ✓ Different config local vs CI
   * ✓ forbidOnly para prevenir accidentes
   * ✓ Reporters múltiples
   * ✓ Traces para debugging
   * ✓ Screenshots en fallos
   * ✓ Videos en fallos
   * ✓ Timeouts razonables
   * 
   * PODRÍAN MEJORARSE:
   * - Agregar cross-browser testing
   * - Agregar mobile testing
   * - Agregar baseURL fallback
   * - Agregar perforce markers
   * 
   * COMANDOS COMUNES:
   * 
   * npm run test
   * → Ejecuta todos los tests
   * 
   * npm run test -- --project=chromium
   * → Solo Chromium
   * 
   * npm run test -- --headed
   * → Abre navegador visible
   * 
   * npx playwright show-report
   * → Abre HTML report
   * 
   * npm run test -- --debug
   * → Debug mode (paso a paso)
   */
});
