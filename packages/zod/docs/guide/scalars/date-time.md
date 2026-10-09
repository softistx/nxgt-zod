# Date and time schemas

The `date-time` category of `@nxgt/zod`. Each schema is `<name>Schema`, named after the format's
GraphQL scalar name; the [schemas guide](../scalars.md) covers what they share.

## Which one?

| You have | Use | Wire value | Decoded value |
| --- | --- | --- | --- |
| an instant, as text with an offset | `DateTime` | `2024-03-10T10:00:00Z` | `Date` |
| an instant, as a number | `Timestamp` | `1710065730000` | `Date` |
| a calendar date | `Date` | `2024-03-10` | string |
| a wall-clock time, no offset | `LocalTime` | `10:15` | string |
| a wall-clock date and time, no offset | `LocalDateTime` | `2024-03-10T10:15:30` | string |
| a time of day with its offset | `Time` | `10:15:30+02:00` | string |
| an amount of time | `Duration` | `P1DT2H` | string |
| a place on the clock | `TimeZone` | `Europe/Paris` | string |
| a fixed offset from UTC | `UtcOffset` | `+05:30` | string |

## `DateTime`

Schema `dateTimeSchema`. Wire value a string,
decoded value a `Date`. Accepts `2024-03-10T12:00:00+02:00` and
`2024-03-10T10:00:00Z`; refuses a time with no offset, an impossible day,
`2024-03-10`, the offset `-00:00` and an instant outside year 0000 to 9999.

An RFC 3339 date-time **with its offset** (`Z` or `±hh:mm`). A time without an
offset names no instant, so it is refused, and so is `-00:00` (RFC 3339's
"local offset unknown"): send `Z` or `+00:00`. `parse` gives a `Date`; the
way out calls `toISOString()`, so the wire value is always UTC, to the
millisecond. A fraction is cut to three digits before it is read, the same in
every engine: `…00.123456789Z` comes back as `…00.123Z`. An instant outside
0000-01-01 to 9999-12-31 in UTC (`0000-01-01T00:00:00+01:00`, which is in year
-1) has no RFC 3339 form and is refused both ways.

```ts
import { z } from 'zod';
import { dateTimeSchema } from '@nxgt/zod';

const date = dateTimeSchema.parse('2024-03-10T12:00:00+02:00'); // Date
z.encode(dateTimeSchema, date); // '2024-03-10T10:00:00.000Z'

dateTimeSchema.parse('2024-03-10T12:00:00');
// throws ZodError: Invalid ISO datetime
dateTimeSchema.parse('2024-03-10T12:00:00-00:00');
// throws ZodError: Invalid offset: write no offset as +00:00
dateTimeSchema.parse('0000-01-01T00:00:00+01:00');
// throws ZodError: Invalid DateTime: outside 0000-01-01 to 9999-12-31 in UTC
```

`z.encode` takes a `Date` **only**. A value holding the string it read
from a database, without parsing it, is refused:

```ts
import { z } from 'zod';
import { dateTimeSchema } from '@nxgt/zod';

z.encode(dateTimeSchema, '2024-03-10T10:00:00.000Z');
// throws ZodError: Invalid input: expected date, received string

z.encode(dateTimeSchema, new Date('2024-03-10T10:00:00.000Z')); // fine
```

An invalid `Date` (`new Date(Number.NaN)`) is refused too.

## `Date`

Schema `dateSchema`. A string on both sides. Accepts
`2024-02-29`; refuses `2023-02-29`, `2024-2-1`, a date-time and a number.

A calendar date, `YYYY-MM-DD`. It is not a `Date`
because a `Date` is an instant: turning a birthday into one shifts it by a day
in half the time zones. An impossible day (`2021-02-30`) is refused. If you
need arithmetic, parse it yourself where the zone is known.

```ts
import { dateSchema } from '@nxgt/zod';

dateSchema.parse('2024-02-29'); // '2024-02-29'
dateSchema.parse('2023-02-29');
// throws ZodError: Invalid ISO date
```

## `Time`

Schema `timeSchema`. A string on both sides. Accepts
`10:15:30Z`, `10:15:30.5+02:00`; refuses `10:15:30` (no offset), `10:15Z` (no
seconds), `10:15:30z` (lower-case `z`), `24:00:00Z` and `10:15:60Z` (no leap
second).

An RFC 3339 `full-time`: seconds, an optional fraction, then `Z` or `±hh:mm`.
It stays a string and is kept as sent; it is not converted to UTC. `-00:00` is
refused, as for `DateTime`: write `+00:00` or `Z`.

```ts
import { timeSchema } from '@nxgt/zod';

timeSchema.parse('10:15:30+02:00'); // '10:15:30+02:00'
timeSchema.parse('10:15:30');
// throws ZodError: Invalid time: expected HH:MM:SS with an offset
timeSchema.parse('10:15:30-00:00');
// throws ZodError: Invalid offset: write no offset as +00:00
```

## `LocalTime`

Schema `localTimeSchema`. A string on both sides.
Accepts `10:15`, `10:15:30`, `10:15:30.5`; refuses `24:00`, and a time with
`Z` or an offset.

A time of day with no offset: it names no instant until a date and a place are
given. Use `Time` when the offset is part of the value.

```ts
import { localTimeSchema } from '@nxgt/zod';

localTimeSchema.parse('10:15'); // '10:15'
localTimeSchema.parse('10:15:30Z');
// throws ZodError: Invalid ISO time
```

## `LocalDateTime`

Schema `localDateTimeSchema`. A string on both
sides. Accepts `2024-03-10T10:15`, `2024-03-10T10:15:30`; refuses a `Z`, an
offset, a date alone, a space instead of `T` and an impossible day.

A date and a time on the wall clock, with no offset. It stays a string, not a
`Date`, because a `Date` is an instant. A `Z` is refused with its own message,
since `Z` would make it a `DateTime`.

```ts
import { localDateTimeSchema } from '@nxgt/zod';

localDateTimeSchema.parse('2024-03-10T10:15'); // '2024-03-10T10:15'
localDateTimeSchema.parse('2024-03-10T10:15:30Z');
// throws ZodError: Invalid local date-time: it has no offset, not even Z
localDateTimeSchema.parse('2024-03-10T10:15:30+02:00');
// throws ZodError: Invalid ISO datetime
```

## `Duration`

Schema `durationSchema`. A string on both sides.
Accepts `P1Y2M3DT4H5M6S`, `PT0.5S`, `P2W`; refuses `P1W2D` (weeks are not
mixed), `-P1D` (no sign), `p1d`, `P` and `PT`.

An ISO 8601 duration, kept as sent. It is not normalised: `PT90M` stays
`PT90M`.

```ts
import { durationSchema } from '@nxgt/zod';

durationSchema.parse('P1DT2H'); // 'P1DT2H'
durationSchema.parse('P1W2D');
// throws ZodError: Invalid ISO duration
```

## `UtcOffset`

Schema `utcOffsetSchema`. A string on both sides.
Accepts `+05:30`, `-12:00`, `+14:00`, `+00:00`; refuses `Z`, `-00:00`,
`+14:30`, `-12:30`, `+5:30` and `05:30`.

A fixed offset from UTC, `±hh:mm`, from `-12:00` to `+14:00`. It is not a
place: it knows nothing of daylight saving, use `TimeZone` for that. `-00:00`
is refused because no offset is written `+00:00`.

```ts
import { utcOffsetSchema } from '@nxgt/zod';

utcOffsetSchema.parse('+05:30'); // '+05:30'
utcOffsetSchema.parse('-00:00');
// throws ZodError: Invalid offset: write no offset as +00:00
utcOffsetSchema.parse('+14:30');
// throws ZodError: Invalid UTC offset: expected ±HH:MM from -12:00 to +14:00
```

## `TimeZone`

Schema `timeZoneSchema`, specified by <https://www.iana.org/time-zones>. A string on both sides. Accepts
`Europe/Paris`, `UTC`, and aliases such as `US/Pacific`; refuses `europe/paris`,
`Europe/PARIS`, `+05:30` and `Mars/Base`.

An IANA time zone name, as the runtime's `Intl` knows it, in its own case, kept
as sent. Four things to know:

- **Aliases pass.** `Asia/Kolkata` and `Asia/Calcutta` are both accepted.
- **Compare zones by resolving them, not as strings.** Runtimes disagree on
  which name is canonical: Node resolves `Asia/Kolkata` to `Asia/Calcutta`, Bun
  keeps it. Two strings can name one zone.
- **The runtime's data decides.** A zone newer than the tz data of the runtime
  is refused there.
- **Offsets are refused**, though `Intl` takes them. Use `UtcOffset`.

Known limit: the case is checked against the name the runtime resolves to.
Node rewrites some aliases to another name, and then only the shape of each
word can be checked: a miscasing whose words still look like IANA words
(`ASIA/Kolkata`, `ZULU`) gets through on Node and is refused on Bun. No real
IANA name is refused on either.

```ts
import { timeZoneSchema } from '@nxgt/zod';

timeZoneSchema.parse('Asia/Kolkata'); // 'Asia/Kolkata'
timeZoneSchema.parse('europe/paris');
// throws ZodError: Invalid time zone: expected an IANA name

// compare by resolving
const same = (a: string, b: string) =>
  new Intl.DateTimeFormat('en-US', { timeZone: a }).resolvedOptions().timeZone ===
  new Intl.DateTimeFormat('en-US', { timeZone: b }).resolvedOptions().timeZone;
same('Asia/Kolkata', 'Asia/Calcutta'); // true
```

## `Timestamp`

Schema `timestampSchema`. The wire value is an
integer number of milliseconds since 1970-01-01T00:00:00Z (negative before
1970); the decoded value is a `Date`. Accepts `0`, `1710065730000`, `-1` and
`±8640000000000000`; refuses `1.5`, `"1710065730000"` (a string), `-0`, a value
past ±8.64e15 and `true`.

It is past 2^31, so it is not GraphQL's `Int`. A float (`1.5`) is refused.
An invalid `Date` (`new Date(Number.NaN)`) is refused on the way out, and so is
anything but a `Date`.

```ts
import { z } from 'zod';
import { timestampSchema } from '@nxgt/zod';

const date = timestampSchema.parse(1710065730000); // Date
z.encode(timestampSchema, date); // 1710065730000

timestampSchema.parse(1.5);
// throws ZodError: Invalid input: expected int, received number
timestampSchema.parse(8640000000000001);
// throws ZodError: Too big: expected number to be <=8640000000000000
z.encode(timestampSchema, new Date(Number.NaN));
// throws ZodError: Invalid Date
```
