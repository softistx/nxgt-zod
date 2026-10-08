import { z } from 'zod';

/** A finite number, 0 or above. */
export const nonNegativeFloatSchema = z.number().nonnegative();

/** The GraphQL name of this scalar, which keys it in `scalarSchemas`. */
export const nonNegativeFloatName = 'NonNegativeFloat';
