# Identifier schemas

The `identifier` category of `@nxgt/zod`. Each schema is `<name>Schema`, named after the format's
GraphQL scalar name; the [schemas guide](../scalars.md) covers what they share.

Every identifier is a string on both sides, returned as sent: a value is
checked, never normalised, so `UUID`, `UUIDv4`, `UUIDv7`, `GUID`, `ULID` and
`ObjectID` keep the case the client used, mixed case included (`XID` is
lowercase only). Compare them case-insensitively, or lower-case them after parsing.

## Choosing a UUID schema

| Schema | Takes | Pick it when |
| --- | --- | --- |
| `UUID` | an RFC 9562 UUID, any version 1 to 8, or the nil or max UUID | you accept ids from several sources |
| `UUIDv4` | version 4 (random) only | the id is generated at random, and a time-ordered one is a bug |
| `UUIDv7` | version 7 (time-ordered) only | rows are sorted or indexed by creation order |
| `GUID` | any 8-4-4-4-12 hex, no version or variant check | a Microsoft GUID, or a hand-made id with no version or variant that `UUID` refuses |

Another version (`v1`, `v5`, …) or a hash variant is a one-liner with
`z.uuid({ version: 'v5' })`:

## `UUID`

Schema `uuidSchema`. A string on both sides. Accepts
`550e8400-e29b-41d4-a716-446655440000`, in any case (mixed included, kept as
sent), the nil UUID `00000000-0000-0000-0000-000000000000` and the max UUID
`ffffffff-ffff-ffff-ffff-ffffffffffff` in either case; refuses a value with no
hyphens and `not-a-uuid`.

It is the 8-4-4-4-12 form of RFC 9562: a version 1 to 8 with the RFC variant,
or the nil or the max UUID. `uuidSchema` is a `z.ZodCustomStringFormat<'uuid'>`;
its issue keeps `format: 'uuid'`.

```ts
import { uuidSchema } from '@nxgt/zod';

uuidSchema.parse('550e8400-e29b-41d4-a716-446655440000');
uuidSchema.parse('FFFFFFFF-FFFF-FFFF-FFFF-FFFFFFFFFFFF'); // the max UUID
uuidSchema.parse('not-a-uuid');
// throws ZodError: Invalid UUID
```

## `UUIDv4`

Schema `uuidv4Schema`. A string on both sides. Accepts
`123e4567-e89b-42d3-a456-426614174000`, in either case; refuses a version 7
(`017f22e2-79b0-7cc3-98c4-dc0c0c07398f`), a version 1
(`123e4567-e89b-12d3-a456-426614174000`) and a wrong variant. It is
`z.uuidv4()`.

```ts
import { uuidv4Schema } from '@nxgt/zod';

uuidv4Schema.parse('123e4567-e89b-42d3-a456-426614174000');
uuidv4Schema.parse('123e4567-e89b-12d3-a456-426614174000');
// throws ZodError: Invalid UUID
```

## `UUIDv7`

Schema `uuidv7Schema`. A string on both sides. Accepts
`017f22e2-79b0-7cc3-98c4-dc0c0c07398f`; refuses a version 4 and a wrong variant
(`017f22e2-79b0-7cc3-c8c4-dc0c0c07398f`). It is `z.uuidv7()`.

```ts
import { uuidv7Schema } from '@nxgt/zod';

uuidv7Schema.parse('017f22e2-79b0-7cc3-98c4-dc0c0c07398f');
uuidv7Schema.parse('123e4567-e89b-42d3-a456-426614174000');
// throws ZodError: Invalid UUID
```

## `GUID`

Schema `guidSchema`. A string on both sides. Any
8-4-4-4-12 hexadecimal string, in either case, with no version or variant check.
Accepts `123e4567-e89b-12d3-a456-426614174000`,
`ABCDEF01-2345-6789-ABCD-EF0123456789` and the nil
`00000000-0000-0000-0000-000000000000`; refuses the brace form
(`{123e4567-…}`), a value with no hyphens, non-hex digits and a number. It is
`z.guid()`.

```ts
import { guidSchema } from '@nxgt/zod';

guidSchema.parse('ABCDEF01-2345-6789-ABCD-EF0123456789');
guidSchema.parse('{123e4567-e89b-12d3-a456-426614174000}');
// throws ZodError: Invalid GUID
```

## `ULID`

Schema `ulidSchema`. A string on both sides. 26 characters
of Crockford base32, the first 0 to 7. Accepts `01ARZ3NDEKTSV4RRFFQ69G5FAV`,
its lower-case form and `7ZZZZZZZZZZZZZZZZZZZZZZZZZ`; refuses a first character
above 7, an `I`, `L`, `O` or `U`, and a wrong length. It is `z.ulid()`; the case
is kept.

```ts
import { ulidSchema } from '@nxgt/zod';

ulidSchema.parse('01arz3ndektsv4rrffq69g5fav'); // returned as sent
ulidSchema.parse('81ARZ3NDEKTSV4RRFFQ69G5FAV');
// throws ZodError: Invalid ULID
```

## `Cuid2`

Schema `cuid2Schema`. A string on both sides. A lower-case
letter, then lower-case letters and digits, 2 to 32 characters in all (24 by
default). Accepts `tz4a98xxat96iws9zmbrgj3a` and `ab`; refuses `1abc` (starts
with a digit), `a` (too short), upper case, `-` and 33 characters.

It is stricter than `z.cuid2()`, which takes any run of lower-case letters and
digits and so lets `1abc` through; `cuid2Schema` adds the leading letter and the
length bounds.

```ts
import { cuid2Schema } from '@nxgt/zod';

cuid2Schema.parse('tz4a98xxat96iws9zmbrgj3a');
cuid2Schema.parse('1abc');
// throws ZodError: Invalid cuid2
```

## `NanoID`

Schema `nanoIdSchema`. A string on both sides. A Nano ID
of the default shape: 21 characters of `A-Za-z0-9_-`. Accepts
`V1StGXR8_Z5jdHi6B-myT`; refuses 20 or 22 characters and any other character.
An id made with a custom size or alphabet needs a schema of your own. It is
`z.nanoid()`.

```ts
import { nanoIdSchema } from '@nxgt/zod';

nanoIdSchema.parse('V1StGXR8_Z5jdHi6B-myT');
nanoIdSchema.parse('V1StGXR8_Z5jdHi6B-my');
// throws ZodError: Invalid nanoid
```

## `KSUID`

Schema `ksuidSchema`. A string on both sides. 27
characters of base62, at most `aWgEPTl1tmebfsQzFP4bxwgy80V` (160 bits).
Accepts `0ujtsYcgvSTl8PAuAdqWYSMnLOv`; refuses 26 or 28 characters, any other
character, and a value past the maximum (`aWgEPTl1tmebfsQzFP4bxwgy80W`).

```ts
import { ksuidSchema } from '@nxgt/zod';

ksuidSchema.parse('0ujtsYcgvSTl8PAuAdqWYSMnLOv');
ksuidSchema.parse('0ujtsYcgvSTl8PAuAdqWYSMnLO');
// throws ZodError: Invalid KSUID
```

## `XID`

Schema `xidSchema`. A string on both sides. 20 characters of
lowercase base32hex (`0-9`, `a-v`), as rs/xid writes and reads it; 12 bytes
leave 4 bits unused, so the last character is `0` or `g`. Accepts
`9m4e2mr0ui3e8a215n4g`; refuses uppercase (`9M4E2MR0UI3E8A215N4G`), a last
character other than `0` or `g` (`9m4e2mr0ui3e8a215n4h`), a `w` to `z` and a
wrong length.

```ts
import { xidSchema } from '@nxgt/zod';

xidSchema.parse('9m4e2mr0ui3e8a215n4g');
xidSchema.parse('9m4e2mr0ui3e8a215n4w');
// throws ZodError: Invalid XID
```

## `ObjectID`

Schema `objectIdSchema`. A MongoDB ObjectId as text:
24 hexadecimal digits, in either case, kept as sent. Accepts
`507f1f77bcf86cd799439011` and `507F1F77BCF86CD799439011`; refuses 23 or 25
digits, a non-hex digit and a leading space.

It is a string on both sides: map it to your driver's `ObjectId` after parsing.

```ts
import { objectIdSchema } from '@nxgt/zod';

objectIdSchema.parse('507f1f77bcf86cd799439011');
objectIdSchema.parse('507f1f77bcf86cd79943901');
// throws ZodError: Invalid ObjectID
```

```ts
// `mongodb` is your application's dependency, not this package's.
import { ObjectId } from 'mongodb';

const _id = new ObjectId(objectIdSchema.parse(id)); // a valid 24-digit string
```

## `ISBN`

Schema `isbnSchema`. A string on both sides. An ISBN-10 or
an ISBN-13, digits only, its check digit verified.

- ISBN-10: nine digits and a tenth that is a digit or an uppercase `X`.
- ISBN-13: starts with `978`, or `979` followed by 1 to 9 (`979-0` is the
  ISMN, for printed music, not an ISBN).
- No hyphen, space or `ISBN` prefix: the value is the bare digits.

Accepts `0306406152`, `080442957X`, `9780306406157` and `9791090636071`;
refuses a wrong check digit (`0306406153`, `9780306406158`), a lower-case `x`
(`080442957x`), hyphens (`978-0-306-40615-7`), a `977` prefix and a wrong
length. A client that shows hyphens strips them before it sends.

```ts
import { isbnSchema } from '@nxgt/zod';

isbnSchema.parse('9780306406157');
isbnSchema.parse('978-0-306-40615-7');
// throws ZodError: Invalid ISBN
```

## `SemVer`

Schema `semverSchema`. A string on both sides. A
Semantic Versioning 2.0.0 version, read with the regular expression semver.org
gives. Accepts `1.2.3`, `0.0.0`, `10.20.30` and `1.0.0-rc.1+build.5`; refuses
the `v` prefix (`v1.2.3`), a missing part (`1.2`), a leading zero (`01.2.3`,
`1.2.3-01`), an empty pre-release or build (`1.2.3-`, `1.2.3+`) and a space.

```ts
import { semverSchema } from '@nxgt/zod';

semverSchema.parse('1.0.0-rc.1+build.5');
semverSchema.parse('v1.2.3');
// throws ZodError: Invalid semantic version
```

## In a schema
