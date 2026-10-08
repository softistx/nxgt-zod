# @nxgt/zod

Shared Zod 4 building blocks for nxgt. First the scalar schemas: 65 formats
(IBAN, UUID, DateTime, IPv4, Long, JSON and more) with the exact rules
`@nxgt/graphql-scalars` applies, so a REST app validates the same way as a
GraphQL API without depending on `graphql`. Later: an error map,
user-friendly messages and i18n; see the [roadmap](docs/roadmap.md).

## Install

```sh
bun add @nxgt/zod zod
```

`zod` (`>=4.6.5 <5`) and `typescript` (`^6.0.3`) are peers. The package is ESM
and its `exports` map needs `"moduleResolution": "bundler"` in your
`tsconfig.json`; `node`/`node10` ignore the map, and `nodenext` is not
supported.

```jsonc
{ "compilerOptions": { "moduleResolution": "bundler" } }
```

## Quick start

```ts
import { z } from 'zod';
import { dateTimeSchema, ibanSchema, scalarSchemas } from '@nxgt/zod';

ibanSchema.parse('FR1420041010050500013M02606'); // fine
ibanSchema.safeParse('FR14 2004 1010 0505 0001 3M02 606').success; // false

// A codec: text on the wire, a Date once decoded.
const at: Date = z.decode(dateTimeSchema, '2024-03-10T12:00:00+02:00');
z.encode(dateTimeSchema, at); // '2024-03-10T10:00:00.000Z'

const User = z.object({ iban: ibanSchema, since: dateTimeSchema });

// Keyed by the exact GraphQL scalar name, for code generators.
scalarSchemas.IBAN === ibanSchema; // true
```

Both entry points give the same names for now:

| Import | Holds |
| --- | --- |
| `@nxgt/zod` | everything below, re-exported |
| `@nxgt/zod/scalars` | every scalar schema, `scalarSchemas`, `schemas`, `ScalarName` |

## What it exports

- `<name>Schema`, one per format: `ibanSchema`, `dateTimeSchema`,
  `uuidv7Schema`.
- `scalarSchemas`, keyed by the exact GraphQL name (`scalarSchemas.IBAN`), in
  code-unit order, each entry exactly the schema's own type.
- `schemas`, keyed by the export name without `Schema` (`schemas.dateTime`).
- `ScalarName`, the union of the keys of `scalarSchemas`.
- `<name>Name`, the GraphQL name beside each schema (`ibanName` is `'IBAN'`),
  which is what `scalarSchemas` is built from.

Refusals say `Invalid <format>[: hint]` and never name the value.
Four schemas are codecs: `dateTimeSchema` and `timestampSchema` decode to a
`Date`, `longSchema` and `bigIntSchema` to a `bigint`; use `z.decode` and
`z.encode` for the other direction. Read [the guide](docs/guide/scalars.md)
for the rules they share.

## Schemas by category

### Color

[Guide](docs/guide/scalars/color.md). `hexColorCodeSchema`, `hslSchema`, `hslaSchema`, `rgbSchema`, `rgbaSchema`

### Date and time

[Guide](docs/guide/scalars/date-time.md). `dateTimeSchema`, `dateSchema`, `durationSchema`, `localDateTimeSchema`, `localTimeSchema`, `timeZoneSchema`, `timeSchema`, `timestampSchema`, `utcOffsetSchema`

### Encoding

[Guide](docs/guide/scalars/encoding.md). `base64UrlSchema`, `base64Schema`, `hexadecimalSchema`, `jwtSchema`, `sha256Schema`, `sha512Schema`

### Finance

[Guide](docs/guide/scalars/finance.md). `currencySchema`, `ibanSchema`

### Geo

[Guide](docs/guide/scalars/geo.md). `latitudeSchema`, `longitudeSchema`

### Identifier

[Guide](docs/guide/scalars/identifier.md). `cuid2Schema`, `guidSchema`, `isbnSchema`, `ksuidSchema`, `nanoIdSchema`, `objectIdSchema`, `semverSchema`, `ulidSchema`, `uuidSchema`, `uuidv4Schema`, `uuidv7Schema`, `xidSchema`

### Locale

[Guide](docs/guide/scalars/locale.md). `countryCodeSchema`, `localeSchema`

### Network

[Guide](docs/guide/scalars/network.md). `cidrv4Schema`, `cidrv6Schema`, `emailAddressSchema`, `hostnameSchema`, `ipSchema`, `ipv4Schema`, `ipv6Schema`, `macSchema`, `phoneNumberSchema`, `urlSchema`

### Number

[Guide](docs/guide/scalars/number.md). `bigIntSchema`, `longSchema`, `negativeFloatSchema`, `negativeIntSchema`, `nonNegativeFloatSchema`, `nonNegativeIntSchema`, `nonPositiveFloatSchema`, `nonPositiveIntSchema`, `portSchema`, `positiveFloatSchema`, `positiveIntSchema`, `safeIntSchema`

### String

[Guide](docs/guide/scalars/string.md). `emojiSchema`, `nonEmptyStringSchema`

### Value

[Guide](docs/guide/scalars/value.md). `jsonObjectSchema`, `jsonSchema`, `voidSchema`

## More

- [Docs](docs/README.md)
- [Troubleshooting](docs/troubleshooting.md)
- [Roadmap](docs/roadmap.md)

MIT
