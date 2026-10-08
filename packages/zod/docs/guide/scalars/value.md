# Value schemas

The `value` category of `@nxgt/zod`. Each schema is `<name>Schema`, named after the format's
GraphQL scalar name; the [schemas guide](../scalars.md) covers what they share.

These three are about the value itself, not a format: any JSON value, a JSON
object, and no value at all. `JSON` and `JSONObject` keep the value as it is,
a plain JavaScript value, kept as it is.

What JSON cannot write back as it is is refused, **both ways** (on the way in and on the
way out): a cycle, `undefined` (as an object's field or an array's
hole), a `Date`, a `Map`, a class instance, `NaN` or `Infinity`, `-0` (JSON
writes it `0`), a `bigint`, and nesting past 1000 levels. A plain object (`{}`
or `Object.create(null)`) and an array are walked; a shared, not cyclic, object
is fine.

| Refused | Say instead |
| --- | --- |
| a `Date` | `date.toISOString()` |
| a `Map` or a class instance | `Object.fromEntries(map)`, or the plain fields |
| a `bigint` | `String(n)`, or [`Long`](number.md) |
| `{ a: undefined }` | leave the key out, or use `null` |
| `NaN`, `Infinity` | `null`, or leave the key out |
| `-0` | `0` |

## Which one?

Use a typed schema (`z.object`) wherever the shape is known: the schema documents it
and the server refuses a bad field by name. `JSON` and
`JSONObject` are for a value the API does not own, such as a client's saved
view, a webhook payload to store as it came, or a feature flag's settings.

## `JSON`

Schema `jsonSchema`. Any JSON value on both sides:
`null`, a boolean, a string, a finite number, an array or a plain object of
them. Accepts `null`, `true`, `0`, `-1.5`, `'text'`, `[]`, `[1, 'a', null]`,
`{}` and `{ a: { b: [null, false] } }`; refuses `undefined`, `NaN`,
`Infinity`, `-0`, `1n`, a `Date`, a `Map`, a function, `{ a: undefined }`,
`[1, undefined]`, a cycle and a value nested past 1000 levels.

A shared, not cyclic, object is a JSON value: it is walked once per depth, not
once per use, so a deeply shared structure costs no more than its depth. An
array with a hole is refused at the first hole, however long it claims to be.

## `JSONObject`

Schema `jsonObjectSchema`. A plain object whose every
field is a JSON value, on both sides. Accepts `{}`, `{ a: 1 }`, `{ a: { b:
[null] } }` and `Object.create(null)`; refuses `null`, `[]`, `[{}]`, `'text'`,
`1`, `true`, a `Date`, a `Map`, `{ a: undefined }`, `{ a: Number.NaN }`, `{ a:
-0 }`, `undefined`, and everything `JSON` refuses.

## `Void`

Schema `voidSchema`. No value: for a field that only
acts, such as an operation with nothing to return. `null` is the one value
on both sides.

`null` is the only value either way; anything else, `undefined` included, is
refused.

```ts
import { z } from 'zod';
import { voidSchema } from '@nxgt/zod';

voidSchema.parse(null); // null
voidSchema.parse(0);
// throws ZodError: Invalid void: expected null
z.encode(voidSchema, 1);
// throws ZodError: Invalid void: expected null
```

Refused as well: `undefined`, `''`, `false`, `{}` and `'null'`.
