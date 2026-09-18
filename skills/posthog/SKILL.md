---
name: posthog
description: >
  PostHog analytics, feature flags, experiments, and session replay in Next.js.
  Use when the user mentions: posthog, feature flag, banderas, feature flags,
  A/B test, experiment, rollout, cohort, posthog event, capture event,
  useFeatureFlag, PostHogProvider, analytics, session replay, posthog identify.
---

# PostHog — Next.js App Router

## Setup

```bash
pnpm add posthog-js
```

```tsx
// app/providers.tsx
'use client'
import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
import { useEffect } from 'react'

export function PHProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://eu.i.posthog.com',
      capture_pageview: false, // Manejamos manualmente en App Router
    })
  }, [])

  return <PostHogProvider client={posthog}>{children}</PostHogProvider>
}
```

## Capturar eventos

```ts
import { usePostHog } from 'posthog-js/react'

const posthog = usePostHog()

// Evento simple
posthog.capture('button_clicked', { button_id: 'cta-hero', screen: 'landing' })

// Identificar usuario (después de login)
posthog.identify(userId, { email, plan: 'pro' })

// Reset al logout
posthog.reset()
```

**Naming:** snake_case para eventos — `checkout_started`, `feature_used`, `payment_failed`

## Feature Flags

```tsx
import { useFeatureFlagEnabled } from 'posthog-js/react'

// En componente client
function MyComponent() {
  const isNewCheckout = useFeatureFlagEnabled('new-checkout-flow')

  if (isNewCheckout) return <NewCheckout />
  return <OldCheckout />
}
```

```ts
// En server component (con posthog-node)
import { PostHog } from 'posthog-node'

const client = new PostHog(process.env.POSTHOG_KEY!)
const isEnabled = await client.isFeatureEnabled('new-checkout-flow', userId)
await client.shutdown()
```

## Page views en App Router

```tsx
// components/PostHogPageView.tsx
'use client'
import { usePathname, useSearchParams } from 'next/navigation'
import { usePostHog } from 'posthog-js/react'
import { useEffect } from 'react'

export function PostHogPageView() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const posthog = usePostHog()

  useEffect(() => {
    posthog.capture('$pageview', { $current_url: window.location.href })
  }, [pathname, searchParams])

  return null
}
```

## Variables de entorno requeridas

```bash
# .env.local
NEXT_PUBLIC_POSTHOG_KEY=phc_xxxxxxxxxxxx
NEXT_PUBLIC_POSTHOG_HOST=https://eu.i.posthog.com
POSTHOG_KEY=phc_xxxxxxxxxxxx  # Para server-side con posthog-node
```

## MCP — gestionar desde Claude Code

Con el MCP de PostHog conectado (`https://mcp.posthog.com/mcp`):
- "Lista mis feature flags" → muestra nombre, estado, rollout %
- "Activa el flag `new-checkout` para el 50%" → lo actualiza
- "¿Cuántos usuarios activos esta semana?" → query de insights
- "¿Cómo va el experimento de onboarding?" → resultados del A/B test

## Reglas

- Siempre `capture_pageview: false` en App Router — captura manual con `PostHogPageView`
- No identifiques usuarios antes de que acepten cookies/privacidad si aplica GDPR
- Feature flags en server: recuerda llamar `await client.shutdown()` para no dejar conexiones abiertas
- Usa `useFeatureFlagEnabled` en client, `isFeatureEnabled` en server — no mezcles
