import { z } from 'zod';

/**
 * A CSS hexadecimal color: `#` then 3, 4, 6 or 8 hexadecimal digits
 * (`#f00`, `#ff000080`), in either case, kept as sent.
 */
export const hexColorCodeSchema = z
	.string()
	.regex(/^#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/, {
		error: 'Invalid hex color code',
	});

/** The GraphQL name of this scalar, which keys it in `scalarSchemas`. */
export const hexColorCodeName = 'HexColorCode';
