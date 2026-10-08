import { z } from 'zod';
import { isCanonicalBase64 } from '../../rules/base64';

/**
 * Standard base64 (RFC 4648, section 4) with its padding, in its one
 * canonical spelling: `YR==` decodes to the same byte as `YQ==` and is
 * refused. The empty string is the encoding of no bytes, and is taken.
 */
export const base64Schema = z
	.base64()
	.refine(isCanonicalBase64, { error: 'Invalid base64' });

/** The GraphQL name of this scalar, which keys it in `scalarSchemas`. */
export const base64Name = 'Base64';
