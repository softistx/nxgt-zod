import { z } from 'zod';

/**
 * A phone number in E.164 form: `+`, a country code that does not start
 * with 0, and 7 to 15 digits in all, with no space or separator
 * (`+33612345678`).
 */
export const phoneNumberSchema = z.e164();

/** The GraphQL name of this scalar, which keys it in `scalarSchemas`. */
export const phoneNumberName = 'PhoneNumber';
