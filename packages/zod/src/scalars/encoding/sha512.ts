import { z } from 'zod';

/**
 * A SHA-512 digest as 128 hexadecimal digits, in either case, kept as sent.
 */
export const sha512Schema = z.hash('sha512', {
	error: 'Invalid SHA-512 digest: expected 128 hexadecimal digits',
});

/** The GraphQL name of this scalar, which keys it in `scalarSchemas`. */
export const sha512Name = 'SHA512';
