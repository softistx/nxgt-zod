import { z } from 'zod';

/**
 * An IPv4 address in dotted-quad form, each part 0 to 255 with no leading
 * zero (`192.168.0.1`).
 */
export const ipv4Schema = z.ipv4();

/** The GraphQL name of this scalar, which keys it in `scalarSchemas`. */
export const ipv4Name = 'IPv4';
