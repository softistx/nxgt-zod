import { z } from 'zod';
import { isJsonObject } from '../../rules/json';

/**
 * A JSON object, kept as it is: a plain object whose every field is a JSON
 * value. An array, `null` or a scalar value is refused, and so is anything
 * `JSON` refuses.
 */
export const jsonObjectSchema = z
	.unknown()
	.refine(isJsonObject, { error: 'Invalid JSON object' });

/** The GraphQL name of this scalar, which keys it in `scalarSchemas`. */
export const jsonObjectName = 'JSONObject';
