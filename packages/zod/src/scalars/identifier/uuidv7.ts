import { z } from 'zod';

/**
 * An RFC 9562 UUID of version 7 (time-ordered).
 */
export const uuidv7Schema = z.uuidv7();

/** The GraphQL name of this scalar, which keys it in `scalarSchemas`. */
export const uuidv7Name = 'UUIDv7';
