/**
 * =====================================================
 * UTILIDADES - Sistema de Logging Personalizado
 * =====================================================
 * 
 * Sistema de logs para que el código sea más legible
 * en las salidas de terminal y reportes.
 * 
 * QUÉ ES UN LOGGER:
 * - Función que imprime mensajes con nivel de severidad
 * - Niveles: DEBUG < INFO < WARN < ERROR
 * - Puedes filtrar qué nivel mostrar
 * 
 * VENTAJAS DE USAR LOGGER:
 * - Mensajes claros y organizados
 * - Filtrar por nivel de severidad
 * - Timestamps automáticos
 * - Fácil cambiar formato sin tocar código
 * 
 * NIVELES DE LOG:
 * DEBUG - Información detallada para debugging
 * INFO - Información general del flujo
 * WARN - Advertencias (algo podría salir mal)
 * ERROR - Errores críticos (algo salió mal)
 */

/**
 * ENUM: LogLevel
 * 
 * Valores posibles para los niveles de logging
 * 
 * ORDEN DE SEVERIDAD (menor a mayor):
 * DEBUG < INFO < WARN < ERROR
 * 
 * USO:
 * - En logger.setLogLevel('INFO')
 * - En logger.shouldLog(LogLevel.WARN)
 */
enum LogLevel {
  DEBUG = 'DEBUG', // Información muy detallada
  INFO = 'INFO',   // Información normal del flujo
  WARN = 'WARN',   // Advertencias
  ERROR = 'ERROR', // Errores críticos
}

/**
 * CLASE: Logger
 * 
 * Sistema de logging centralizado
 * 
 * CARACTERÍSTICAS:
 * - Singleton (una sola instancia)
 * - Configurable con setLogLevel()
 * - Métodos para cada nivel
 * - Timestamps automáticos
 * 
 * MÉTODOS:
 * - logger.debug() - Mensajes de debug
 * - logger.info() - Mensajes informativos
 * - logger.warn() - Advertencias
 * - logger.error() - Errores
 * - logger.setLogLevel() - Cambiar nivel
 */
class Logger {
  /**
   * PROPIEDAD: logLevel
   * 
   * El nivel mínimo de logging a mostrar
   * 
   * DEFAULT: LogLevel.INFO
   * 
   * SIGNIFICA:
   * - Si logLevel es INFO, muestra: INFO, WARN, ERROR
   * - Si logLevel es DEBUG, muestra: DEBUG, INFO, WARN, ERROR (TODO)
   * - Si logLevel es ERROR, muestra: solo ERROR
   * 
   * SE CAMBIA CON:
   * logger.setLogLevel('DEBUG');
   * logger.setLogLevel('ERROR');
   */
  private logLevel: LogLevel = LogLevel.INFO;

  /**
   * MÉTODO: setLogLevel()
   * 
   * Cambia el nivel mínimo de logging a mostrar
   * 
   * @param level - String del nuevo nivel ('DEBUG', 'INFO', 'WARN', 'ERROR')
   * 
   * COMPORTAMIENTO:
   * - Busca el valor en enum LogLevel
   * - Si no encuentra, mantiene el anterior
   * - Todos los logs por encima de este nivel se mostrarán
   * 
   * USO:
   * // Mostrar todo (para debugging)
   * logger.setLogLevel('DEBUG');
   * 
   * // Solo mostrar errores
   * logger.setLogLevel('ERROR');
   * 
   * // Volver a lo normal
   * logger.setLogLevel('INFO');
   * 
   * DÓNDE USARLO:
   * - En beforeAll: logger.setLogLevel('DEBUG');
   * - En main.ts si existe
   * - En fixtures si necesitas tests con debug
   * 
   * VALIDACIÓN:
   * LogLevel['DEBUG'] → 'DEBUG' (válido)
   * LogLevel['INVALID'] → undefined (mantiene anterior)
   */
  setLogLevel(level: string): void {
    this.logLevel = LogLevel[level as keyof typeof LogLevel] || LogLevel.INFO;
  }

  /**
   * MÉTODO: shouldLog()
   * 
   * Verifica si un mensaje debería mostrarse
   * Basado en el nivel actual y el nivel del mensaje
   * 
   * @param level - Nivel del mensaje a loguear
   * @returns true si debería mostrarse, false si no
   * 
   * LÓGICA:
   * 1. Define orden: [DEBUG, INFO, WARN, ERROR]
   * 2. Encuentra posición del nivel del mensaje
   * 3. Encuentra posición del logLevel actual
   * 4. Si mensaje >= logLevel, retorna true
   * 
   * EJEMPLOS:
   * Si logLevel = INFO:
   *   shouldLog(DEBUG) → false (DEBUG < INFO)
   *   shouldLog(INFO) → true (INFO == INFO)
   *   shouldLog(WARN) → true (WARN > INFO)
   *   shouldLog(ERROR) → true (ERROR > INFO)
   * 
   * Si logLevel = ERROR:
   *   shouldLog(DEBUG) → false
   *   shouldLog(INFO) → false
   *   shouldLog(WARN) → false
   *   shouldLog(ERROR) → true (solo ERROR)
   * 
   * USO INTERNO:
   * No se usa directamente, se usa en debug/info/warn/error
   */
  private shouldLog(level: LogLevel): boolean {
    const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR];
    return levels.indexOf(level) >= levels.indexOf(this.logLevel);
  }

  /**
   * MÉTODO: format()
   * 
   * Da formato a un mensaje de log
   * 
   * @param level - Nivel del log
   * @param message - Mensaje a loguear
   * @returns String formateado: [timestamp] [LEVEL] mensaje
   * 
   * FORMATO:
   * [2026-04-24T16:51:12.209Z] [INFO] Usuario logueado
   * ^                          ^      ^
   * timestamp                  nivel  mensaje
   * 
   * PARTES:
   * - Timestamp: ISO 8601 (útil para ordenar logs)
   * - Level: DEBUG/INFO/WARN/ERROR (fácil de grep)
   * - Message: El mensaje del desarrollador
   * 
   * USO INTERNO:
   * No se usa directamente, se usa en cada método
   * 
   * VENTAJAS:
   * - Logs con hora precisa
   * - Fácil buscar por nivel
   * - Formato consistente
   * - Parseable por scripts
   */
  private format(level: string, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level}] ${message}`;
  }

  // ===================================
  // MÉTODOS DE LOGGING POR NIVEL
  // ===================================

  /**
   * MÉTODO: debug()
   * 
   * Loguea un mensaje de DEBUG
   * 
   * @param message - Mensaje a loguear
   * 
   * CUÁNDO USAR:
   * - Información muy detallada
   * - Variables internas
   * - Valores de pasos intermedios
   * - Información para desarrolladores
   * 
   * VISIBILIDAD:
   * - Solo visible si logLevel <= DEBUG
   * - Típicamente no se ve en tests normales
   * - Se ve en modo debug: logger.setLogLevel('DEBUG')
   * 
   * EJEMPLO:
   * logger.debug('Variable x = ' + x);
   * logger.debug('Preparando elemento...');
   * 
   * NOTA:
   * - No incluir información sensible
   * - Podría ser verboso, usar con moderación
   */
  debug(message: string): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.debug(this.format('DEBUG', message));
    }
  }

  /**
   * MÉTODO: info()
   * 
   * Loguea un mensaje de INFO
   * 
   * @param message - Mensaje a loguear
   * 
   * CUÁNDO USAR:
   * - Acciones principales del test
   * - Pasos importantes del flujo
   * - Información que quieres siempre ver
   * - Navegación entre páginas
   * 
   * VISIBILIDAD:
   * - Visible por defecto (logLevel = INFO)
   * - Se ve siempre a menos que cambies el nivel
   * 
   * EJEMPLO:
   * logger.info(`Intentando login con usuario: ${user}`);
   * logger.info('Click en botón de logout');
   * logger.info('Navegando al dashboard');
   * 
   * USO EN PROYECTO:
   * - Usado en: LoginPage.login()
   * - Usado en: HomePage.logout()
   * - Usado en: BasePage.fillInput()
   * - Usado en: Cada acción importante
   * 
   * NIVEL RECOMENDADO:
   * - Úsalo en puntos clave
   * - No en cada línea (sería spam)
   * - Solo en cambios de estado importantes
   */
  info(message: string): void {
    if (this.shouldLog(LogLevel.INFO)) {
      console.info(this.format('INFO', message));
    }
  }

  /**
   * MÉTODO: warn()
   * 
   * Loguea un mensaje de WARN (advertencia)
   * 
   * @param message - Mensaje a loguear
   * 
   * CUÁNDO USAR:
   * - Algo que podría salir mal
   * - Comportamiento inesperado (pero continúa)
   * - Deprecaciones
   * - Fallbacks o workarounds
   * 
   * EJEMPLOS:
   * logger.warn('El elemento tardó más de lo esperado');
   * logger.warn('Se usó timeout aumentado para este test');
   * logger.warn('Usando selector alternativo');
   * 
   * DIFERENCIA CON ERROR:
   * - WARN: algo raro, pero continuamos
   * - ERROR: algo crítico, probablemente falló
   * 
   * VISIBILIDAD:
   * - Visible por defecto
   * - Se ve a menos que logLevel = ERROR
   * 
   * CASO DE USO EN TESTS:
   * - No está muy usado en nuestro código
   * - Podría usarse en helpers para avisar
   */
  warn(message: string): void {
    if (this.shouldLog(LogLevel.WARN)) {
      console.warn(this.format('WARN', message));
    }
  }

  /**
   * MÉTODO: error()
   * 
   * Loguea un mensaje de ERROR
   * 
   * @param message - Descripción del error
   * @param error - Objeto Error (opcional) con stack trace
   * 
   * CUÁNDO USAR:
   * - Cuando algo falló
   * - Excepciones capturadas
   * - Errores de validación
   * - Fallos críticos
   * 
   * USO:
   * // Solo mensaje
   * logger.error('No se pudo hacer login');
   * 
   * // Con objeto Error para stack trace
   * try {
   *   await something();
   * } catch (e) {
   *   logger.error('Falló algo', e as Error);
   * }
   * 
   * VISIBILIDAD:
   * - Siempre visible (mayor prioridad)
   * - Incluso si logLevel = ERROR
   * 
   * FORMATO CON ERROR:
   * [timestamp] [ERROR] Mensaje
   * (imprime el stack trace completo)
   * 
   * NOTA:
   * - El objeto error es opcional
   * - Usa solo si tienes el objeto Error
   * - Esto facilita debugging (ves dónde falló)
   */
  error(message: string, error?: Error): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      console.error(this.format('ERROR', message));
      if (error) {
        console.error(error);
      }
    }
  }
}

/**
 * INSTANCIA GLOBAL: logger
 * 
 * Se exporta una instancia única del Logger
 * Esto es el patrón SINGLETON
 * 
 * VENTAJAS:
 * - Una sola instancia en toda la aplicación
 * - Misma configuración en todos lados
 * - Fácil de usar: logger.info('...')
 * 
 * USO:
 * import { logger } from '@utils/logger';
 * 
 * logger.info('Mensaje');
 * logger.error('Error', error);
 * logger.setLogLevel('DEBUG');
 * 
 * USADA EN:
 * - BasePage.ts
 * - LoginPage.ts
 * - HomePage.ts
 * - Tests
 */
export const logger = new Logger();
