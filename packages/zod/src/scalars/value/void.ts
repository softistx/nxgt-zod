import { z } from 'zod';

/**
 * No value: the type of a field that only acts, such as a mutation with
 * nothing to return. `null` is the one value; GraphQL writes it without
 * asking the scalar, and a resolver returning anything else is refused.
 */
export const voidSchema = z.null({ error: 'Invalid void: expected null' });

/** The GraphQL name of this scalar, which keys it in `scalarSchemas`. */
export const voidName = 'Void';
