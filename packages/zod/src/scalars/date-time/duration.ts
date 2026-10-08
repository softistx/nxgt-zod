import { z } from 'zod';

/**
 * An ISO 8601 duration: `P` then years, months, weeks, days, and after `T`
 * hours, minutes, seconds (`P1Y2M3DT4H5M6S`, `PT0.5S`, `P2W`). Weeks are not
 * mixed with other units, there is no sign, and the letters are uppercase.
 * Only seconds take a fraction, with a dot or ISO's comma (`PT0,5S`), kept
 * as sent.
 */
export const durationSchema = z.iso.duration();

/** The GraphQL name of this scalar, which keys it in `scalarSchemas`. */
export const durationName = 'Duration';
