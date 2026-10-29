/**
 * Boot snippet that turns Zod's `jitless` mode on for every copy of Zod on the
 * page. Under a CSP without `'unsafe-eval'`, Zod tries `new Function` when it
 * builds its first object schema and the browser reports a violation. Zod
 * creates `globalThis.__zod_globalConfig` only when it is absent, so a script
 * that runs before any module, and sets `jitless` on it, is honoured by every
 * copy, including the ones libraries bundle and build schemas with as they load.
 *
 * Put it in an inline script that carries the page's nonce, before any module.
 */
export const ZOD_JITLESS = '(globalThis.__zod_globalConfig??={}).jitless=true';
