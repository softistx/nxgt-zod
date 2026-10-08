# Schemas

The schemas of the package, grouped by category. Each page below gives the exact
rule of each schema, what it accepts and what it refuses.

## The smallest example

```ts
import { z } from 'zod';
import { uuidv7Schema } from '@nxgt/zod';

const Order = z.object({ id: uuidv7Schema, note: z.string() });

Order.parse({ id: '018f2e3a-7b1c-7d2e-8f3a-1b2c3d4e5f60', note: 'x' });
```

## Every schema

A format `X` is exported as `xSchema`, and that schema is also `schemas.x`.
The categories, one page each:
- [Color](scalars/color.md)
- [Date and time](scalars/date-time.md)
- [Encoding](scalars/encoding.md)
- [Finance](scalars/finance.md)
- [Geo](scalars/geo.md)
- [Identifier](scalars/identifier.md)
- [Locale](scalars/locale.md)
- [Network](scalars/network.md)
- [Number](scalars/number.md)
- [String](scalars/string.md)
- [Value](scalars/value.md)

Most schemas only validate: what they accept comes back unchanged, as a
string or a number. A value is checked, never normalised. Four are codecs:

| Schema | Wire value | Decoded value |
| --- | --- | --- |
| `dateTimeSchema` | RFC 3339 string | `Date` |
| `timestampSchema` | milliseconds | `Date` |
| `longSchema` | decimal string | `bigint` |
| `bigIntSchema` | decimal string | `bigint` |

`schema.parse` and `z.decode` give the decoded value; `z.encode` writes the
wire value back, checked as strictly.

## Keyed by GraphQL name

`scalarSchemas` holds the schema behind each format under the exact GraphQL
scalar name, which is what a code generator reads. Each entry is exactly the
type of its schema, never `z.ZodType`, and the keys are in code-unit order
(`HSLA` before `HSL`, `IBAN` before `IP`).

```ts
import { scalarSchemas, type ScalarName } from '@nxgt/zod';

const name: ScalarName = 'IBAN';
scalarSchemas[name].parse('FR1420041010050500013M02606');
```

`schemas` holds the same schemas under the export name without `Schema`
(`schemas.dateTime`), ordered by the `...Schema` names.

## Adding a schema

A schema is a file `src/scalars/<category>/<name>.ts` exporting two things: the
schema `<name>Schema` and `<name>Name`, its GraphQL name. Its spec sits beside
it, its category's `index.ts` gets one line, and its category's page gets a
``## `Name` `` section. `registry.spec.ts` fails when any of these is missing;
nothing is listed by hand elsewhere.
