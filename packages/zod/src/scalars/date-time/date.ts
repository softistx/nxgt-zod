import { z } from 'zod';

/**
 * A calendar date, `YYYY-MM-DD`, kept a string on both sides: a `Date` is
 * an instant, and turning a birthday into one shifts it by a day in half
 * the time zones. An impossible day (`2021-02-30`) is refused.
 */
export const dateSchema = z.iso.date();

/** The GraphQL name of this scalar, which keys it in `scalarSchemas`. */
export const dateName = 'Date';
