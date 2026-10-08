import { z } from 'zod';
import { noNegativeZero } from '../../rules/integer';

/**
 * An integer JavaScript holds exactly: ±(2⁵³ − 1). Beyond 32 bits, so it is
 * not GraphQL's `Int`; past 2⁵³ use `Long` or `BigInt`.
 */
export const safeIntSchema = noNegativeZero(z.int());

/** The GraphQL name of this scalar, which keys it in `scalarSchemas`. */
export const safeIntName = 'SafeInt';
