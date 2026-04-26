/**
 * =====================================================
 * UTILIDADES - Funciones Auxiliares Reutilizables
 * =====================================================
 * 
 * Funciones "helper" son pequeñas funciones de utilidad
 * que se reutilizan en múltiples lugares del código.
 * 
 * CARACTERÍSTICAS:
 * - Simples y enfocadas en una tarea
 * - Sin dependencias de Playwright (excepto helpers específicas)
 * - Fáciles de testear
 * - Reutilizables
 * 
 * CASOS DE USO:
 * - Validaciones comunes
 * - Generación de datos
 * - Transformación de datos
 * - Esperas y reintentos
 */

/**
 * FUNCIÓN: wait()
 * 
 * Pausa la ejecución un tiempo determinado
 * 
 * @param ms - Milisegundos a esperar
 * @returns Promise que se resuelve después del tiempo
 * 
 * COMPORTAMIENTO:
 * - Crea una promesa que se resuelve después de N ms
 * - Bloquea la ejecución hasta que pasa el tiempo
 * - Útil para esperas manuales entre acciones
 * 
 * CUÁNDO USAR:
 * - Esperar a que algo suceda sin selector específico
 * - Simular demoras de usuario
 * - Dar tiempo a procesos backend
 * - Debug: pause antes de continuar
 * 
 * USO:
 * // Esperar 2 segundos
 * await wait(2000);
 * 
 * // Esperar 500 milisegundos
 * await wait(500);
 * 
 * DIFERENCIA CON waitForSelector():
 * - wait(): siempre espera exactamente N ms
 * - waitForSelector(): espera a elemento (hasta N ms max)
 * 
 * EJEMPLO PRÁCTICO:
 * // El servidor procesa datos, esperar a que termine
 * await loginPage.clickLoginButton();
 * await wait(1000); // Dar tiempo al servidor
 * // Ahora intentar leer el resultado
 * const isLoggedIn = await homePage.isUserLoggedIn();
 * 
 * IMPLEMENTACIÓN:
 * return new Promise((resolve) => setTimeout(resolve, ms));
 * - Crea una nueva promesa
 * - setTimeout llama a resolve después de ms
 * - La promesa se resuelve, desbloqueando el await
 */
export async function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * FUNCIÓN: retry()
 * 
 * Intenta ejecutar una función múltiples veces hasta que funcione
 * 
 * @param fn - Función async a ejecutar
 * @param maxAttempts - Número máximo de intentos (default: 3)
 * @param delay - Milisegundos entre intentos (default: 1000)
 * @returns El resultado de ejecutar fn()
 * @throws Si falla después de todos los intentos
 * 
 * COMPORTAMIENTO:
 * 1. Intenta ejecutar la función
 * 2. Si tiene éxito, retorna el resultado
 * 3. Si falla, espera 'delay' ms
 * 4. Repite hasta 'maxAttempts' veces
 * 5. Si sigue fallando, lanza el error
 * 
 * CUÁNDO USAR:
 * - Funciones que pueden ser inestables
 * - Operaciones de red que podrían fallar
 * - Elementos que aparecen con retraso
 * - Tests flaky (inestables) que a veces pasan
 * 
 * USO:
 * // Intentar obtener elemento, máximo 3 veces
 * const element = await retry(
 *   () => page.locator('.dynamic-element').first(),
 *   3, // maxAttempts
 *   500 // delay entre intentos
 * );
 * 
 * // Resultado: si la función retorna algo, se retorna
 * // Si falla 3 veces, lanza el error de la última vez
 * 
 * EJEMPLO: Obtener datos con retry
 * async function fetchUserData() {
 *   return await retry(
 *     async () => {
 *       const response = await fetch('/api/user');
 *       if (!response.ok) throw new Error('Failed');
 *       return response.json();
 *     },
 *     3, // reintentar 3 veces
 *     2000 // esperar 2 segundos entre intentos
 *   );
 * }
 * 
 * IMPLEMENTACIÓN:
 * - for loop: itera maxAttempts veces
 * - try/catch: intenta ejecutar fn
 * - await wait(delay): pausa antes de reintentar
 * - throw en última iteración: si todo falla
 * 
 * VENTAJAS:
 * - Código más robusto
 * - Maneja fallos intermitentes
 * - Simula comportamiento real de usuarios
 * 
 * DESVENTAJAS:
 * - Puede ocultar problemas reales
 * - Tests más lentos
 * - Puede dar falsa sensación de estabilidad
 */
export async function retry<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  delay: number = 1000
): Promise<T> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxAttempts) throw error;
      await wait(delay);
    }
  }
  throw new Error('Retry failed');
}

/**
 * FUNCIÓN: generateTestData()
 * 
 * Genera datos aleatorios para usar en tests
 * 
 * @param prefix - Prefijo para los datos (default: 'test')
 * @returns Objeto con email, username y timestamp únicos
 * 
 * COMPORTAMIENTO:
 * - Genera datos únicos cada vez que se llama
 * - Usa timestamp para garantizar unicidad
 * - Los datos son válidos como entrada de formularios
 * 
 * RETORNA:
 * {
 *   email: 'test1234567890@example.com',
 *   username: 'test_1234567890',
 *   timestamp: '2026-04-24T16:51:12.209Z'
 * }
 * 
 * CUÁNDO USAR:
 * - Crear usuarios de prueba únicos
 * - Generar datos para forms de registro
 * - Evitar conflictos de datos duplicados
 * - Cada test necesita datos únicos
 * 
 * USO:
 * // Generar datos para un nuevo usuario
 * const testData = generateTestData();
 * await signupPage.register(testData.email, 'password123');
 * 
 * // Generar con prefijo personalizado
 * const userData = generateTestData('newuser');
 * // Resultado: 'newuser1234567890@example.com'
 * 
 * VENTAJAS:
 * - Cada test usa datos únicos
 * - No hay colisiones de datos
 * - Email siempre válido (termina en @example.com)
 * - Username aceptable por la mayoría de sistemas
 * 
 * TIMESTAMP:
 * - Usa Date.now() para milisegundos desde epoch
 * - Garantiza que cada generación es única
 * - Útil para debug (saber cuándo se generó)
 * 
 * EJEMPLO PRÁCTICO:
 * // Test de registro
 * test('Should register new user', async () => {
 *   const data = generateTestData('customer');
 *   // Ahora 'data' es único para este test
 *   // Si se ejecuta de nuevo, genera nuevos datos
 *   await signupPage.fillEmail(data.email);
 *   await signupPage.fillUsername(data.username);
 * });
 */
export function generateTestData(prefix: string = 'test'): {
  email: string;
  username: string;
  timestamp: string;
} {
  const timestamp = Date.now();
  return {
    email: `${prefix}${timestamp}@example.com`,
    username: `${prefix}_${timestamp}`,
    timestamp: new Date().toISOString(),
  };
}

/**
 * FUNCIÓN: isValidUrl()
 * 
 * Valida si una string es una URL válida
 * 
 * @param url - String a validar
 * @returns true si es URL válida, false si no
 * 
 * COMPORTAMIENTO:
 * - Intenta crear un objeto URL
 * - Si tiene éxito, es válida
 * - Si lanza error, no es válida
 * - No hace requests, solo valida formato
 * 
 * CUÁNDO USAR:
 * - Validar URLs antes de navegar
 * - Verificar que selectores de URL son correctos
 * - Validar datos de entrada
 * - Debug de problemas de navegación
 * 
 * USO:
 * // Validar que una URL es correcta
 * const isValid = isValidUrl('https://example.com/login');
 * expect(isValid).toBeTruthy();
 * 
 * const isInvalid = isValidUrl('not a url');
 * expect(isInvalid).toBeFalsy();
 * 
 * EJEMPLOS VÁLIDOS:
 * ✓ 'https://example.com'
 * ✓ 'https://example.com/path?param=value'
 * ✓ 'http://localhost:3000'
 * ✓ 'ftp://files.example.com'
 * ✓ 'file:///home/user/file.html'
 * 
 * EJEMPLOS INVÁLIDOS:
 * ✗ 'not a url'
 * ✗ 'example.com' (sin protocolo)
 * ✗ 'https://' (sin dominio)
 * ✗ '' (vacío)
 * 
 * IMPLEMENTACIÓN:
 * - try: intenta crear URL
 * - new URL(url): constructor de URL
 * - catch: si no es válida, retorna false
 * 
 * NOTA:
 * - Solo valida formato, no si la URL existe
 * - No hace requests a la URL
 * - Válido para cualquier protocolo (http, https, ftp, etc.)
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
