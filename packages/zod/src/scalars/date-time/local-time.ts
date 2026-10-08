import { z } from 'zod';

/**
 * A time of day with no offset: `HH:MM`, or `HH:MM:SS` with an optional
 * fraction (`10:15`, `10:15:30.5`). It names no instant until a date and a
 * place are given.
 */
export const localTimeSchema = z.iso.time();

/** The GraphQL name of this scalar, which keys it in `scalarSchemas`. */
export const localTimeName = 'LocalTime';
