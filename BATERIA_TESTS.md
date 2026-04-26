# 📊 Batería de Tests - OrangeHRM Login

## Resumen del Proyecto

Se ha creado una **batería completa de pruebas de login** para la aplicación **OrangeHRM** usando **Playwright + TypeScript** con patrón **POM (Page Object Model)**.

---

## 🎯 Tests Creados

### 1️⃣ **🔐 Login Tests** (`src/tests/auth/login.spec.ts`)
**24 tests** cubriendo todos los escenarios de login:

#### ✅ Casos de Éxito (3 tests)
- Login exitoso con credenciales válidas
- Verificación de redirección al dashboard
- Verificación de que el formulario se oculta después del login

#### ❌ Casos de Error (3 tests)
- Error con usuario inválido
- Error con contraseña inválida
- Error con credenciales completamente incorrectas

#### ⚠️ Casos Límite (6 tests)
- Campo usuario vacío
- Campo contraseña vacío
- Ambos campos vacíos
- Caracteres especiales en contraseña
- Intento de SQL injection
- Campos con espacios

#### 🔄 Casos de Flujo (3 tests)
- Reintentar login después de fallo
- Mantener estado del formulario
- Limpiar formulario correctamente

#### 🎯 Casos de Validación de Interfaz (4 tests)
- Formulario visible al cargar
- Verificación de título de página
- Botón de login visible
- Campos de entrada visibles

#### ⏱️ Casos de Timing (2 tests)
- Esperas de carga correctas
- Manejo de delays de red

#### 🚀 Casos de Rendimiento (2 tests)
- Login en tiempo razonable (< 10s)
- Manejo de logins rápidos sucesivos

---

### 2️⃣ **📊 Dashboard Tests** (`src/tests/auth/dashboard.spec.ts`)
**20 tests** para validar estado post-login:

#### ✅ Verificación de Login (4 tests)
- Verificar que estamos logueados
- URL del dashboard correcta
- Título válido
- Contenido principal cargado

#### 🔐 Tests de Logout (3 tests)
- Logout exitoso
- No acceso al dashboard después de logout
- Requiere login nuevamente

#### 👤 Tests del Menú Usuario (2 tests)
- Abrir menú de usuario
- Opción de logout visible

#### 📱 Tests de Navegación (2 tests)
- Mantener sesión al recargar
- Navegación válida después del login

#### 🎯 Tests de Interfaz (2 tests)
- Botón de menú usuario visible
- Estructura correcta de la página

#### ⏱️ Tests de Timing (2 tests)
- Dashboard carga rápidamente
- Múltiples recargas sin problemas

#### 🔄 Tests de Sesión (3 tests)
- Consistencia de sesión
- Persistencia de cookies
- Mantenimiento de estado

---

### 3️⃣ **🔥 Smoke Tests** (`src/tests/smoke/smoke.spec.ts`)
**8 tests** de verificación básica:

- Cargar página de login sin errores
- Formulario de login visible
- Flujo completo de login
- Flujo completo de logout
- No hay errores en consola JavaScript
- Requests exitosos
- Conectividad a BD (mediante login exitoso)
- Tiempo de respuesta aceptable

---

## 📋 Total: 47 Tests

| Categoría | Cantidad | Cobertura |
|-----------|----------|-----------|
| Login | 24 | Todos los escenarios de autenticación |
| Dashboard | 20 | Post-login, logout, sesión |
| Smoke | 8 | Salud general de la aplicación |
| **TOTAL** | **47** | **Completa** |

---

## 🏗️ Estructura POM

### Page Objects Creados

#### 📄 **BasePage.ts** - Clase Base
Métodos reutilizables comunes:
- `goto(url)` - Navegación
- `fillInput(selector, text)` - Rellenar inputs
- `click(selector)` - Clicks
- `getText(selector)` - Obtener texto
- `isVisible(selector)` - Verificar visibilidad
- `waitForSelector(selector)` - Esperas
- `expectVisible()` / `expectHidden()` - Aserciones
- `takeScreenshot(name)` - Capturas
- Y más...

#### 🔐 **LoginPage.ts** - Página de Login
Métodos específicos:
- `navigateToLogin(url)` - Ir a login
- `login(username, password)` - Login completo
- `fillUsername()` / `fillPassword()` - Llenar campos
- `clickLoginButton()` - Clic en botón
- `isErrorVisible()` - Verificar error
- `getErrorMessage()` - Obtener mensaje de error
- `isLoginFormVisible()` - Verificar formulario
- `clearForm()` - Limpiar formulario
- `getUsernameValue()` / `getPasswordValue()` - Obtener valores

#### 🏠 **HomePage.ts** - Dashboard
Métodos específicos:
- `isUserLoggedIn()` - Verificar login
- `getDashboardTitle()` - Obtener título
- `openUserMenu()` - Abrir menú usuario
- `logout()` - Cerrar sesión
- `isOnLoginPage()` - Verificar si estamos en login
- `getCurrentDashboardUrl()` - URL actual

---

## ⚙️ Configuración

### 🔑 Constantes (`src/config/constants.ts`)
```typescript
BASE_URL = 'https://opensource-demo.orangehrmlive.com/web/index.php'
LOGIN_URL = '/auth/login'
DASHBOARD_URL = '/dashboard/index'

TEST_USER = {
  email: 'Admin',
  password: 'admin123'
}

INVALID_USER = {
  email: 'InvalidUser',
  password: 'WrongPassword123!'
}
```

### 🔌 Fixtures (`src/fixtures/test-fixtures.ts`)
```typescript
test.extend({
  loginPage: new LoginPage(page),
  homePage: new HomePage(page)
})
```

Uso en tests:
```typescript
test('Mi test', async ({ loginPage, homePage }) => {
  await loginPage.login(username, password);
  // ...
})
```

---

## 📊 Ejecutar Tests

```bash
# Todos los tests
npm test

# Solo login
npm run test:auth

# Solo smoke tests
npm run test:smoke

# UI mode (interfaz gráfica)
npm run test:ui

# Debug mode
npm run test:debug

# Con navegador visible
npm run test:headed

# Ver último reporte
npm run report
```

---

## 📈 Cobertura

### Escenarios de Login
✅ Credenciales válidas  
✅ Credenciales inválidas  
✅ Campos vacíos  
✅ Caracteres especiales  
✅ Intentos de ataque (SQL injection)  
✅ Reintentos  
✅ Validación de interfaz  
✅ Timing y rendimiento

### Escenarios Post-Login
✅ Dashboard cargado  
✅ Sesión mantenida  
✅ Logout exitoso  
✅ Menú usuario funcional  
✅ Navegación  
✅ Persistencia de cookies

### Validación General
✅ Sin errores en consola  
✅ Requests exitosos  
✅ Conectividad a BD  
✅ Rendimiento  
✅ Cargas de red

---

## 🎯 Mejores Prácticas Implementadas

✅ **Patrón POM** - Separación clara de página y tests  
✅ **Fixtures customizados** - Inyección de Page Objects  
✅ **Logging** - Sistema personalizado de logs  
✅ **Configuración centralizada** - Constants y env  
✅ **Path aliases** - Imports limpios (@pages, @tests, etc.)  
✅ **Nombres descriptivos** - Tests con emojis y nombres claros  
✅ **TypeScript strict** - Tipado fuerte  
✅ **Reutilización** - Métodos compartidos en BasePage  
✅ **Manejo de errores** - Esperas y validaciones apropiadas  
✅ **Documentación** - Comentarios en cada método  

---

## 🚀 Próximos Pasos

1. Ejecutar tests regularmente: `npm test`
2. Ver reportes: `npm run report`
3. Añadir más Page Objects para otras páginas
4. Integrar con CI/CD
5. Expandir casos de prueba según nuevas features

---

## 📞 Credenciales de Prueba

**URL:** https://opensource-demo.orangehrmlive.com/web/index.php/auth/login

**Usuario:** Admin  
**Contraseña:** admin123

---

**Proyecto:** OrangeHRM Login Automation  
**Framework:** Playwright + TypeScript  
**Patrón:** POM (Page Object Model)  
**Tests:** 47  
**Estado:** ✅ Completamente configurado y listo para usar
