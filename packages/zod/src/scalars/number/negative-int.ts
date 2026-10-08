import { z } from 'zod';

/** −2³¹ to −1: 32 bits, as GraphQL's `Int`. */
export const negativeIntSchema = z.int32().negative();

/** The GraphQL name of this scalar, which keys it in `scalarSchemas`. */
export const negativeIntName = 'NegativeInt';
