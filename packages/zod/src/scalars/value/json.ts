import { z } from 'zod';
import { isJsonValue } from '../../rules/json';

/**
 * Any JSON value, kept as it is: `null`, a boolean, a string, a finite
 * number, an array or a plain object of them. A query literal of any kind
 * is read, objects and lists included. What JSON cannot write back as it
 * is (a cycle, `undefined`, a `Date`, `NaN`, `-0`) is refused, both ways.
 */
export const jsonSchema = z
	.unknown()
	.refine(isJsonValue, { error: 'Invalid JSON value' });

/** The GraphQL name of this scalar, which keys it in `scalarSchemas`. */
export const jsonName = 'JSON';
