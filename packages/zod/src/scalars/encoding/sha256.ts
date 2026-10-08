import { z } from 'zod';

/**
 * A SHA-256 digest as 64 hexadecimal digits, in either case, kept as sent.
 */
export const sha256Schema = z.hash('sha256', {
	error: 'Invalid SHA-256 digest: expected 64 hexadecimal digits',
});

/** The GraphQL name of this scalar, which keys it in `scalarSchemas`. */
export const sha256Name = 'SHA256';
