import { z } from 'zod';
import { noNegativeZeroOffset, OFFSET } from '../../rules/offset';

/**
 * An RFC 3339 `full-time`: a time of day with its offset, `HH:MM:SS`, an
 * optional fraction, then `Z` or `±HH:MM` (`10:15:30Z`, `10:15:30.5+02:00`).
 * The offset is canonical: an uppercase `Z`, hours 00 to 23, and no
 * `-00:00` (write `+00:00`, as `UtcOffset` does). No leap second.
 */
export const timeSchema = noNegativeZeroOffset(
	z
		.string()
		.regex(
			new RegExp(`^([01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d(\\.\\d+)?${OFFSET}$`),
			{
				error: 'Invalid time: expected HH:MM:SS with an offset',
			},
		),
);

/** The GraphQL name of this scalar, which keys it in `scalarSchemas`. */
export const timeName = 'Time';
