// The cases every scalar's spec runs: what its schema accepts and what it
// refuses, both ways. A scalar's own behaviour beyond that (a codec, a
// normalisation) gets its own tests beside these.
import { expect, test } from 'bun:test';
import { z } from 'zod';

export interface SchemaCases {
	/** Wire values the schema accepts. */
	readonly accepted: readonly unknown[];
	/** Values refused on the way in, and on the way out when `passThrough`. */
	readonly refused: readonly unknown[];
	/**
	 * The schema only validates: an accepted value comes back unchanged both
	 * ways, and a refused one is refused on the way out too. `false` for a
	 * codec, whose output is not its wire value. Default `true`.
	 */
	readonly passThrough?: boolean;
}

export function schemaCases(
	name: string,
	schema: z.ZodType,
	{ accepted, refused, passThrough = true }: SchemaCases,
): void {
	test(`${name} accepts its wire values, and writes them back`, () => {
		for (const value of accepted) {
			const parsed = schema.safeParse(value);
			expect(parsed.success).toBe(true);
			const encoded = z.safeEncode(schema, parsed.data);
			expect(encoded.success).toBe(true);
			if (passThrough) {
				expect(parsed.data).toBe(value);
				expect(encoded.data).toBe(value);
			}
		}
	});

	test(`${name} refuses what is not one`, () => {
		for (const value of refused) {
			const parsed = schema.safeParse(value);
			expect(parsed.success).toBe(false);
			if (passThrough) {
				expect(z.safeEncode(schema, value).success).toBe(false);
			}
		}
	});
}

/**
 * An integer schema refuses `-0`, which JSON cannot tell from `0` but a
 * number can carry.
 */
export function integerCases(name: string, schema: z.ZodType): void {
	test(`${name} refuses -0`, () => {
		expect(schema.safeParse(-0).success).toBe(false);
	});
}

/** The first message a schema refuses `value` with. */
export function refusal(schema: z.ZodType, value: unknown): string | undefined {
	return schema.safeParse(value).error?.issues[0]?.message;
}

/** The first message a schema refuses `value` with on the way out. */
export function encodeRefusal(
	schema: z.ZodType,
	value: unknown,
): string | undefined {
	return z.safeEncode(schema, value).error?.issues[0]?.message;
}
