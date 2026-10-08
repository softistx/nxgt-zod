import { describe, expect, test } from 'bun:test';
import { z } from 'zod';
import {
	encodeRefusal,
	integerCases,
	refusal,
	schemaCases,
} from '../../../test/schema-cases';
import { longSchema } from './long';

describe('Long', () => {
	integerCases('Long', longSchema);

	schemaCases('Long', longSchema, {
		accepted: ['0', '-1', '9223372036854775807', '-9223372036854775808', 42],
		refused: [
			'007',
			'-0',
			'1.5',
			'1e3',
			' 1',
			'',
			1.5,
			2 ** 53,
			true,
			null,
			5n,
		],
		passThrough: false,
	});

	test('a string becomes a bigint, and a bigint goes out as its string', () => {
		expect(z.decode(longSchema, '9223372036854775807')).toBe(
			9223372036854775807n,
		);
		expect(z.decode(longSchema, 42)).toBe(42n);
		expect(z.encode(longSchema, -9223372036854775808n)).toBe(
			'-9223372036854775808',
		);
	});

	test('a number is refused on the way out: the value is a bigint', () => {
		expect(z.safeEncode(longSchema as z.ZodType, 42).success).toBe(false);
	});

	test('a number past 2^53 is refused, not rounded', () => {
		const hint = 'Invalid integer: past 2^53, write it as a string';
		expect(refusal(longSchema, 2 ** 53)).toBe(hint);
		expect(refusal(longSchema, -(2 ** 53))).toBe(hint);
		expect(z.decode(longSchema, '9007199254740993')).toBe(9007199254740993n);
	});

	test('it holds to 64 bits, both ways', () => {
		expect(z.safeParse(longSchema, '9223372036854775808').success).toBe(false);
		expect(encodeRefusal(longSchema, 2n ** 63n)).toBeString();
		expect(z.safeParse(longSchema, '-9223372036854775809').success).toBe(false);
		expect(encodeRefusal(longSchema, -(2n ** 63n) - 1n)).toBeString();
	});
});
