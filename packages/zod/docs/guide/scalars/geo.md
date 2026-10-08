# Geo schemas

The `geo` category of `@nxgt/zod`. Each schema is `<name>Schema`, named after the format's
GraphQL scalar name; the [schemas guide](../scalars.md) covers what they share.

A point on Earth is two numbers in decimal degrees, as WGS 84 gives them.
Both schemas are numbers on both sides, finite, and refuse `NaN` and
`Infinity`. A string is refused, `"48.8566"` as well as degrees-minutes-seconds
(`48°51'N`): convert on the client.

## `Latitude`

Schema `latitudeSchema`. A number on both sides,
from -90 to 90 degrees. Accepts `0`, `48.8566`, `-0.5`, `90` and `-90`;
refuses `90.000001`, `-90.5`, `NaN`, `Infinity`, `"48.8566"` and `null`.

```ts
import { latitudeSchema } from '@nxgt/zod';

latitudeSchema.parse(48.8566); // 48.8566
latitudeSchema.parse(91);
// throws ZodError: Too big: expected number to be <=90
latitudeSchema.parse(-91);
// throws ZodError: Too small: expected number to be >=-90
latitudeSchema.parse('48.8566');
// throws ZodError: Invalid input: expected number, received string
```

## `Longitude`

Schema `longitudeSchema`. A number on both sides,
from -180 to 180 degrees. Accepts `0`, `2.3522`, `-0.5`, `180` and `-180`;
refuses `180.000001`, `-180.5`, `NaN`, `Infinity`, `"2.3522"` and `null`.

```ts
import { longitudeSchema } from '@nxgt/zod';

longitudeSchema.parse(2.3522); // 2.3522
longitudeSchema.parse(200);
// throws ZodError: Too big: expected number to be <=180
longitudeSchema.parse(-200);
// throws ZodError: Too small: expected number to be >=-180
```

## Order of a pair

The two schemas have the same shape and the types do not tell them apart in
TypeScript: both are `number`. The order is yours to keep. GeoJSON writes a
position as `[longitude, latitude]`, most maps APIs and everyday speech as
latitude then longitude. Name the fields rather than passing a tuple, and a
swapped pair of `Latitude` and `Longitude` is refused when the longitude is
beyond 90:

```ts
import { latitudeSchema } from '@nxgt/zod';

// a GeoJSON position, [longitude, latitude], read the wrong way round
const [a, b] = [151.2093, -33.8688]; // Sydney
latitudeSchema.parse(a);
// throws ZodError: Too big: expected number to be <=90
```
