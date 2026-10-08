import { z } from 'zod';
import { isCanonicalBase64Url } from '../../rules/base64';

/**
 * URL-safe base64 (RFC 4648, section 5): `-` and `_` for `+` and `/`, no
 * padding, in its one canonical spelling (`YR` for `YQ` is refused).
 */
export const base64UrlSchema = z.base64url().refine(isCanonicalBase64Url, {
	error: 'Invalid base64url',
});

/** The GraphQL name of this scalar, which keys it in `scalarSchemas`. */
export const base64UrlName = 'Base64URL';
