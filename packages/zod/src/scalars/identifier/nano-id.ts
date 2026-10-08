import { z } from 'zod';

/**
 * A Nano ID of the default shape: 21 characters of `A-Za-z0-9_-`.
 */
export const nanoIdSchema = z.nanoid();

/** The GraphQL name of this scalar, which keys it in `scalarSchemas`. */
export const nanoIdName = 'NanoID';
