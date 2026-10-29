# Pages under a strict CSP

## Why

A Content Security Policy without `'unsafe-eval'` forbids `new Function`. Zod
tries it when it builds its first object schema (to compile a faster parser),
catches the refusal, and falls back, but the browser still reports a
`securitypolicyviolation` on every page load. Zod's `jitless` mode skips the
attempt. Zod reads it from `globalThis.__zod_globalConfig`, which it creates
only when absent, so a value set before any module loads applies to every copy
of Zod on the page, including the ones libraries bundle and use while they load.
A module of your own cannot run early enough; an inline script can.

## How

`@nxgt/zod/csp` (also re-exported by `@nxgt/zod`) exports `ZOD_JITLESS`, the
text of that script:

```ts
import { ZOD_JITLESS } from '@nxgt/zod/csp';

// ZOD_JITLESS === '(globalThis.__zod_globalConfig??={}).jitless=true'
```

Render it in an inline script that carries the page's nonce, before any
module script (React, in a root route):

```tsx
<head>
	<script nonce={nonce} dangerouslySetInnerHTML={{ __html: ZOD_JITLESS }} />
	{/* module scripts after */}
</head>
```

The nonce must be in your `script-src`; the snippet itself has no characters
that need escaping in HTML.

An existing `__zod_globalConfig` object is kept, with its other keys; only
`jitless` is set.
