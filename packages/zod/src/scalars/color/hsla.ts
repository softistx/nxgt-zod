import { z } from 'zod';
import { ALPHA, cssFunction, HUE, PERCENT } from '../../rules/color';

/**
 * A CSS `hsla()` color in comma syntax, `hsla(120, 100%, 50%, 0.5)`: as
 * `HSL`, then an alpha from 0 to 1 (`0`, `1`, or a fraction such as `0.5`,
 * with no trailing zero).
 */
export const hslaSchema = z
	.string()
	.regex(cssFunction('hsla', HUE, PERCENT, PERCENT, ALPHA), {
		error:
			'Invalid HSLA color: expected hsla(H, S%, L%, A), H 0 to 359, S and L 0 to 100, A 0 to 1',
	});

/** The GraphQL name of this scalar, which keys it in `scalarSchemas`. */
export const hslaName = 'HSLA';
