import { z } from 'zod';
import { validDate } from '../../rules/date';
import { noNegativeZero } from '../../rules/integer';

/** The furthest a `Date` reaches either side of 1970, in milliseconds. */
const LIMIT = 8.64e15;

/**
 * An instant as milliseconds since 1970-01-01T00:00:00Z on the wire (an
 * integer, negative before 1970), a `Date` once decoded. Past 2³¹, so
 * not GraphQL's `Int`. An invalid `Date` is refused on the way out.
 */
export const timestampSchema = z.codec(
	noNegativeZero(z.int().min(-LIMIT).max(LIMIT)),
	validDate(),
	{
		decode: (milliseconds) => new Date(milliseconds),
		encode: (date) => date.getTime(),
	},
);

/** The GraphQL name of this scalar, which keys it in `scalarSchemas`. */
export const timestampName = 'Timestamp';
