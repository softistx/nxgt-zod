import { describe, expect, test } from 'bun:test';
import { schemaCases } from '../../../test/schema-cases';
import { jsonSchema } from './json';

const cyclic: Record<string, unknown> = {};
cyclic['self'] = cyclic;
function nest(levels: number): unknown {
	let value: unknown = 0;
	for (let level = 0; level < levels; level++) value = [value];
	return value;
}
const deepest = nest(1000);
const deep = nest(1001);

describe('JSON', () => {
	schemaCases('JSON', jsonSchema, {
		accepted: [
			deepest,
			null,
			true,
			0,
			-1.5,
			'text',
			[],
			[1, 'a', null],
			{},
			{ a: { b: [null, false] } },
			Object.create(null),
		],
		refused: [
			undefined,
			Number.NaN,
			Number.POSITIVE_INFINITY,
			-0,
			[-0],
			{ a: -0 },
			1n,
			new Date(0),
			new Map(),
			() => 1,
			{ a: undefined },
			[1, undefined],
			new Array(1),
			cyclic,
			deep,
		],
	});

	test('a shared, not cyclic, object is a JSON value', () => {
		const shared = { a: 1 };
		expect(jsonSchema.parse([shared, shared])).toEqual([{ a: 1 }, { a: 1 }]);
	});

	test('a shared container is walked once per depth, not once per use', () => {
		let shared: unknown = 0;
		for (let level = 0; level < 40; level++) shared = [shared, shared];
		const started = performance.now();
		expect(jsonSchema.parse(shared)).toBe(shared);
		expect(performance.now() - started).toBeLessThan(1000);
	});

	test('a huge sparse array is refused at its first hole', () => {
		const sparse: unknown[] = [];
		sparse.length = 2 ** 32 - 1;
		expect(jsonSchema.safeParse(sparse).success).toBe(false);
	});
});
