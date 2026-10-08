# Troubleshooting

One entry for each error you can hit, headed by the message you will search
for. The message is Zod's first issue (`result.error.issues[0].message`, or
the first line of a `ZodError`). For the built-in schemas the message never
contains the value.

- [Install](#install)
- [Parsing](#parsing)
- [Encoding](#encoding)
- [Runtimes](#runtimes)

## Install

### `TS2307: Cannot find module '@nxgt/zod'` (or its types)

**When:** type-checking an import of the package.
**Why:** the package is ESM with an `exports` map, which `moduleResolution`
`node`/`node10` ignores, and `nodenext` is not supported.
**Fix:**

```jsonc
{ "compilerOptions": { "moduleResolution": "bundler" } }
```

### Two copies of `zod`

**When:** an `instanceof z.ZodType` is `false`, or a schema of this package
does not compose with your own.
**Why:** `zod` is a peer (`>=4.6.5 <5`), so the package uses yours. Two
copies in `node_modules` are two sets of classes.
**Fix:** one `zod` in the tree; `bun pm ls zod` lists them.

## Parsing

### `<Issue>` from `schema.parse` or `safeParse`

**When:** a value fails a schema.
**Why:** the value is not what the schema accepts; the message says what.
**Fix:** send a valid value. Common issues, by the GraphQL name of the format:

| Schema | Message | Cause and fix |
| --- | --- | --- |
| `DateTime` | `Invalid ISO datetime` | no offset (`2024-03-10T12:00:00`), an impossible day, or a date alone; add `Z` or `±hh:mm` |
| `DateTime` | `Invalid input: expected string, received number` | an epoch number; send an RFC 3339 string |
| `DateTime` | `Invalid DateTime: outside 0000-01-01 to 9999-12-31 in UTC` | an instant before year 0000 or after year 9999 once the offset is applied (`0000-01-01T00:00:00+01:00`); the same message with `cannot serialize this value` for a `Date` outside that range |
| `Date` | `Invalid ISO date` | not `YYYY-MM-DD`, or an impossible day such as `2023-02-29`; a date-time is refused |
| `Time` | `Invalid time: expected HH:MM:SS with an offset` | no offset (`10:15:30`), no seconds (`10:15Z`), a lower-case `z`, hour 24 or second 60; send `10:15:30Z` or `10:15:30+02:00` |
| several | `Invalid offset: write no offset as +00:00` | `DateTime`, `Time` or `UtcOffset` given the offset `-00:00` (RFC 3339's "local offset unknown"); send `Z` or `+00:00` |
| `LocalTime` | `Invalid ISO time` | `24:00`, a `Z` or an offset (use `Time`), or not `HH:MM` / `HH:MM:SS` |
| `LocalDateTime` | `Invalid local date-time: it has no offset, not even Z` | a trailing `Z`; drop it, or use `DateTime` for an instant |
| `LocalDateTime` | `Invalid ISO datetime` | an offset (`+02:00`), a date alone, a space instead of `T`, or an impossible day |
| `Duration` | `Invalid ISO duration` | weeks mixed with other units (`P1W2D`), a sign (`-P1D`), lower case, or nothing after `P` or `T` |
| `UtcOffset` | `Invalid UTC offset: expected ±HH:MM from -12:00 to +14:00` | `Z`, a one-digit hour (`+5:30`), no sign, or outside -12:00 to +14:00 |
| `TimeZone` | `Invalid time zone: expected an IANA name` | a name the runtime's tz data does not know (a zone newer than it, or a typo), the wrong case (`europe/paris`), or an offset (`+05:30`; use `UtcOffset`) |
| `Timestamp` | `Invalid input: expected int, received number` | a fraction such as `1.5` |
| `Timestamp` | `Invalid input: expected number, received string` | `"1710065730000"` is a string; send the number |
| `Timestamp` | `Invalid integer: write -0 as 0` | `-0`; send `0` |
| `Timestamp` | `Invalid input: expected number, received boolean` | a boolean, or anything that is not a number |
| `Timestamp` | `Too big: expected number to be <=8640000000000000` | past what a `Date` holds; below -8.64e15 it says `Too small: expected number to be >=-8640000000000000` |
| `HexColorCode` | `Invalid hex color code` | no `#` (`ff0000`), a length other than 3, 4, 6 or 8 digits, a non-hex digit, or a space; send `#ff0000` |
| `RGB` | `Invalid RGB color: expected rgb(R, G, B), each 0 to 255` | a component above 255, a leading zero, a percentage, no space after the commas, the space-separated syntax, an alpha (use `RGBA`), or a fraction; send `rgb(255, 0, 0)` |
| `RGBA` | `Invalid RGBA color: expected rgba(R, G, B, A), each 0 to 255, A 0 to 1` | as `RGB`, or an alpha written `.5`, `1.0`, `0.50` or `50%`, above 1, or missing; send `0`, `1` or `0.5` |
| `HSL` | `Invalid HSL color: expected hsl(H, S%, L%), H 0 to 359, S and L 0 to 100` | a hue of 360 or more (write `0`), a `deg` unit, a saturation or lightness without `%` or above 100, a fraction, an alpha (use `HSLA`), or commas without spaces |
| `HSLA` | `Invalid HSLA color: expected hsla(H, S%, L%, A), H 0 to 359, S and L 0 to 100, A 0 to 1` | as `HSL`, or an alpha written `.5`, `1.0` or `50%`, above 1, or missing |
| `IBAN` | `Invalid IBAN` | a wrong check digit, lower case, or the printed form in groups of four (`FR14 2004 …`); strip the spaces and upper-case on the client |
| `IBAN` | `Invalid IBAN: unknown country, or not its length` | the check digits hold, but the country is not in the SWIFT IBAN registry or the IBAN is not its length (a German IBAN is 22 characters) |
| `Currency` | `Invalid currency: expected an ISO 4217 code in force` | lower case (`eur`), not three letters, an unknown code, or a withdrawn one (`FRF`, `HRK`, `SLL`); send `EUR` |
| `Latitude` | `Too big: expected number to be <=90` | past 90 degrees; below -90 it says `Too small: expected number to be >=-90`. A swapped pair (a GeoJSON `[longitude, latitude]` read as latitude first) lands here |
| `Longitude` | `Too big: expected number to be <=180` | past 180 degrees; below -180 it says `Too small: expected number to be >=-180` |
| `Latitude` | `Invalid input: expected number, received string` | `"48.8566"` or `48°51'N` is a string; send the number in decimal degrees (same for `Longitude`) |
| `CountryCode` | `Invalid country code: expected an ISO 3166-1 alpha-2 code` | lower case (`fr`), three letters (`FRA`), an unassigned code, or `UK` (use `GB`), `EU`, `SU`, `XK` |
| `Locale` | `Invalid locale: expected a canonical BCP 47 tag` | not canonical: `fr-fr`, `FR`, `en_US`, an extension in upper case or out of order (singletons ascending, `-u-` attributes then keywords sorted by key, `-t-` fields sorted); send `fr-FR`, `en-US` (an alias such as `en-UK` is kept as sent) |
| `Locale` | `Invalid locale: at most 255 characters` | a tag longer than 255 characters |
| `EmailAddress` | `Invalid email address` | not an email address: no `@`, a quoted local part, a domain with one label (`u@localhost`), a label that starts or ends with `-` or is past 63 characters, a domain past 253, or a last label that is not letters or `xn--` (`u@x.c0m`) |
| `URL` | `Invalid URL` | not absolute, or a scheme other than `http` and `https` (`javascript:`, `data:`, `mailto:`) |
| `URL` | `Invalid URL: no white space, control or invisible character` | a space, tab, line break, control or zero-width character anywhere, the path and query included, a leading or trailing space too (it is refused, not trimmed) |
| `URL` | `Invalid URL: write the scheme lowercase` | `HTTPS://x.com`; send `https://x.com` |
| `URL` | `Invalid URL: expected a host name, an IPv4 address or a bracketed IPv6 address, with no user info` | user info (`https://user:pass@x.com`), an empty host, `https://123`, `https://0x7f.1`, `https://a_b.com`, a `\` in the authority, or a Unicode host (send the punycode form, `https://xn--bcher-kva.example`) |
| `URL` | `Invalid URL: write the port as digits with no leading zero` | `https://x.com:080`, or nothing after the `:` |
| `IPv4` | `Invalid IPv4 address` | not a dotted quad: a part above 255, a leading zero (`01.2.3.4`), fewer than four parts, a `/prefix` (use `CIDRv4`), or an IPv6 |
| `IPv6` | `Invalid IPv6 address` | not an RFC 4291 text form: a zone (`fe80::1%eth0`), `:::`, a non-hex digit, or an IPv4 |
| `IP` | `Invalid IP address: expected IPv4 or IPv6` | neither an `IPv4` nor an `IPv6` value, such as a host name or `256.0.0.1` |
| `CIDRv4` | `Invalid IPv4 range` | no `/prefix`, a prefix above 32, or an address that is not an IPv4 |
| `CIDRv6` | `Invalid IPv6 range` | no `/prefix`, a prefix above 128, or an address that is not an IPv6 |
| `MAC` | `Invalid MAC address` | not six `:`-separated hex pairs, or `-` or `.` separators (any case is taken, mixed included, and kept as sent) |
| `Hostname` | `Invalid hostname` | an empty value, a space, an underscore, a label that starts or ends with `-`, a label of more than 63 characters, or a last label that is a number (`a.123`, `a.0x7f`: a URL parser reads it as an IPv4 address) |
| `PhoneNumber` | `Invalid E.164 number` | no leading `+`, a country code starting with 0, spaces or dashes, or more than 15 digits; send `+33612345678` |
| `Base64` | `Invalid base64` | not the canonical spelling: `YR==` decodes to the same byte as `YQ==`; send what an encoder produces |
| `Base64` | `Invalid base64-encoded string` | malformed: padding missing (`aGk`) or too long, a space or newline, or the URL-safe alphabet (`-`, `_`; use `Base64URL`) |
| `Base64URL` | `Invalid base64url` | not the canonical spelling: `YR` for `YQ` |
| `Base64URL` | `Invalid base64url-encoded string` | malformed: `=` padding, the standard alphabet (`+`, `/`; use `Base64`) or a space |
| `Hexadecimal` | `Invalid hexadecimal: expected at least one digit` | the empty string |
| `Hexadecimal` | `Invalid hex` | a `0x` prefix, a space or a non-hex digit |
| `JWT` | `Invalid JWT` | not three base64url parts, each in its one spelling (no padding, no unused bits set); a header or payload that is not a JSON object; an empty signature; or a header `alg` that is missing, not a string, empty, or `none` (an unsecured token): sign it |
| `SHA256` | `Invalid SHA-256 digest: expected 64 hexadecimal digits` | not 64 hexadecimal digits (a SHA-512 is 128) |
| `SHA512` | `Invalid SHA-512 digest: expected 128 hexadecimal digits` | not 128 hexadecimal digits (a SHA-256 is 64) |
| `UUID` | `Invalid UUID` | not the 8-4-4-4-12 form of a version 1 to 8 UUID with the RFC variant (the nil and max UUIDs are taken, in any case); use `GUID` for an id with no version or variant |
| `UUIDv4` | `Invalid UUID` | not a version 4 UUID: another version (a `v7`, a `v1`) or a wrong variant; use `UUID` to take any version |
| `UUIDv7` | `Invalid UUID` | not a version 7 UUID: another version or a wrong variant |
| `GUID` | `Invalid GUID` | not 8-4-4-4-12 hex digits: braces (`{…}`), no hyphens or a non-hex digit |
| `ULID` | `Invalid ULID` | not 26 Crockford base32 characters, a first character above 7, or an `I`, `L`, `O` or `U` |
| `Cuid2` | `Invalid cuid2` | not a lower-case letter then lower-case letters and digits, 2 to 32 in all: starts with a digit (`1abc`), a single character, upper case or a `-` |
| `NanoID` | `Invalid nanoid` | not 21 characters of `A-Za-z0-9_-` (a custom size or alphabet needs your own schema) |
| `KSUID` | `Invalid KSUID` | not 27 base62 characters, or past the 160-bit maximum `aWgEPTl1tmebfsQzFP4bxwgy80V` |
| `XID` | `Invalid XID` | not 20 lowercase base32hex characters (`0-9`, `a-v`), or a last character other than `0` or `g` |
| `ObjectID` | `Invalid ObjectID` | not 24 hex digits: a wrong length, a non-hex digit or a space around it |
| `ISBN` | `Invalid ISBN` | a wrong check digit, hyphens or spaces (`978-0-306-40615-7`), a lower-case `x`, an ISBN-13 not starting 978 or 979-1 to 979-9 (`979-0` is the ISMN), or a wrong length; send the bare digits |
| `SemVer` | `Invalid semantic version` | a `v` prefix, fewer than three parts, a leading zero (`01.2.3`) or an empty pre-release or build |
| `NonEmptyString` | `Invalid string: empty or only white space` | empty or only white space |
| `Emoji` | `Invalid emoji` | not an emoji: text, an empty string, a lone or trailing joiner (U+200D), a lone variation selector, skin tone, keycap mark or regional indicator, a doubled variation selector or skin tone |
| `Emoji` | `Invalid emoji: too long` | more than 32 code points; the longest emoji is 10 |
| `Emoji` | `Invalid emoji: expected exactly one` | more than one emoji (`😀😀`, two flags), or a sequence newer than the runtime's Unicode data, which it counts as two |
| `PositiveInt` | `Too small: expected number to be >0` | `0` or negative |
| `PositiveInt` | `Too big: expected number to be <=2147483647` | above 32 bits; `NegativeInt`, `NonNegativeInt` and `NonPositiveInt` say the same with their own bound (`>=0`, `<0`, `<=0`) |
| `PositiveInt` | `Invalid input: expected int, received number` | not an integer, such as `1.5` |
| `PositiveInt` | `Invalid input: expected number, received string` | `"1"` is a string; send `1` |
| `Port` | `Too big: expected number to be <=65535` | above 65535 |
| `Port` | `Too small: expected number to be >=0` | negative, such as `-1` |
| `Port` | `Invalid input: expected int, received number` | not an integer, such as `80.5` |
| several | `Invalid integer: write -0 as 0` | `-0` for an integer scalar (`NonNegativeInt`, `SafeInt`, `Port`, `Long`, …): send `0` |
| `SafeInt` | `Too big: expected int to be <=9007199254740991` | past 2^53; use `Long` or `BigInt` |
| `Long` | `Invalid integer: no leading zero and no "-0"` | a string such as `"007"`, `"-0"`, `"+1"` or `" 1"` |


### `Invalid integer: past 2^53, write it as a string`

**When:** a number past 2^53 is given to `longSchema` or `bigIntSchema`.
**Why:** a number that large may already have lost digits, so it is refused
rather than rounded. (`safeIntSchema` says `Too big: expected int to be
<=9007199254740991` for the same number.) A `Long` out of range written as a
string says `Too big: expected bigint to be <=9223372036854775807` instead.
**Fix:** send the value as a string.

### `Invalid integer: expected a decimal string or a safe integer`

**When:** `longSchema` or `bigIntSchema` is given something that is neither a
string nor an integer number: `1.5`, `true`, an object.
**Why:** the way in takes a canonical decimal string or a safe integer. A string
such as `"007"` says `Invalid integer: no leading zero and no "-0"` instead.
**Fix:** send a decimal string, or an integer number within 2^53.

### `Invalid JSON value`

**When:** `jsonSchema` is given something JSON cannot write back as it is: a
cycle, `undefined` (also as an object's field or an array's hole), a `Date`, a
`Map`, a class instance, `NaN`, `Infinity`, a `bigint`, `-0` (JSON writes it
`0`), or nesting past 1000 levels.
**Why:** the schema keeps the value as it is, so it refuses what would change
on the way (a `Date` becomes a string, `undefined` vanishes, `NaN` becomes
`null`).
**Fix:** convert first: `date.toISOString()`, `Object.fromEntries(map)`,
`String(bigint)`, `null` instead of `undefined`. See
[Value schemas](guide/scalars/value.md).

### `Invalid JSON object`

**When:** `jsonObjectSchema` is given something that is not a plain object whose
fields are all JSON values.
**Fix:** send an object (`{ "items": [1, 2] }` for a list), or use `jsonSchema`
for a value of any kind.

### `Invalid void: expected null`

**When:** `voidSchema` is given anything but `null`, `undefined` included.
**Fix:** pass `null`.

## Encoding

`z.encode(schema, value)` and `z.safeEncode` check a value as strictly as
`parse` does, on the way back to its wire form.

### `Invalid input: expected date, received string`

**When:** `z.encode(dateTimeSchema, text)` is given an ISO string.
**Why:** `dateTimeSchema` is a codec: it decodes text to a `Date` and encodes a
`Date` only. `timestampSchema` says `expected date, received number`.
**Fix:** `z.encode(dateTimeSchema, new Date(row.createdAt))`.

### `Invalid Date`

**When:** `z.encode` is given `new Date('nonsense')` for `dateTimeSchema` or
`timestampSchema`.
**Why:** `new Date(Number.NaN)` has no time, so it names no instant to write.
**Fix:** validate the source before building the `Date`.

### `Invalid DateTime: outside 0000-01-01 to 9999-12-31 in UTC`

**When:** a text decodes to, or a `Date` encodes from, an instant before year
0000 or after year 9999 (`0000-01-01T00:00:00+01:00`, `new Date(8.64e15)`).
**Why:** RFC 3339 writes a four-digit year, and `toISOString()` would write
`+275760-…` instead.
**Fix:** clamp or reject the value, or use `timestampSchema` for a date that
far out.

### `Invalid input: expected bigint, received number`

**When:** `z.encode(longSchema, count)` is given a `number`, such as a count
read from a database driver. `bigIntSchema` says the same.
**Why:** both decode to a `bigint`; a `number` past 2^53 may already have lost
digits, so it is not guessed at.
**Fix:** `z.encode(longSchema, BigInt(row.count))`.

## Runtimes

### A `TypeError` from `emojiSchema` about `Intl.Segmenter`

**When:** `emojiSchema.parse` on a runtime without `Intl.Segmenter` (Firefox
before 125, Safari before 14.1, Node without ICU).
**Why:** the segmenter is created on first use, not at import, so only
`emojiSchema` fails and every other schema works.
**Fix:** use a runtime that has it, or a different check for that field.

### `timeZoneSchema` or `localeSchema` behaves differently on Node and on Bun

**When:** a zone or a tag is accepted by one runtime and refused by the other.
**Why:** both lean on `Intl`, whose data differs between engines. Node turns
`Asia/Kolkata` into `Asia/Calcutta` where Bun keeps both, so `timeZoneSchema`
takes an alias under either name and refuses a mis-cased one (`asia/kolkata`)
by comparing the runtime's own spelling. The tags `localeSchema` takes are
checked for canonical form by the package, not left to the engine's idea of
canonical. The caches behind both are built on first use.
**Fix:** write the canonical form on the client (`Intl.getCanonicalLocales`
for a tag) and run the same engine in the server and the tests. See
[Locale schemas](guide/scalars/locale.md) and [Date and time
schemas](guide/scalars/date-time.md).
