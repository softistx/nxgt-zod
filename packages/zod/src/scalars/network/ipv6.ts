import { z } from 'zod';

/**
 * An IPv6 address, in any of its RFC 4291 text forms: full, compressed
 * (`::1`), or with an embedded IPv4 (`::ffff:192.0.2.1`). No zone (`%eth0`).
 */
export const ipv6Schema = z.ipv6();

/** The GraphQL name of this scalar, which keys it in `scalarSchemas`. */
export const ipv6Name = 'IPv6';
