# Encoding schemas

The `encoding` category of `@nxgt/zod`. Each schema is `<name>Schema`, named after the format's
GraphQL scalar name; the [schemas guide](../scalars.md) covers what they share. Every schema here is a string on both sides.

## Bytes, not strings

These schemas check the text; `parse` returns the string, not the bytes
behind it. Decode where you need them:

```ts
import { base64Schema } from '@nxgt/zod';

const text = base64Schema.parse('aGk='); // 'aGk=', still a string
const buffer = Buffer.from(text, 'base64'); // Node and Bun
const bytes = Uint8Array.fromBase64(text); // Uint8Array [104, 105]

// A Base64URL value names its alphabet:
Buffer.from('aGk', 'base64url');
Uint8Array.fromBase64('aGk', { alphabet: 'base64url' });
```

`Uint8Array.fromBase64` is recent: Bun, current browsers and recent Node have
it, older runtimes do not, and TypeScript types it only with an `esnext` lib.
Where it is missing, use `Buffer.from(text, 'base64')` (or `'base64url'`).

Another hash (`md5`, `sha1`, `sha384`) is a one-liner with `z.hash('md5')`.

## `Base64`

Schema `base64Schema`. Standard base64 (RFC 4648,
section 4) with its padding, in its one canonical spelling. Accepts `''` (no
bytes), `YQ==`, `aGk=` and `a+b/`; refuses `aGk` (no padding), `aGk==`,
`a-b_` (that is `Base64URL`), a space or a newline, and `YR==`: it decodes to
the same byte as `YQ==`, so it is a second spelling of the same bytes.

```ts
import { base64Schema } from '@nxgt/zod';

base64Schema.parse('YQ=='); // 'YQ=='
base64Schema.parse('YR==');
// throws ZodError: Invalid base64
base64Schema.parse('aGk');
// throws ZodError: Invalid base64-encoded string
```

## `Base64URL`

Schema `base64UrlSchema`. URL-safe base64 (RFC 4648,
section 5): `-` and `_`, no padding, canonical spelling only. Accepts `''`,
`YQ`, `aGk` and `a-b_`; refuses `aGk=` (padding), `a+b/` (that is `Base64`),
`a b` and `YR` (a second spelling of `YQ`).

```ts
import { base64UrlSchema } from '@nxgt/zod';

base64UrlSchema.parse('a-b_'); // 'a-b_'
base64UrlSchema.parse('YR');
// throws ZodError: Invalid base64url
base64UrlSchema.parse('aGk=');
// throws ZodError: Invalid base64url-encoded string
```

## `Hexadecimal`

Schema `hexadecimalSchema`. One or more hexadecimal
digits, in any case (mixed included), kept as sent (`AB` and `ab` are two
strings). An odd length is fine (`abc`). Refuses `''`, a `0x` prefix, a space
and a non-hex digit. For a digest of a known length use `SHA256` or `SHA512`.

```ts
import { hexadecimalSchema } from '@nxgt/zod';

hexadecimalSchema.parse('deadBEEF'); // 'deadBEEF'
hexadecimalSchema.parse('');
// throws ZodError: Invalid hexadecimal: expected at least one digit
hexadecimalSchema.parse('0x1f');
// throws ZodError: Invalid hex
```

## `JWT`

Schema `jwtSchema`. A JSON Web Token in compact form
(RFC 7519, RFC 7515): three base64url parts joined by `.`, each in its one
spelling (no padding, no unused bits set, as for `Base64URL`); a header and a
payload that are JSON objects; a signature that is not empty; and a header
`alg` that is a string, not empty and not `none` (in any case). **Only the
shape is checked; the signature is not verified.** An unsecured token is
refused even when it carries a signature (RFC 7518, 3.6). `typ` is not
checked, so `at+jwt` access tokens pass. Refuses `a.b.c`, `a.b`, four parts,
a payload that is not a JSON object, and `''`.

```ts
import { jwtSchema } from '@nxgt/zod';

const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U';

jwtSchema.parse(token); // token
jwtSchema.parse('eyJhbGciOiJub25lIn0.eyJzdWIiOiIxIn0.');
// throws ZodError: Invalid JWT
jwtSchema.parse('a.b.c');
// throws ZodError: Invalid JWT
```

A token that passed is well formed, not trusted. Verify it
with a JWT library, for example `jose` (install it yourself; it is not a
peer of this package):

## `SHA256`

Schema `sha256Schema`. A SHA-256 digest: 64 hexadecimal
digits, in any case (mixed included), kept as sent. Refuses 63 or 65 digits, a
non-hex digit, a SHA-512 length and `''`.

```ts
import { sha256Schema } from '@nxgt/zod';

sha256Schema.parse('A'.repeat(64)); // 'AAAA…', case kept
sha256Schema.parse('abc');
// throws ZodError: Invalid SHA-256 digest: expected 64 hexadecimal digits
```

The case is not normalised, so compare digests case-insensitively:

```ts
const same = (a: string, b: string) => a.toLowerCase() === b.toLowerCase();
```

## `SHA512`

Schema `sha512Schema`. A SHA-512 digest: 128
hexadecimal digits, in any case, kept as sent; compare it case-insensitively
as for `SHA256`. Refuses 127 or 129 digits, a SHA-256 length and `''`.

```ts
import { sha512Schema } from '@nxgt/zod';

sha512Schema.parse('f'.repeat(128)); // 'ffff…'
sha512Schema.parse('a'.repeat(64));
// throws ZodError: Invalid SHA-512 digest: expected 128 hexadecimal digits
```
