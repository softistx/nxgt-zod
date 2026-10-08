import { z } from 'zod';

/**
 * A KSUID: 27 characters of base62, at most `aWgEPTl1tmebfsQzFP4bxwgy80V`
 * (160 bits). The alphabet is in ASCII order and the length fixed, so
 * comparing the strings compares the numbers.
 */
export const ksuidSchema = z
	.ksuid()
	.refine((id) => id <= 'aWgEPTl1tmebfsQzFP4bxwgy80V', {
		error: 'Invalid KSUID',
	});

/** The GraphQL name of this scalar, which keys it in `scalarSchemas`. */
export const ksuidName = 'KSUID';
