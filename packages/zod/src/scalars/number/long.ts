import { z } from 'zod';
import { bigIntegerCodec } from '../../rules/big-integer';

/**
 * A signed 64-bit integer, −2⁶³ to 2⁶³ − 1: a `bigint` in the resolvers, a
 * decimal string on the wire (a safe-integer number is accepted on the way
 * in).
 */
export const longSchema = bigIntegerCodec(z.int64());

/** The GraphQL name of this scalar, which keys it in `scalarSchemas`. */
export const longName = 'Long';
