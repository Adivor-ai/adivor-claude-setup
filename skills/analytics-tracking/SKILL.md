---
name: analytics-tracking
description: >
  Analytics event tracking with Amplitude, FullStory, and Datadog.
  Use when the user mentions: analytics, tracking, amplitude, fullstory,
  datadog, log event, track event, track action, add analytics, user event,
  screen view, session recording, datadog rum, datadog logs.
  Do NOT trigger for Sentry errors or PostHog feature flags — those have their own skills.
---

# Analytics & Tracking

Guidance for Amplitude, FullStory, and Datadog RUM in the project.

## Amplitude

```ts
import { track } from '@amplitude/analytics-browser'

// Event naming: PascalCase noun + past-tense verb
track('ButtonClicked', { buttonId: 'cta-hero', screen: 'Landing' })
track('ScreenViewed', { screenName: 'Dashboard' })
track('FormSubmitted', { formId: 'checkout', success: true })
```

**Naming conventions:**
- Events: `NounVerbed` — `ButtonClicked`, `ModalOpened`, `PaymentFailed`
- Properties: camelCase, descriptive — `buttonId`, `screenName`, `errorCode`
- Never track PII (email, name, phone) directly — use anonymous IDs

## Datadog RUM

```ts
import { datadogRum } from '@datadog/browser-rum'

// Custom actions
datadogRum.addAction('checkout_started', { cartTotal: 99.99 })

// Custom errors (non-Sentry path)
datadogRum.addError(new Error('Payment timeout'), { orderId: '123' })

// Custom attributes on the session
datadogRum.setUserProperty('plan', 'pro')
```

## FullStory

```ts
import * as FullStory from '@fullstory/browser'

FullStory.event('Checkout Started', { cartTotal_real: 99.99 })
FullStory.setUserVars({ displayName: 'User #123', plan_str: 'pro' })
```

**FullStory type suffixes:** `_str`, `_int`, `_real`, `_bool`, `_date` — required for custom properties.

## Directory structure

```
src/utils/analytics/     ← Amplitude helpers
src/datadog/             ← Datadog RUM config and custom actions
```

## Rules

- One tracking call per user action — don't double-track the same event
- Track at the point of action, not at render
- Always include a `screen` or `context` property so events are filterable
- Use constants for event names — never raw strings scattered in components
