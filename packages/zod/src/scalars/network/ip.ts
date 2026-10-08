import { z } from 'zod';
import { ipv4Schema } from './ipv4';
import { ipv6Schema } from './ipv6';

/**
 * An IPv4 or an IPv6 address, as `IPv4` and `IPv6` take them.
 */
export const ipSchema = z.union([ipv4Schema, ipv6Schema], {
	error: 'Invalid IP address: expected IPv4 or IPv6',
});

/** The GraphQL name of this scalar, which keys it in `scalarSchemas`. */
export const ipName = 'IP';
