# Number schemas

The `number` category of `@nxgt/zod`. Each schema is `<name>Schema`, named after the format's
GraphQL scalar name; the [schemas guide](../scalars.md) covers what they share.

Integers of 32 bits (as GraphQL's `Int`, which these names follow), finite floats, then the integers
beyond 32 bits. A float refuses `NaN` and `Infinity`.

A number outside a scalar's range is refused with Zod's own message, which
names the bound and never the value: `Too small: expected number to be >0`,
`Too big: expected number to be <=2147483647`. The bound is written in each
section below; [Troubleshooting](../../troubleshooting.md) lists them.

Every integer schema here (`PositiveInt`, `NegativeInt`, `NonNegativeInt`,
`NonPositiveInt`, `SafeInt`, `Port`, `Long`, `BigInt`) refuses `-0`
(`Invalid integer: write -0 as 0`; `PositiveInt` and `NegativeInt` refuse it by
their bound). `1.0` is the number 1 in JavaScript and is accepted.

## `PositiveInt`

Schema `positiveIntSchema`. A number on both
sides. Accepts `1` and `2147483647`; refuses `0`, `-1`, `1.5`, `2147483648`
and `"1"`.

An integer from 1 to 2147483647. GraphQL's own `Int` is 32 bits, so this one
is too: a larger number could not be written by a client that follows the spec.

```ts
import { positiveIntSchema } from '@nxgt/zod';

positiveIntSchema.parse(2147483648);
// throws ZodError: Too big: expected number to be <=2147483647
```

The Int variants and the floats share one shape; each refuses the edge of its
own range:

```ts
import { negativeFloatSchema, negativeIntSchema, nonNegativeFloatSchema, nonNegativeIntSchema, nonPositiveFloatSchema, nonPositiveIntSchema, positiveFloatSchema } from '@nxgt/zod';

nonNegativeIntSchema.parse(0); // 0
nonNegativeIntSchema.parse(-1);
// throws ZodError: Too small: expected number to be >=0
negativeIntSchema.parse(0);
// throws ZodError: Too big: expected number to be <0
nonPositiveIntSchema.parse(1);
// throws ZodError: Too big: expected number to be <=0

nonNegativeFloatSchema.parse(1.5); // 1.5
positiveFloatSchema.parse(0);
// throws ZodError: Too small: expected number to be >0
negativeFloatSchema.parse(0);
// throws ZodError: Too big: expected number to be <0
nonPositiveFloatSchema.parse(0.5);
// throws ZodError: Too big: expected number to be <=0
positiveFloatSchema.parse(Number.POSITIVE_INFINITY);
// throws ZodError: Invalid input: expected number, received Infinity
```

## `NegativeInt`

Schema `negativeIntSchema`. A number on both
sides. An integer from -2147483648 to -1; refuses `0` and `1`.

## `NonNegativeInt`

Schema `nonNegativeIntSchema`. A number on both
sides. An integer from 0 to 2147483647; refuses `-1`.

## `NonPositiveInt`

Schema `nonPositiveIntSchema`. A number on both
sides. An integer from -2147483648 to 0; refuses `1`.

## `PositiveFloat`

Schema `positiveFloatSchema`. A number on both
sides. A finite number above 0: accepts `0.5`; refuses `0`, `-0.5`, `NaN` and
`Infinity`.

## `NegativeFloat`

Schema `negativeFloatSchema`. A number on both
sides. A finite number below 0: accepts `-0.5`; refuses `0`.

## `NonNegativeFloat`

Schema `nonNegativeFloatSchema`. A number on
both sides. A finite number, 0 or above: accepts `0` and `1.5`; refuses `-0.5`.

## `NonPositiveFloat`

Schema `nonPositiveFloatSchema`. A number on
both sides. A finite number, 0 or below: accepts `0` and `-1.5`; refuses `0.5`.

## `SafeInt`

Schema `safeIntSchema`. A number on both sides.
Accepts `-9007199254740991` and `9007199254740991`; refuses `9007199254740992`
and `1.5`.

An integer JavaScript holds exactly, ±(2^53 - 1). It is beyond 32 bits, so it
is not GraphQL's `Int`: a client's own
`Int` handling (generated types, for one) may not hold it. Past 2^53 use
`Long` or `BigInt`.

```ts
import { safeIntSchema } from '@nxgt/zod';

safeIntSchema.parse(9007199254740992);
// throws ZodError: Too big: expected int to be <=9007199254740991
```

## `Port`

Schema `portSchema`. A number on both sides. A TCP or UDP
port, 0 to 65535; refuses `-1`, `65536` and `80.5`.

```ts
import { portSchema } from '@nxgt/zod';

portSchema.parse(65536);
// throws ZodError: Too big: expected number to be <=65535
```

## `Long`

Schema `longSchema`. A `bigint` once decoded, a decimal
string on the wire. A signed 64-bit integer, -9223372036854775808 to
9223372036854775807.

JSON numbers past 2^53 lose precision in most clients, so the way **out** is
always a string, whatever the size. The way in accepts a canonical decimal
string (no leading zero, no `-0`, no `+`, no spaces) or a safe-integer number.
A `bigint` is not a wire value: `longSchema.parse(5n)` is refused; pass `'5'`.

```ts
import { z } from 'zod';
import { longSchema } from '@nxgt/zod';

longSchema.parse('9223372036854775807'); // 9223372036854775807n
longSchema.parse(42); // 42n
z.encode(longSchema, -9223372036854775808n); // '-9223372036854775808'

longSchema.parse('007');
// throws ZodError: Invalid integer: no leading zero and no "-0"
longSchema.parse(1.5);
// throws ZodError: Invalid integer: expected a decimal string or a safe integer
longSchema.parse(2 ** 60);
// throws ZodError: Invalid integer: past 2^53, write it as a string
longSchema.parse('9223372036854775808');
// throws ZodError: Too big: expected bigint to be <=9223372036854775807
```

`z.encode` takes a `bigint`; a `number` is refused
(`BigInt(row.count)` fixes it, see [Troubleshooting](../../troubleshooting.md)).
A number past 2^53 is refused, not rounded: write it as a string,
`"9223372036854775807"`.

## `BigInt`

Schema `bigIntSchema`. The same as `Long` with no
range: an integer of any size, a `bigint` once decoded and a decimal string on
the wire.

```ts
import { z } from 'zod';
import { bigIntSchema } from '@nxgt/zod';

bigIntSchema.parse('123456789012345678901234567890'); // a bigint
z.encode(bigIntSchema, 2n ** 80n); // '1208925819614629174706176'
```
