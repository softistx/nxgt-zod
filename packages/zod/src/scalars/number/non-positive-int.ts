import { z } from 'zod';
import { noNegativeZero } from '../../rules/integer';

/** −2³¹ to 0: 32 bits, as GraphQL's `Int`. */
export const nonPositiveIntSchema = noNegativeZero(z.int32().nonpositive());

/** The GraphQL name of this scalar, which keys it in `scalarSchemas`. */
export const nonPositiveIntName = 'NonPositiveInt';
