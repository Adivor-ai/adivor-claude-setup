---
name: sentry
description: >
  Sentry error monitoring, configuration, and issue management in Next.js.
  Use when the user mentions: sentry, error monitoring, stack trace, crash,
  captureException, error boundary, DSN, withSentry, sentry issue, sentry event,
  sentry project, bug in prod, production error, exception tracking.
---

# Sentry — Next.js App Router

## Setup (si no está configurado)

```bash
pnpm add @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

El wizard genera `sentry.client.config.ts`, `sentry.server.config.ts`, y `sentry.edge.config.ts`.

## Configuración mínima

```ts
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
})
```

## Capturar errores manualmente

```ts
import * as Sentry from '@sentry/nextjs'

// Capturar excepción con contexto
try {
  await riskyOperation()
} catch (error) {
  Sentry.captureException(error, {
    tags: { component: 'CheckoutForm' },
    extra: { orderId, userId },
  })
  throw error // Re-throw si quieres que suba
}

// Capturar mensaje (no excepción)
Sentry.captureMessage('Payment timeout after 30s', 'warning')
```

## Error Boundary en App Router

```tsx
// app/error.tsx  ← Next.js convención
'use client'
import * as Sentry from '@sentry/nextjs'
import { useEffect } from 'react'

export default function Error({ error }: { error: Error }) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return <div>Something went wrong</div>
}
```

## Variables de entorno requeridas

```bash
# .env.local
SENTRY_DSN=https://xxx@oXXX.ingest.sentry.io/XXX
NEXT_PUBLIC_SENTRY_DSN=https://xxx@oXXX.ingest.sentry.io/XXX
SENTRY_ORG=tu-org
SENTRY_PROJECT=tu-proyecto
SENTRY_AUTH_TOKEN=sntrys_xxx   # Solo para source maps en build
```

## MCP — consultar issues desde Claude Code

Con el MCP de Sentry conectado (`https://mcp.sentry.dev/mcp`):
- "¿Qué errores hay en prod hoy?" → lista issues por frecuencia
- "Muéstrame el stack trace de ENG-123" → fetch completo del issue
- "Fix this Sentry error: [URL]" → Claude lee el trace y propone fix

## Reglas

- Siempre re-throw después de `captureException` en server actions — no silencies errores
- No captures errores de validación de formulario (esos son esperados) — solo errores inesperados
- Agrega `tags.component` siempre para filtrar en el dashboard de Sentry
- Source maps: necesitas `SENTRY_AUTH_TOKEN` en CI para que los stack traces muestren código legible
