import { z } from 'zod';

/**
 * Any 8-4-4-4-12 hexadecimal string, with no version or variant check, in
 * either case: what a Microsoft GUID or a nil UUID looks like. For a real
 * RFC 9562 UUID, use `UUID`.
 */
export const guidSchema = z.guid();

/** The GraphQL name of this scalar, which keys it in `scalarSchemas`. */
export const guidName = 'GUID';
