import { describe, expect, test } from 'bun:test';
import { z } from 'zod';
import {
	encodeRefusal,
	refusal,
	schemaCases,
} from '../../../test/schema-cases';
import { dateTimeSchema } from './date-time';

describe('DateTime', () => {
	schemaCases('DateTime', dateTimeSchema, {
		accepted: [
			'2024-03-10T12:00:00+02:00',
			'2024-03-10T10:00:00Z',
			'2024-03-10T10:00:00+00:00',
			'2024-03-10T10:00:00+23:59',
			'2024-03-10T10:00:00.5Z',
			'2024-03-10T10:00:00.9999Z',
			`2024-03-10T10:00:00.${'9'.repeat(20)}Z`,
			'0000-01-01T00:00:00Z',
			'9999-12-31T23:59:59.999Z',
		],
		refused: [
			'2024-03-10T12:00:00',
			'2023-02-29T00:00:00Z',
			'2024-03-10',
			'2024-03-10T10:00:00-00:00',
			'2024-03-10T10:00:00+0100',
			'2024-03-10T10:00:00+24:00',
			'2024-03-10T10:15Z',
			'2024-03-10T23:59:60Z',
			'2024-03-10T24:00:00Z',
			'2024-03-10t10:00:00Z',
			'2024-03-10T10:00:00z',
			'2024-03-10 10:00:00Z',
			'2024-03-10T10:00:00.Z',
			// Instants toISOString() would write with a six-digit year.
			'0000-01-01T00:00:00+01:00',
			'9999-12-31T23:59:59-01:00',
		],
		passThrough: false,
	});

	test('decodes to a Date and encodes in UTC', () => {
		const date = z.decode(dateTimeSchema, '2024-03-10T12:00:00+02:00');
		expect(date).toBeInstanceOf(Date);
		expect(date.getTime()).toBe(Date.UTC(2024, 2, 10, 10));
		expect(z.encode(dateTimeSchema, date)).toBe('2024-03-10T10:00:00.000Z');
	});

	test('cuts a fraction to milliseconds, so every engine reads it the same', () => {
		const at = (text: string) => z.decode(dateTimeSchema, text).toISOString();
		expect(at('2024-03-10T10:00:00.5Z')).toBe('2024-03-10T10:00:00.500Z');
		expect(at('2024-03-10T10:00:00.9999Z')).toBe('2024-03-10T10:00:00.999Z');
		expect(at(`2024-03-10T10:00:00.${'9'.repeat(20)}+01:00`)).toBe(
			'2024-03-10T09:00:00.999Z',
		);
		expect(at('2024-03-10T10:00:00Z')).toBe('2024-03-10T10:00:00.000Z');
	});

	test('takes and writes the same instants: 0000 to 9999 in UTC', () => {
		const range = 'Invalid DateTime: outside 0000-01-01 to 9999-12-31 in UTC';
		expect(refusal(dateTimeSchema, '0000-01-01T00:00:00+01:00')).toBe(range);
		expect(
			encodeRefusal(dateTimeSchema, new Date('+010000-01-01T00:00:00Z')),
		).toBe(range);
		expect(
			encodeRefusal(dateTimeSchema, new Date('-000001-12-31T23:59:59.999Z')),
		).toBe(range);
		expect(z.encode(dateTimeSchema, new Date('0000-01-01T00:00:00.000Z'))).toBe(
			'0000-01-01T00:00:00.000Z',
		);
	});

	test('refuses -00:00, the offset RFC 3339 keeps for an unknown one', () => {
		expect(refusal(dateTimeSchema, '2024-03-10T10:00:00-00:00')).toBe(
			'Invalid offset: write no offset as +00:00',
		);
	});

	test('refuses a bad Date on the way out', () => {
		expect(encodeRefusal(dateTimeSchema, new Date(Number.NaN))).toBe(
			'Invalid Date',
		);
	});

	test('encodes a Date only, not a string a caller forgot to parse', () => {
		expect(
			z.safeEncode(dateTimeSchema as z.ZodType, '2024-03-10T10:00:00.000Z')
				.success,
		).toBe(false);
	});
});
