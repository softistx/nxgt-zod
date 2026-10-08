import { z } from 'zod';

/**
 * An ISO 4217 currency code in force, uppercase (`EUR`, `USD`), from Zod's
 * list: the codes for funds, metals and testing (`XAU`, `XTS`, `XXX`) are
 * in it, a withdrawn code (`FRF`, `HRK`) is not. The list is Zod's, so a
 * newer Zod 4 may know a code an older one refuses.
 */
export const currencySchema = z.currencyCode({
	error: 'Invalid currency: expected an ISO 4217 code in force',
});

/** The GraphQL name of this scalar, which keys it in `scalarSchemas`. */
export const currencyName = 'Currency';
