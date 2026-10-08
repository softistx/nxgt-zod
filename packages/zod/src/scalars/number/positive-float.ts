import { z } from 'zod';

/** A finite number above 0. */
export const positiveFloatSchema = z.number().positive();

/** The GraphQL name of this scalar, which keys it in `scalarSchemas`. */
export const positiveFloatName = 'PositiveFloat';
