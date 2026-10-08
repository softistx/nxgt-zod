import { z } from 'zod';

/**
 * A date and a time with no offset: `YYYY-MM-DDTHH:MM`, or with seconds
 * and an optional fraction (`2024-03-10T10:15:30`). No `Z`: that would make
 * it an instant, which is `DateTime`. An impossible day is refused.
 */
export const localDateTimeSchema = z.iso
	.datetime({ local: true })
	.refine((text) => !text.endsWith('Z'), {
		error: 'Invalid local date-time: it has no offset, not even Z',
	});

/** The GraphQL name of this scalar, which keys it in `scalarSchemas`. */
export const localDateTimeName = 'LocalDateTime';
