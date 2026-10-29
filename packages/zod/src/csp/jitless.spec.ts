import { describe, expect, test } from 'bun:test';
import { ZOD_JITLESS } from './jitless';

// Each case runs in a fresh process: Zod reads `__zod_globalConfig` once, when
// its core module loads, so the page state has to be built before the import.
const run = async (before: string) => {
	const script = `
		${before}
		let dynamic = 0;
		const Native = globalThis.Function;
		globalThis.Function = new Proxy(Native, {
			construct(target, args, newTarget) { dynamic++; return Reflect.construct(target, args, newTarget); },
			apply(target, thisArg, args) { dynamic++; return Reflect.apply(target, thisArg, args); },
		});
		(0, eval)(${JSON.stringify(ZOD_JITLESS)});
		const config = globalThis.__zod_globalConfig;
		const { z } = await import('zod');
		const schema = z.object({ a: z.string(), b: z.number() });
		const parsed = schema.safeParse({ a: 'x', b: 1 }).success;
		console.log(JSON.stringify({ dynamic, parsed, jitless: config.jitless, same: config === globalThis.__zod_globalConfig, kept: config.kept === true }));
	`;
	const proc = Bun.spawn(['bun', '-e', script], {
		cwd: import.meta.dir,
		stdout: 'pipe',
		stderr: 'pipe',
	});
	const [out, err] = await Promise.all([
		new Response(proc.stdout).text(),
		new Response(proc.stderr).text(),
	]);
	expect(err).toBe('');
	return JSON.parse(out.trim().split('\n').pop() ?? '');
};

describe('ZOD_JITLESS', () => {
	test('is the one-line expression apps put in an inline script', () => {
		expect(ZOD_JITLESS).toBe(
			'(globalThis.__zod_globalConfig??={}).jitless=true',
		);
	});

	test('creates the config when absent, and Zod then builds schemas without new Function', async () => {
		const result = await run('');
		expect(result).toEqual({
			dynamic: 0,
			parsed: true,
			jitless: true,
			same: true,
			kept: false,
		});
	});

	test('reuses an existing config object and keeps its other keys', async () => {
		const result = await run('globalThis.__zod_globalConfig = { kept: true };');
		expect(result).toMatchObject({
			dynamic: 0,
			parsed: true,
			jitless: true,
			same: true,
			kept: true,
		});
	});

	test('control: without the snippet, Zod does call new Function', async () => {
		const script = `
			let dynamic = 0;
			const Native = globalThis.Function;
			globalThis.Function = new Proxy(Native, { construct(t, a, n) { dynamic++; return Reflect.construct(t, a, n); } });
			const { z } = await import('zod');
			z.object({ a: z.string() }).safeParse({ a: 'x' });
			console.log(dynamic);
		`;
		const proc = Bun.spawn(['bun', '-e', script], {
			cwd: import.meta.dir,
			stdout: 'pipe',
		});
		expect(
			Number((await new Response(proc.stdout).text()).trim()),
		).toBeGreaterThan(0);
	});
});
