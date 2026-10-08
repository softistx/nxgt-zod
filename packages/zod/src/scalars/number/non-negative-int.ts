import { z } from 'zod';
import { noNegativeZero } from '../../rules/integer';

/** 0 to 2³¹ − 1: 32 bits, as GraphQL's `Int`. */
export const nonNegativeIntSchema = noNegativeZero(z.int32().nonnegative());

/** The GraphQL name of this scalar, which keys it in `scalarSchemas`. */
export const nonNegativeIntName = 'NonNegativeInt';
