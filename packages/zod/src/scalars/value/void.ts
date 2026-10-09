import { z } from 'zod';

/**
 * No value: the result of something that only acts, such as a mutation
 * with nothing to return. `null` is the one value; anything else is
 * refused.
 */
export const voidSchema = z.null({ error: 'Invalid void: expected null' });

/** The GraphQL name of this scalar, which keys it in `scalarSchemas`. */
export const voidName = 'Void';
