// The guards that let this folder grow to a hundred scalars: each file is
// one scalar, named after it, specced beside it, registered through its
// category's index.ts, and documented. Adding a scalar and forgetting any of
// those fails here, not in a consumer.
import { describe, expect, test } from 'bun:test';
import { join } from 'node:path';
import { Glob } from 'bun';
import { z } from 'zod';
import { scalarSchemas, schemas } from './index';

const HERE = import.meta.dir;
const GUIDES = join(HERE, '../../docs/guide/scalars');

/** The letters of a name, case and hyphens aside: `IPv4` and `ipv4` match. */
function letters(name: string): string {
	return name.replaceAll('-', '').toLowerCase();
}

const files = [...new Glob('*/*.ts').scanSync(HERE)]
	.filter((file) => !file.endsWith('.spec.ts') && !file.endsWith('/index.ts'))
	.sort();

/** The one name and the one schema a scalar file exports. */
async function exportsOf(file: string) {
	const module: Record<string, unknown> = await import(join(HERE, file));
	const names = Object.entries(module).filter(([key]) => key.endsWith('Name'));
	const zods = Object.entries(module).filter(
		([, value]) => value instanceof z.ZodType,
	);
	return { module, names, zods };
}

describe('every scalar file', () => {
	test('there is at least one', () => {
		expect(files.length).toBeGreaterThan(0);
	});

	for (const file of files) {
		const base = file.slice(file.indexOf('/') + 1, -'.ts'.length);

		test(`${file} exports its GraphQL name and its schema, named after it`, async () => {
			const { module, names, zods } = await exportsOf(file);
			expect(names).toHaveLength(1);
			expect(zods).toHaveLength(1);
			const [[nameExport, name]] = names as [[string, unknown]];
			const [[schemaExport]] = zods as [[string, unknown]];
			// Nothing else: `export *` would lift it to the package root.
			expect(Object.keys(module).sort()).toEqual(
				[nameExport, schemaExport].sort(),
			);
			// `ipv4.ts` holds `IPv4`, `date-time.ts` holds `DateTime`.
			expect(base).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
			expect(typeof name).toBe('string');
			expect(letters(base)).toBe(letters(name as string));
			expect(schemaExport).toMatch(/^[a-z][A-Za-z0-9]*Schema$/);
			expect(letters(schemaExport)).toBe(`${letters(base)}schema`);
			expect(nameExport).toBe(schemaExport.replace(/Schema$/, 'Name'));
		});

		test(`${file} is registered through its category's index.ts`, async () => {
			const { names, zods } = await exportsOf(file);
			const [[, name]] = names as [[string, string]];
			const [[schemaExport, schema]] = zods as [[string, unknown]];
			const byName: Record<string, unknown> = scalarSchemas;
			expect(byName[name]).toBe(schema);
			const byExport: Record<string, unknown> = schemas;
			expect(byExport[schemaExport.replace(/Schema$/, '')]).toBe(schema);
		});

		test(`${file} has a spec beside it`, async () => {
			const spec = join(HERE, file.replace(/\.ts$/, '.spec.ts'));
			expect(await Bun.file(spec).exists()).toBe(true);
		});
	}

	test('nothing is registered that no file holds', () => {
		expect(Object.keys(scalarSchemas)).toHaveLength(files.length);
		expect(Object.keys(schemas)).toHaveLength(files.length);
	});

	test('both records are in code-unit order', () => {
		const sorted = (keys: string[]) => [...keys].sort();
		// Ordered as `<Name>Scalar` sorts, as @nxgt/graphql-scalars orders it.
		expect(Object.keys(scalarSchemas).map((key) => `${key}Scalar`)).toEqual(
			sorted(Object.keys(scalarSchemas).map((key) => `${key}Scalar`)),
		);
		expect(Object.keys(schemas).map((key) => `${key}Schema`)).toEqual(
			sorted(Object.keys(schemas).map((key) => `${key}Schema`)),
		);
		const names = Object.keys(scalarSchemas);
		expect(names.indexOf('HSLA')).toBeLessThan(names.indexOf('HSL'));
		expect(names.indexOf('IBAN')).toBeLessThan(names.indexOf('IP'));
	});

	test('every category has its guide page, and no page is left over', () => {
		const categories = [
			...new Set(files.map((file) => file.slice(0, file.indexOf('/')))),
		];
		const pages = [...new Glob('*.md').scanSync(GUIDES)].map((page) =>
			page.slice(0, -'.md'.length),
		);
		expect(pages.sort()).toEqual(categories.sort());
	});

	test("every scalar has a section in its category's guide page", async () => {
		const missing: string[] = [];
		for (const file of files) {
			const [category] = file.split('/');
			const { names } = await exportsOf(file);
			const [[, name]] = names as [[string, string]];
			const page = await Bun.file(join(GUIDES, `${category}.md`)).text();
			if (!page.split('\n').includes(`## \`${name}\``)) {
				missing.push(`${name} in docs/guide/scalars/${category}.md`);
			}
		}
		expect(missing).toEqual([]);
	});
});
