// `scalarSchemas` is a public contract read by code generators: keyed by
// GraphQL name, each entry the exact schema, never widened.
import { expect, test } from 'bun:test';
import { z } from 'zod';
import {
	dateTimeSchema,
	type ScalarName,
	type ScalarSchemas,
	scalarSchemas,
	schemas,
	uuidSchema,
} from './index';

test('holds the same schemas as `schemas`, under the GraphQL names', () => {
	expect(Object.keys(scalarSchemas)).toHaveLength(Object.keys(schemas).length);
	expect(new Set(Object.values(scalarSchemas))).toEqual(
		new Set(Object.values(schemas)),
	);
	expect(scalarSchemas.UUID).toBe(uuidSchema);
	expect(scalarSchemas.DateTime).toBe(dateTimeSchema);
	expect(schemas.dateTime).toBe(dateTimeSchema);
});

test('decodes a wire value to what a caller receives, codecs included', () => {
	const at: Date = z.decode(scalarSchemas.DateTime, '2024-03-10T12:00:00Z');
	expect(z.encode(scalarSchemas.DateTime, at)).toBe('2024-03-10T12:00:00.000Z');
	expect(z.decode(scalarSchemas.Timestamp, 0)).toEqual(new Date(0));
	expect(z.decode(scalarSchemas.Long, '9007199254740993')).toBe(
		9007199254740993n,
	);
});

// A name whose entry is wide enough to take any schema. Must be none, for
// every scalar now and later, with no list to keep.
type Widened = {
	[N in ScalarName]: z.ZodType extends ScalarSchemas[N] ? N : never;
}[ScalarName];
const noneWidened: [Widened] extends [never] ? true : false = true;

test('types each entry exactly, not as z.ZodType', () => {
	expect(noneWidened).toBe(true);
	const exact: typeof dateTimeSchema = scalarSchemas.DateTime;
	expect(exact).toBe(dateTimeSchema);
	const name: ScalarName = 'IBAN';
	expect(name in scalarSchemas).toBe(true);
});
