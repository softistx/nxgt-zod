import { z } from 'zod';

/**
 * A MongoDB ObjectId as text: 24 hexadecimal digits, in either case, kept
 * as sent. A string on both sides: map it to your driver's `ObjectId` in
 * your own code.
 */
export const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, {
	error: 'Invalid ObjectID',
});

/** The GraphQL name of this scalar, which keys it in `scalarSchemas`. */
export const objectIdName = 'ObjectID';
