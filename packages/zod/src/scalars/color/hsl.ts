import { z } from 'zod';
import { cssFunction, HUE, PERCENT } from '../../rules/color';

/**
 * A CSS `hsl()` color in comma syntax, `hsl(120, 100%, 50%)`: a hue from 0
 * to 359 degrees with no unit (360 is 0), then saturation and lightness as
 * integer percentages from 0% to 100%. No alpha: that is `HSLA`.
 */
export const hslSchema = z
	.string()
	.regex(cssFunction('hsl', HUE, PERCENT, PERCENT), {
		error:
			'Invalid HSL color: expected hsl(H, S%, L%), H 0 to 359, S and L 0 to 100',
	});

/** The GraphQL name of this scalar, which keys it in `scalarSchemas`. */
export const hslName = 'HSL';
