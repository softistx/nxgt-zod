import { z } from 'zod';

/**
 * A non-empty run of hexadecimal digits, in any case, kept as sent. No `0x`
 * prefix.
 */
export const hexadecimalSchema = z
	.hex()
	.min(1, { error: 'Invalid hexadecimal: expected at least one digit' });

/** The GraphQL name of this scalar, which keys it in `scalarSchemas`. */
export const hexadecimalName = 'Hexadecimal';
