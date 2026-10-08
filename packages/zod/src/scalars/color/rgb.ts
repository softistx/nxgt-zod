import { z } from 'zod';
import { BYTE, cssFunction } from '../../rules/color';

/**
 * A CSS `rgb()` color in comma syntax, `rgb(255, 0, 0)`: three integers
 * from 0 to 255, `", "` between them. No percentage, no alpha (that is
 * `RGBA`), no space-separated syntax.
 */
export const rgbSchema = z
	.string()
	.regex(cssFunction('rgb', BYTE, BYTE, BYTE), {
		error: 'Invalid RGB color: expected rgb(R, G, B), each 0 to 255',
	});

/** The GraphQL name of this scalar, which keys it in `scalarSchemas`. */
export const rgbName = 'RGB';
