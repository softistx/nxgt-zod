import { z } from 'zod';

/**
 * An IPv4 block in CIDR notation: an address and a prefix length 0 to 32
 * (`10.0.0.0/8`). The address is not required to be the block's first.
 */
export const cidrv4Schema = z.cidrv4();

/** The GraphQL name of this scalar, which keys it in `scalarSchemas`. */
export const cidrv4Name = 'CIDRv4';
