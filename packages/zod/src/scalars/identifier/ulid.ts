import { z } from 'zod';

/**
 * A ULID: 26 characters of Crockford base32, the first 0 to 7. Crockford
 * base32 ignores case, so either case is taken, and kept as sent.
 */
export const ulidSchema = z.ulid();

/** The GraphQL name of this scalar, which keys it in `scalarSchemas`. */
export const ulidName = 'ULID';
