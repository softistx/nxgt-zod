# Locale schemas

The `locale` category of `@nxgt/zod`. Each schema is `<name>Schema`, named after the format's
GraphQL scalar name; the [schemas guide](../scalars.md) covers what they share.

## `CountryCode`

Schema `countryCodeSchema`. A string on both
sides: an ISO 3166-1 alpha-2 code, uppercase. Accepts `FR`, `US`, `GB`, `AX`
and `SS`; refuses `fr` and `Fr` (the case is not rewritten), `FRA`, `F`,
` FR`, `ZZ` (not assigned) and the four below.

The 249 officially assigned codes are embedded in the package, so the answer
does not depend on the runtime. `Intl`'s own list is not used: it also takes
codes that are no country code.

| Refused | Why |
| --- | --- |
| `UK` | reserved by ISO 3166 at the UK's request; the code of the United Kingdom is `GB` |
| `EU` | reserved, the European Union is not a country |
| `SU` | a former code (the Soviet Union) |
| `XK` | user-assigned, used for Kosovo but never an ISO code |

```ts
import { countryCodeSchema } from '@nxgt/zod';

countryCodeSchema.parse('FR'); // 'FR'
countryCodeSchema.parse('UK');
// throws ZodError: Invalid country code: expected an ISO 3166-1 alpha-2 code
```

## `Locale`

Schema `localeSchema`. A string on both sides: a
well-formed BCP 47 language tag in canonical case, at most 255 characters.
Accepts `fr`, `fr-FR`, `en-US`, `zh-Hant-TW`, `sr-Latn`, `es-419`,
`en-US-u-ca-buddhist` and `und`; refuses `fr-fr`, `FR`, `en_US`,
`zh-hant-tw`, `en-u-nu-latn-ca-buddhist` (extension keys out of order),
`i-klingon`, `x-foo`, `en-` and ` fr`.

- **The case is the canonical one**: the language lowercase, a script
  Titlecase, a region uppercase, the rest lowercase.
- **Extensions are in canonical order**, all lowercase: singletons ascending
  (`-t-` before `-u-`); in `-u-`, attributes first, then keywords sorted by key,
  each key once and never written `-true`; in `-t-`, fields sorted by key. `-x-`
  ends the order rules: what follows is private use, only required to be
  lowercase (`en-x-Foo` is refused).
  `en-u-nu-latn-ca-buddhist` is refused, `en-u-ca-buddhist-nu-latn` is taken.
- **An alias is taken, as sent**, in the language and in an extension's value
  too (`tl`, `iw`, `sh`, `en-UK`, `en-u-ca-islamicc`). JavaScript
  engines do not agree on which aliases to rewrite (V8 in Node and Chrome
  turns `tl` into `fil`; JavaScriptCore in Bun and Safari keeps it), so
  refusing them would make the answer depend on the runtime. This rule gives
  the same answer on all of them. Compare two tags by canonicalising both
  with `Intl.getCanonicalLocales`, not as strings.
- **Well-formed only**: the subtags are not checked against the IANA
  registry, so `xx` and `en-ZZ` pass. `CountryCode` is the schema for a real
  country.

A tag that is valid but written in another case is refused, not rewritten:
the value `parse` returns is the value that was sent. Canonicalise on
the client before sending:

```ts
import { localeSchema } from '@nxgt/zod';

localeSchema.parse('fr-FR'); // 'fr-FR'
localeSchema.parse('fr-fr');
// throws ZodError: Invalid locale: expected a canonical BCP 47 tag

// on the client
const [locale] = Intl.getCanonicalLocales('fr-fr'); // 'fr-FR'
// `en_US` is not a tag: write it `en-US` first
```
