import { z } from 'zod';

/**
 * A cuid2: a lowercase letter, then lowercase letters and digits, 2 to 32
 * characters in all (24 by default). Zod's `z.cuid2()` alone takes any run
 * of lowercase letters and digits, `1abc` included.
 */
export const cuid2Schema = z.cuid2().regex(/^[a-z][0-9a-z]{1,31}$/, {
	error: 'Invalid cuid2',
});

/** The GraphQL name of this scalar, which keys it in `scalarSchemas`. */
export const cuid2Name = 'Cuid2';
