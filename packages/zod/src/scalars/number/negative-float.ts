import { z } from 'zod';

/** A finite number below 0. */
export const negativeFloatSchema = z.number().negative();

/** The GraphQL name of this scalar, which keys it in `scalarSchemas`. */
export const negativeFloatName = 'NegativeFloat';
