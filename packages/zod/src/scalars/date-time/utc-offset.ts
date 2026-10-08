import { z } from 'zod';
import { noNegativeZeroOffset } from '../../rules/offset';

/**
 * A UTC offset, `±HH:MM`, from `-12:00` to `+14:00` (`+05:30`). `-00:00`
 * is refused: no offset is written `+00:00`.
 */
export const utcOffsetSchema = noNegativeZeroOffset(
	z
		.string()
		.regex(/^(\+(0\d|1[0-3]):[0-5]\d|\+14:00|-(0\d|1[01]):[0-5]\d|-12:00)$/, {
			error: 'Invalid UTC offset: expected ±HH:MM from -12:00 to +14:00',
		}),
);

/** The GraphQL name of this scalar, which keys it in `scalarSchemas`. */
export const utcOffsetName = 'UtcOffset';
