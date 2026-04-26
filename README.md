# 📦 Proyecto Playwright - POM (Page Object Model)

Automatización de pruebas con Playwright y TypeScript siguiendo el patrón **Page Object Model (POM)**.

## 📁 Estructura del Proyecto

```
src/
├── pages/              # Page Objects
│   ├── BasePage.ts     # Clase base con métodos comunes
│   ├── LoginPage.ts    # Page Object para login
│   └── HomePage.ts     # Page Object para home/dashboard
├── tests/              # Test files organizados por categoría
│   ├── auth/          # Tests de autenticación
│   ├── features/      # Tests de features
│   └── smoke/         # Tests smoke
├── fixtures/           # Custom fixtures de Playwright
│   └── test-fixtures.ts
├── utils/             # Funciones auxiliares
│   ├── constants.ts   # Constantes (URLs, selectores, etc.)
│   ├── helpers.ts     # Funciones reutilizables
│   └── logger.ts      # Sistema de logging
├── config/            # Configuración
│   └── env.ts         # Variables de entorno
└── types/             # Definiciones de TypeScript
    └── index.ts
```

## 🚀 Instalación

```bash
# Instalar dependencias
npm install

# Instalar navegadores de Playwright
npx playwright install
```

## 📝 Configuración

1. **Copiar archivo de variables de entorno:**
   ```bash
   cp .env.example .env
   ```

2. **Editar `.env` con tus valores:**
   ```
   BASE_URL=https://tudominio.com
   ENVIRONMENT=development
   ```

## 🧪 Ejecutar Tests

```bash
# Ejecutar todos los tests
npm test

# Ejecutar en modo UI (interfaz gráfica)
npm run test:ui

# Ejecutar en modo debug
npm run test:debug

# Ejecutar con navegador visible
npm run test:headed

# Ejecutar solo tests de autenticación
npm run test:auth

# Ejecutar solo tests smoke
npm run test:smoke

# Ver reporte de última ejecución
npm run report
```

## 📚 Patrón POM (Page Object Model)

### Crear un nuevo Page Object

```typescript
import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class MyPage extends BasePage {
  // Selectores
  readonly myButton = '[data-testid="my-button"]';
  readonly myInput = '[data-testid="my-input"]';

  constructor(page: Page) {
    super(page);
  }

  // Métodos de negocio
  async clickMyButton(): Promise<void> {
    await this.click(this.myButton);
  }

  async fillMyInput(text: string): Promise<void> {
    await this.fillInput(this.myInput, text);
  }
}
```

### Usar Page Objects en Tests

```typescript
import { test, expect } from '@fixtures/test-fixtures';

test('Mi primer test', async ({ page, myPage }) => {
  await page.goto('https://example.com');
  await myPage.clickMyButton();
  await expect(page).toContainText('Success');
});
```

## 🛠️ Métodos Disponibles en BasePage

| Método | Descripción |
|--------|-------------|
| `goto(url)` | Navegar a una URL |
| `fillInput(selector, text)` | Rellenar un input |
| `click(selector)` | Hacer clic en un elemento |
| `clickAndWaitForNavigation(selector)` | Clic y esperar navegación |
| `getText(selector)` | Obtener texto de un elemento |
| `isVisible(selector)` | Verificar si es visible |
| `waitForSelector(selector)` | Esperar elemento |
| `expectVisible(selector)` | Aserción: visible |
| `expectHidden(selector)` | Aserción: oculto |
| `expectTextInPage(text)` | Aserción: texto en página |
| `getCurrentUrl()` | Obtener URL actual |
| `reload()` | Recargar página |
| `goBack()` | Ir atrás |
| `takeScreenshot(name)` | Captura de pantalla |
| `clearCookies()` | Limpiar cookies |

## 📊 Reportes

Los reportes HTML se generan automáticamente en `playwright-report/`

Visualizar reporte:
```bash
npm run report
```

## 🔧 Variables de Entorno

Ver `.env.example` para todas las opciones disponibles:

- `BASE_URL` - URL base de la aplicación
- `ENVIRONMENT` - development/staging/production
- `HEADLESS` - Ejecutar sin interfaz (true/false)
- `TIMEOUT` - Timeout de tests (ms)
- `LOG_LEVEL` - DEBUG/INFO/WARN/ERROR

## 📦 Dependencias

- **@playwright/test** - Framework de automatización
- **typescript** - Lenguaje con tipos
- **@types/node** - Tipos para Node.js

## 📝 Mejores Prácticas

1. ✅ Usar Page Objects para toda interacción con la página
2. ✅ Mantener selectores actualizados
3. ✅ Usar fixtures personalizados
4. ✅ Logging adecuado para debugging
5. ✅ Datos de prueba en constants.ts
6. ✅ Tests independientes y aislados
7. ✅ Nombres de tests descriptivos

## ⚠️ Notas Importantes

- La carpeta `OLD/` está excluida del proyecto y no se ejecutará
- No commitear `.env` (usar `.env.example`)
- Los reports y videos se guardan en `playwright-report/`
- Crear fixtures para casos comunes de setup

## 🤝 Contribuir

Cuando crees nuevos tests:
1. Sigue la estructura de directorios
2. Crea Page Objects para cada página
3. Usa los fixtures disponibles
4. Documenta métodos complejos

---

**¿Preguntas?** Consulta la [documentación oficial de Playwright](https://playwright.dev)
