import { describe, expect, test } from 'bun:test';
import { z } from 'zod';
import {
	encodeRefusal,
	integerCases,
	schemaCases,
} from '../../../test/schema-cases';
import { timestampSchema } from './timestamp';

describe('Timestamp', () => {
	integerCases('Timestamp', timestampSchema);

	schemaCases('Timestamp', timestampSchema, {
		accepted: [0, 1710065730000, -1, 8.64e15, -8.64e15],
		refused: [1.5, 8.64e15 + 1, '1710065730000', '2024-03-10T10:15:30Z', null],
		passThrough: false,
	});

	test('milliseconds become a Date, and a Date goes out as its milliseconds', () => {
		expect(z.decode(timestampSchema, 1710065730000)).toEqual(
			new Date('2024-03-10T10:15:30.000Z'),
		);
		expect(
			z.encode(timestampSchema, new Date('1969-12-31T23:59:59.999Z')),
		).toBe(-1);
	});

	test('a value that is not a valid Date is refused on the way out', () => {
		expect(encodeRefusal(timestampSchema, new Date(Number.NaN))).toBe(
			'Invalid Date',
		);
		expect(
			z.safeEncode(timestampSchema as z.ZodType, 1710065730000).success,
		).toBe(false);
	});
});
