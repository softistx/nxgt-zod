import { z } from 'zod';
import { bigIntegerCodec } from '../../rules/big-integer';

/**
 * An integer of any size: a `bigint` in the resolvers, a decimal string on
 * the wire (a safe-integer number is accepted on the way in).
 */
export const bigIntSchema = bigIntegerCodec(z.bigint());

/** The GraphQL name of this scalar, which keys it in `scalarSchemas`. */
export const bigIntName = 'BigInt';
