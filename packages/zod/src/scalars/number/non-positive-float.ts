import { z } from 'zod';

/** A finite number, 0 or below. */
export const nonPositiveFloatSchema = z.number().nonpositive();

/** The GraphQL name of this scalar, which keys it in `scalarSchemas`. */
export const nonPositiveFloatName = 'NonPositiveFloat';
