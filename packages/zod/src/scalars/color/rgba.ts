import { z } from 'zod';
import { ALPHA, BYTE, cssFunction } from '../../rules/color';

/**
 * A CSS `rgba()` color in comma syntax, `rgba(255, 0, 0, 0.5)`: three
 * integers from 0 to 255, then an alpha from 0 to 1 (`0`, `1`, or a fraction
 * such as `0.5`, with no trailing zero).
 */
export const rgbaSchema = z
	.string()
	.regex(cssFunction('rgba', BYTE, BYTE, BYTE, ALPHA), {
		error:
			'Invalid RGBA color: expected rgba(R, G, B, A), each 0 to 255, A 0 to 1',
	});

/** The GraphQL name of this scalar, which keys it in `scalarSchemas`. */
export const rgbaName = 'RGBA';
