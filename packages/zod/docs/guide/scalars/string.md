# String schemas

The `string` category of `@nxgt/zod`. Each schema is `<name>Schema`, named after the format's
GraphQL scalar name; the [schemas guide](../scalars.md) covers what they share.

## `NonEmptyString`

Schema `nonEmptyStringSchema`. A string on both
sides. Accepts `a` and ` a `; refuses `""`, `"   "` and `"\n\t"`.

A string with at least one non-white-space character; `" a "` is kept as it
is, not trimmed. "White space" is JavaScript's `\s`: a no-break space
(U+00A0) is white space and refused, while a zero-width space (U+200B) is not
and is taken.

```ts
import { nonEmptyStringSchema } from '@nxgt/zod';

nonEmptyStringSchema.parse(' a '); // ' a ', not trimmed
nonEmptyStringSchema.parse('\u00a0');
// throws ZodError: Invalid string: empty or only white space
```

## `Emoji`

Schema `emojiSchema`. A string on both sides. Accepts
`😀`, `👍🏽`, `👨‍👩‍👧`, `🇫🇷`, `1️⃣` and `❤️`; refuses `😀😀`, `🇫🇷🇩🇪`, `a`, `😀a`,
`" 😀"`, `""`, a lone zero-width joiner, variation selector, skin tone (`🏻`)
or keycap mark (U+20E3), a joiner at the end, a doubled variation selector or
skin tone, a lone regional indicator (`🇫`: a flag is a pair) and anything
longer than 32 code points.

Exactly one emoji, as one user-perceived character. A skin tone, a ZWJ
sequence, a flag and a keycap each count as one. The typical use is a reaction:

Zod's `z.emoji()` checks that every code point belongs to an emoji and
`Intl.Segmenter` that they make one character. The runtime's Unicode data
decides, so a sequence newer than it may count as two and be refused with
`Invalid emoji: expected exactly one`. Measured on Unicode's emoji list 18.0
(5,235 sequences), none is refused on Bun or on Node.

`Emoji` needs `Intl.Segmenter`: Node, Bun, Safari 14.1 and Firefox 125 have
it. It is built on first use, so on a runtime without it only `Emoji` fails,
with a `TypeError` from `parse`; the other schemas work. See
[Troubleshooting](../../troubleshooting.md).
