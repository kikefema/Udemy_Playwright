/**
 * ÍNDICE DE ARCHIVOS - GUÍA RÁPIDA
 * 
 * Este archivo te ayuda a entender qué hay en cada carpeta
 */

// ====================================
// 📋 CONFIGURACIÓN
// ====================================

// tsconfig.json
// - Configuración de TypeScript
// - Path aliases (@pages, @tests, @utils, etc.)

// playwright.config.ts
// - Configuración de Playwright
// - Browsers, reporters, timeouts
// - Base URL y cookies

// package.json
// - Scripts de ejecución (test, test:ui, test:debug)
// - Dependencias

// .env y .env.example
// - Variables de entorno
// - URLs, credenciales, configuración

// ====================================
// 📁 src/pages/ - PAGE OBJECTS
// ====================================

// BasePage.ts
// - Clase padre con métodos comunes
// - Métodos para clicks, fill, assertions, etc.
// - Hereda de aquí todos los Page Objects

// LoginPage.ts (ejemplo)
// - Page Object para página de login
// - Selectores y métodos específicos
// - Heredar de BasePage

// HomePage.ts (ejemplo)
// - Page Object para página home/dashboard
// - Selectores y métodos específicos
// - Heredar de BasePage

// ====================================
// 🧪 src/tests/ - TESTS
// ====================================

// auth/login.spec.ts
// - Tests de login
// - Casos positivos y negativos

// auth/dashboard.spec.ts
// - Tests del dashboard
// - Verificaciones after login

// features/
// - Tests de features específicas
// - Organizar por funcionalidad

// smoke/
// - Tests smoke/sanity
// - Básicos de carga y navegación

// ====================================
// 🔧 src/utils/ - FUNCIONES AUXILIARES
// ====================================

// constants.ts
// - URLs base
// - Selectores comunes
// - Datos de prueba
// - Ambientes

// env.ts
// - Lógica de variables de entorno
// - Validación de configuración

// helpers.ts
// - wait(), retry()
// - generateTestData()
// - isValidUrl()
// - Funciones reutilizables

// logger.ts
// - Sistema de logging personalizado
// - DEBUG, INFO, WARN, ERROR

// ====================================
// 🔌 src/fixtures/ - FIXTURES CUSTOMIZADOS
// ====================================

// test-fixtures.ts
// - Inyección de Page Objects
// - test.extend() con loginPage, homePage
// - Usado en todos los tests

// ====================================
// 📝 src/types/ - TIPOS DE TYPESCRIPT
// ====================================

// index.ts
// - Interfaces: TestUser, TestData
// - Types: Environment
// - Definiciones compartidas

// ====================================
// 📚 CÓMO EMPEZAR
// ====================================

// 1. Copiar .env.example a .env y actualizar URLs
// 2. Crear nuevo Page Object heredando de BasePage
// 3. Crear nuevos tests usando fixtures
// 4. Ejecutar: npm test
// 5. Ver reportes: npm run report

// ====================================
// 🚀 COMANDOS ÚTILES
// ====================================

// npm test                  - Ejecutar todos
// npm run test:ui          - Interfaz gráfica
// npm run test:debug       - Debug mode
// npm run test:auth        - Solo tests auth
// npm run report           - Ver último reporte

export {};
