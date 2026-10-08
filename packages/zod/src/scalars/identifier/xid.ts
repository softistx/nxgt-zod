import { z } from 'zod';

/**
 * An xid: 20 characters of base32hex, lowercase, as rs/xid writes and reads
 * it. 12 bytes leave 4 bits unused, so the last character is `0` or `g`.
 */
export const xidSchema = z.xid().regex(/^[0-9a-v]{19}[0g]$/, {
	error: 'Invalid XID',
});

/** The GraphQL name of this scalar, which keys it in `scalarSchemas`. */
export const xidName = 'XID';
