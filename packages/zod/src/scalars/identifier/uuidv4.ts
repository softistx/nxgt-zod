import { z } from 'zod';

/**
 * An RFC 9562 UUID of version 4 (random).
 */
export const uuidv4Schema = z.uuidv4();

/** The GraphQL name of this scalar, which keys it in `scalarSchemas`. */
export const uuidv4Name = 'UUIDv4';
