# 📚 Guía de Estudio - Proyecto Playwright OrangeHRM

> Una guía paso a paso para entender cómo funciona este proyecto de testing automatizado

## 🎯 Objetivo del Proyecto

Este es un **framework de testing automatizado** construido con:
- **Playwright**: Herramienta de automatización de navegadores
- **TypeScript**: Lenguaje con tipos estáticos
- **Page Object Model (POM)**: Patrón de diseño para tests mantenibles

**Qué prueba**: La aplicación web OrangeHRM (https://opensource-demo.orangehrm.com)

**Casos de uso**: 
- ✅ Login/Logout
- ✅ Navegación del dashboard
- ✅ Interacciones de usuario
- ✅ Validaciones de seguridad

---

## 📖 Ruta de Estudio Recomendada

### Fase 1: Fundamentos (30 minutos)

Comienza entendiendo los conceptos básicos:

#### 1️⃣ Lee primero: `Guia_conceptos_basicos.md` (si existe)
O directamente:

#### 2️⃣ Entiende la estructura del proyecto:
```
proyecto/
├── src/
│   ├── pages/              ← Page Objects
│   │   ├── BasePage.ts     ← Clase base (leer PRIMERO)
│   │   ├── LoginPage.ts    ← Lógica de login
│   │   └── HomePage.ts     ← Lógica del dashboard
│   │
│   ├── config/             ← Configuración
│   │   ├── constants.ts    ← URLs, timeouts, selectors
│   │   └── env.ts          ← Variables de entorno
│   │
│   ├── utils/              ← Funciones auxiliares
│   │   ├── helpers.ts      ← wait(), retry(), etc
│   │   └── logger.ts       ← Sistema de logging
│   │
│   ├── fixtures/           ← Fixtures de Playwright
│   │   └── test-fixtures.ts ← Inyección de dependencias
│   │
│   ├── types/              ← TypeScript types
│   │   └── index.ts        ← Interfaces
│   │
│   └── tests/              ← Tests
│       ├── auth/
│       │   ├── login.spec.commented.ts    ← 24 tests
│       │   └── dashboard.spec.commented.ts ← 20 tests
│       └── smoke/
│           └── smoke.spec.commented.ts     ← 8 tests
│
├── playwright.config.commented.ts ← Configuración de ejecución
├── tsconfig.commented.json        ← Configuración de TypeScript
└── package.json                   ← Dependencias
```

**Por qué este orden:**
- `BasePage.ts` contiene la **base de todo** (herencia)
- `constants.ts` define **qué estamos probando** (URLs, selectors)
- `LoginPage.ts` y `HomePage.ts` **usan BasePage**
- Los tests **usan las Page Objects**

---

### Fase 2: Infraestructura (45 minutos)

Lee estos archivos para entender **cómo funciona todo**:

#### 📄 Archivos a estudiar:

| Archivo | Tiempo | Propósito | Qué Aprendes |
|---------|--------|----------|--------------|
| `src/config/constants.ts.commented` | 5 min | Constantes | URLs, timeouts, selectors |
| `src/config/env.ts.commented` | 5 min | Env vars | Cómo se cargan variables |
| `src/pages/BasePage.ts.commented` | 15 min | Base class | Métodos comunes de todos los pages |
| `src/utils/helpers.ts.commented` | 5 min | Utilidades | wait(), retry(), etc |
| `src/utils/logger.ts.commented` | 5 min | Logging | Sistema de logs |
| `src/fixtures/test-fixtures.ts.commented` | 5 min | Fixtures | Cómo se inyectan objetos |
| `src/types/index.ts.commented` | 5 min | Types | Interfaces TypeScript |

**Objetivo**: Entender **cómo se organizan las herramientas**

---

### Fase 3: Page Objects (30 minutos)

Ahora entiende **qué estamos probando**:

#### 📄 Archivos a estudiar:

| Archivo | Tiempo | Contenido |
|---------|--------|----------|
| `src/pages/LoginPage.ts.commented` | 15 min | Métodos para login |
| `src/pages/HomePage.ts.commented` | 15 min | Métodos del dashboard |

**Qué aprender:**
- Cómo se estructura un Page Object
- Métodos disponibles en cada página
- Selectors CSS y cómo se usan
- Patrones de interacción

---

### Fase 4: Tests (60 minutos)

Finalmente, aprende **qué se está probando**:

#### 🧪 Tests a estudiar (en orden):

**A) Smoke Tests (15 min)** - Tests más simples
```
src/tests/smoke/smoke.spec.commented.ts
- 8 tests básicos
- Validan que app está "viva"
- Rápidos (<30 segundos)
```

**B) Login Tests (25 min)** - Tests de autenticación
```
src/tests/auth/login.spec.commented.ts
- 24 tests organizados en 7 categorías:
  ✅ Casos de éxito (login correcto)
  ❌ Casos de error (credenciales inválidas)
  ⚠️ Casos límite (campos vacíos, SQL injection)
  🔄 Flujos (reintentos, limpieza de form)
  🎯 Validaciones UI
  ⏱️ Timing (navegación rápida)
  🚀 Performance (sesión, reloads)
```

**C) Dashboard Tests (20 min)** - Tests de post-login
```
src/tests/auth/dashboard.spec.commented.ts
- 20 tests organizados en 7 categorías:
  ✅ Verificación post-login
  🔐 Logout y seguridad
  👤 Menú del usuario
  📱 Navegación y estado
  🎯 Estructura de página
  ⏱️ Performance
  🔄 Persistencia de sesión
```

---

### Fase 5: Configuración (30 minutos)

Entiende **cómo se ejecutan los tests**:

#### ⚙️ Archivos finales:

| Archivo | Tiempo | Para qué |
|---------|--------|----------|
| `playwright.config.commented.ts` | 15 min | Cómo Playwright ejecuta tests |
| `tsconfig.commented.json` | 15 min | Cómo TypeScript compila código |

**Qué aprender:**
- Paralelización de tests
- Reporters (HTML, consola)
- Screenshots y videos en fallos
- Configuración de timeouts

---

## 🎓 Cómo Estudiar Cada Archivo

### Paso 1: Lee el Archivo Completo
Léelo de principio a fin sin preocuparte por entenderlo todo.

### Paso 2: Lee Secciones Comentadas
Los archivos tienen **comentarios extensos** que explican:
- **QUÉ** hace cada sección
- **PASOS** detallados
- **PARÁMETROS** de funciones
- **IMPORTANCIA** de cada test
- **CASOS DE USO** reales

### Paso 3: Ejecuta en Terminal
```bash
# Ver todos los tests
npm test

# Ver solo smoke tests (rápido)
npm run test:smoke

# Ver tests con interfaz visual
npm run test:ui

# Ver reporte HTML después de correr tests
npx playwright show-report
```

### Paso 4: Abre el Reporte HTML
Después de ejecutar tests:
```bash
npx playwright show-report
```
Verás:
- ✅ Tests que pasaron
- ❌ Tests que fallaron
- 📸 Screenshots de fallos
- 🎬 Videos de ejecución
- 📊 Estadísticas

---

## 💡 Conceptos Clave a Entender

### 1. Page Object Model (POM)

**Idea**: Cada página web = una clase

```
LoginPage {
  - fillUsername()
  - fillPassword()
  - clickLoginButton()
  - isErrorVisible()
}

HomaPage {
  - isUserLoggedIn()
  - logout()
  - openUserMenu()
}
```

**Ventaja**: Si selector cambia, cambias en UN lugar (la Page class)

### 2. Fixtures en Playwright

**Idea**: Inyectar objetos automáticamente en tests

```typescript
test('example', async ({ loginPage, homePage, page }) => {
  // loginPage, homePage, page se inyectan automáticamente
  // beforeEach ya hizo login automáticamente
});
```

### 3. Async/Await

Todos los métodos son **asincronos** (devuelven Promises):

```typescript
// CORRECTO
await loginPage.login('Admin', 'admin123');

// INCORRECTO (falta await)
loginPage.login('Admin', 'admin123');
```

### 4. Selectors CSS

Forma de encontrar elementos:

```typescript
'input[name="username"]'     // Selector de atributo
'.orangehrm-container'      // Selector de clase
'#loginForm'                // Selector de ID
'button:has-text("Login")'  // Selector de texto
```

### 5. Tipos TypeScript

Garantiza que usas las funciones correctamente:

```typescript
interface TestUser {
  email: string;
  password: string;
}

// TypeScript sabe qué propiedades tiene TestUser
const user: TestUser = { email: 'Admin', password: 'admin123' };
```

---

## 🏃 Cómo Ejecutar Tests

### Opción 1: Línea de Comandos
```bash
# Todos los tests
npm test

# Tests específicos
npm test -- --grep "login"

# Solo un archivo
npm test src/tests/auth/login.spec.ts

# Modo debug (paso a paso)
npm test -- --debug

# Con navegador visible
npm test -- --headed

# Modo watch (rerun en cambios)
npm test -- --watch
```

### Opción 2: Interfaz Visual
```bash
npm run test:ui
# Se abre navegador con interfaz interactiva
# Puedes ejecutar, pausar, ver detalles
```

### Opción 3: Smoke Tests (Rápido)
```bash
npm run test:smoke
# Solo 8 tests rápidos (~10 segundos)
# Ideal para chequeo rápido
```

---

## 📊 Estructura de Tests

Todos los tests siguen este patrón:

```typescript
test('🎯 Descripción del test', async ({ fixture1, fixture2 }) => {
  /**
   * BLOQUE 1: Setup
   * Preparar estado inicial
   */
  
  /**
   * BLOQUE 2: Acción
   * Hacer algo (click, escribir, navegar)
   */
  
  /**
   * BLOQUE 3: Verificación (Assertion)
   * expect(...) verifica que resultado es correcto
   */
});
```

**Ejemplo real:**
```typescript
test('✅ Debería loguear correctamente', async ({ loginPage, homePage }) => {
  // 1. Setup: ya hecho por beforeEach (navegó a login)
  
  // 2. Acción
  await loginPage.login('Admin', 'admin123');
  
  // 3. Verificación
  const isLoggedIn = await homePage.isUserLoggedIn();
  expect(isLoggedIn).toBeTruthy();
});
```

---

## 🔍 Categorías de Tests Explicadas

Cada test tiene un **emoji** que dice qué prueba:

| Emoji | Categoría | Qué Prueba |
|-------|-----------|-----------|
| ✅ | Success | Login correcto |
| ❌ | Error | Credenciales rechazadas |
| ⚠️ | Edge Cases | Campos vacíos, caracteres raros |
| 🔄 | Flow | Múltiples intentos, limpieza |
| 🎯 | Validation | Interfaz correcta |
| ⏱️ | Timing | Carga rápida, delays |
| 🚀 | Performance | Sesión persistente, reloads |
| 🔐 | Security | Logout, acceso sin autenticación |
| 👤 | User Menu | Menú usuario, opciones |
| 📱 | Navigation | Navegación después login |

---

## 🚀 Plan de 5 Días

Si tienes **1 semana** para aprender:

### Día 1: Conceptos (2 horas)
- [ ] Lee esta guía
- [ ] Mira estructura de carpetas
- [ ] Ejecuta `npm test` para ver qué sucede
- [ ] Abre reporte HTML

### Día 2: Infraestructura (2.5 horas)
- [ ] Lee `constants.ts` comentado
- [ ] Lee `BasePage.ts` comentado
- [ ] Lee `helpers.ts` y `logger.ts`
- [ ] Entiende cómo se organizan las herramientas

### Día 3: Page Objects (2 horas)
- [ ] Lee `LoginPage.ts` comentado
- [ ] Lee `HomePage.ts` comentado
- [ ] Entiende qué métodos están disponibles
- [ ] Ejecuta tests y ve qué hace cada página

### Día 4: Tests (2.5 horas)
- [ ] Lee `smoke.spec.commented.ts` (8 tests simples)
- [ ] Lee `login.spec.commented.ts` (24 tests)
- [ ] Ejecuta tests y correlaciona con código

### Día 5: Configuración + Repaso (2 horas)
- [ ] Lee `playwright.config.commented.ts`
- [ ] Lee `tsconfig.commented.json`
- [ ] Repasa conceptos clave
- [ ] Ejecuta tests con diferentes opciones

**Total: ~11 horas de estudio**

---

## ❓ Preguntas que Deberías Poder Responder

Al terminar cada fase, verifica que puedas responder:

### Después Fase 1:
- ¿Cuál es la estructura del proyecto?
- ¿Qué es Playwright?
- ¿Para qué sirve Page Object Model?

### Después Fase 2:
- ¿Dónde están los URLs configurados?
- ¿Cómo se espera a que elementos carguen?
- ¿Cuál es la diferencia entre Page y BasePage?

### Después Fase 3:
- ¿Qué métodos tiene LoginPage?
- ¿Cómo se hace login en el código?
- ¿Cómo se seleccionan elementos en la página?

### Después Fase 4:
- ¿Cuántos tests hay y qué prueban?
- ¿Qué significa cada emoji de categoría?
- ¿Cómo se escribe un test nuevo?

### Después Fase 5:
- ¿Cómo se ejecutan tests en paralelo?
- ¿Qué reportes genera Playwright?
- ¿Cómo se configura timeouts?

---

## 🎯 Ejercicios Prácticos

### Ejercicio 1: Ejecuta un Test (5 min)
```bash
npm test -- --grep "Should login successfully"
```
Observa:
- ¿Qué sucede en pantalla?
- ¿Cuál es el resultado?
- ¿Dónde puedes ver logs?

### Ejercicio 2: Lee un Test Completo (15 min)
Abre `login.spec.commented.ts`, línea 224:
- Lee TODOS los comentarios del primer test
- Entiende cada paso
- Identifica qué Page Object methods usa

### Ejercicio 3: Localiza un Selector (10 min)
Abre navegador en https://opensource-demo.orangehrm.com:
- F12 (DevTools)
- Inspecciona el campo Username
- Busca el selector en `constants.ts`
- Verifica que es el correcto

### Ejercicio 4: Modifica un Test (15 min)
En `login.spec.commented.ts`:
- Copia un test
- Cámbialo para probar con otro usuario
- Ejecuta: `npm test -- --grep "tu-nuevo-test"`
- Verifica que funciona

### Ejercicio 5: Escribe Nuevo Test (30 min)
Crea tu propio test:
```typescript
test('🎯 Mi primer test nuevo', async ({ loginPage }) => {
  // Completa el test
});
```
Ejecútalo y verifica que pase.

---

## 🔗 Relación Entre Archivos

```
package.json
    ↓
playwright.config.ts (cómo ejecutar)
    ↓
tsconfig.json (compilar TypeScript)
    ↓
src/fixtures/test-fixtures.ts (inyectar fixtures)
    ↓
src/pages/*.ts (Page Objects)
    ├── Usan: src/config/constants.ts
    ├── Usan: src/utils/helpers.ts
    └── Heredan: src/pages/BasePage.ts
    
src/tests/**/*.spec.ts (Tests)
    ├── Usan fixtures inyectados
    ├── Usan Page Objects
    └── Verifican con expect()
```

---

## 📝 Consejos para Aprender Rápido

### ✅ Haz
- Lee los **comentarios** (tienen la explicación)
- Ejecuta **un test a la vez** para entender
- Usa **--headed** para ver qué hace el navegador
- Abre DevTools (F12) en la app de prueba
- Correlaciona **código con lo que sucede** en pantalla

### ❌ No hagas
- No leas solo el código sin comentarios
- No intentes entender TODO de una vez
- No copies-pegues sin entender
- No ignores los tipos TypeScript
- No ejecutes todos los tests simultáneamente (confuso)

---

## 🆘 Si te Atascas

### "No entiendo un test"
→ Lee TODOS los comentarios del test (tienen línea por línea explicación)

### "¿Qué hace este selector?"
→ Abre DevTools en https://opensource-demo.orangehrm.com y búscalo

### "¿Cómo uso esta función?"
→ Busca EJEMPLOS de uso en otros tests

### "No sé qué hacer después"
→ Ejecuta el test con `--headed` y mira qué sucede en pantalla

### "¿Puedo escribir mis propios tests?"
→ SÍ, copia un test existente y modifícalo

---

## 📚 Recursos Adicionales

### Documentación Oficial
- [Playwright](https://playwright.dev)
- [TypeScript](https://www.typescriptlang.org)

### Conceptos Importantes
- **Async/Await**: Permite esperar promesas
- **Page Object Model**: Patrón de diseño
- **CSS Selectors**: Forma de encontrar elementos
- **Test Categories**: Organizan tests por tipo

### En Este Proyecto
- **`src/**/*.commented.ts`**: Versiones con comentarios de todos los archivos
- **`README.md`**: Información general del proyecto
- **`playwright-report/`**: Reportes HTML después de ejecutar tests

---

## ✨ Resumen

### En 5 minutos:
Este proyecto automatiza tests en OrangeHRM usando Playwright, TypeScript y Page Object Model.

### En 30 minutos:
Entiende que hay 3 capas:
1. **Page Objects** (qué hacer en cada página)
2. **Tests** (qué verificar)
3. **Configuración** (cómo ejecutar)

### En 2-3 horas:
Puedes entender cómo funciona todo el proyecto.

### En 1 semana:
Puedes escribir tests nuevos y modificar existentes.

---

## 🎉 ¡Ahora Estás Listo!

Comienza por **Fase 1** y sigue paso a paso. No intentes memorizar todo: **el objetivo es entender cómo se estructura todo**.

**¡Buen estudio!** 📚
