import { z } from 'zod';

/**
 * A Semantic Versioning 2.0.0 version, as semver.org's own regular
 * expression reads it: `1.2.3`, `1.0.0-rc.1+build.5`. No `v` prefix.
 */
export const semverSchema = z
	.string()
	.regex(
		/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/,
		{ error: 'Invalid semantic version' },
	);

/** The GraphQL name of this scalar, which keys it in `scalarSchemas`. */
export const semverName = 'SemVer';
