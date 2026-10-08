import { describe, expect, test } from 'bun:test';
import { z } from 'zod';
import { integerCases, refusal, schemaCases } from '../../../test/schema-cases';
import { bigIntSchema } from './big-int';

describe('BigInt', () => {
	integerCases('BigInt', bigIntSchema);

	schemaCases('BigInt', bigIntSchema, {
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
		expect(z.decode(bigIntSchema, '9223372036854775807')).toBe(
			9223372036854775807n,
		);
		expect(z.decode(bigIntSchema, 42)).toBe(42n);
		expect(z.encode(bigIntSchema, -9223372036854775808n)).toBe(
			'-9223372036854775808',
		);
	});

	test('a number is refused on the way out: the value is a bigint', () => {
		expect(z.safeEncode(bigIntSchema as z.ZodType, 42).success).toBe(false);
	});

	test('a number past 2^53 is refused, not rounded', () => {
		const hint = 'Invalid integer: past 2^53, write it as a string';
		expect(refusal(bigIntSchema, 2 ** 53)).toBe(hint);
		expect(refusal(bigIntSchema, -(2 ** 53))).toBe(hint);
		expect(z.decode(bigIntSchema, '9007199254740993')).toBe(9007199254740993n);
	});

	test('it has no bound', () => {
		expect(z.decode(bigIntSchema, '123456789012345678901234567890')).toBe(
			123456789012345678901234567890n,
		);
		expect(z.encode(bigIntSchema, -(10n ** 40n))).toBe(`-1${'0'.repeat(40)}`);
	});
});
