import { z } from 'zod';

/**
 * An IPv6 block in CIDR notation: an address and a prefix length 0 to 128
 * (`2001:db8::/32`). The address is not required to be the block's first.
 */
export const cidrv6Schema = z.cidrv6();

/** The GraphQL name of this scalar, which keys it in `scalarSchemas`. */
export const cidrv6Name = 'CIDRv6';
