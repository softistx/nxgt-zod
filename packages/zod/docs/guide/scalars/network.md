# Network schemas

The `network` category of `@nxgt/zod`. Each schema is `<name>Schema`, named after the format's
GraphQL scalar name; the [schemas guide](../scalars.md) covers what they share.

## `IPv4`

Schema `ipv4Schema`. A string on both sides. Accepts
`192.168.0.1` and `255.255.255.255`; refuses `256.0.0.1`, `01.2.3.4` (a leading
zero), `1.2.3`, `1.2.3.4/8` (a prefix: use `CIDRv4`) and `::1`.

```ts
import { ipv4Schema } from '@nxgt/zod';

ipv4Schema.parse('192.168.0.1'); // '192.168.0.1'
ipv4Schema.parse('01.2.3.4');
// throws ZodError: Invalid IPv4 address
```

## `IPv6`

Schema `ipv6Schema`. A string on both sides. Accepts every
RFC 4291 text form: full (`2001:0db8:0000:0000:0000:0000:0000:0001`),
compressed (`::1`, `2001:db8::1`) and with an embedded IPv4
(`::ffff:192.0.2.1`). Refuses a zone (`fe80::1%eth0`), `:::` and an IPv4.

The value is returned as sent, never normalised: `2001:DB8::1` and
`2001:db8:0:0:0:0:0:1` are the same address and two different strings. To
compare addresses, parse them first (with `node:net` or an IP library).

```ts
import { ipv6Schema } from '@nxgt/zod';

ipv6Schema.parse('2001:DB8::1'); // '2001:DB8::1', case kept
ipv6Schema.parse('fe80::1%eth0');
// throws ZodError: Invalid IPv6 address
```

## `IP`

Schema `ipSchema`. A string on both sides. An address that
`IPv4` or `IPv6` accepts, with their rules: `192.168.0.1`, `::1` and
`2001:db8::1` pass; `256.0.0.1` and `example.com` do not. As for `IPv6`, the
value is not normalised.

```ts
import { ipSchema } from '@nxgt/zod';

ipSchema.parse('::1'); // '::1'
ipSchema.parse('example.com');
// throws ZodError: Invalid IP address: expected IPv4 or IPv6
```

## `CIDRv4`

Schema `cidrv4Schema`. A string on both sides: an IPv4
address, `/`, and a prefix length from 0 to 32. Accepts `10.0.0.0/8`,
`192.168.1.0/24` and `0.0.0.0/0`; refuses `10.0.0.0/33`, `10.0.0.0` (no prefix)
and `::/0`. The address need not be the first of the block: `10.0.0.5/8` is
accepted as sent.

```ts
import { cidrv4Schema } from '@nxgt/zod';

cidrv4Schema.parse('10.0.0.0/8'); // '10.0.0.0/8'
cidrv4Schema.parse('10.0.0.0/33');
// throws ZodError: Invalid IPv4 range
```

## `CIDRv6`

Schema `cidrv6Schema`. A string on both sides: an IPv6
address, `/`, and a prefix length from 0 to 128. Accepts `2001:db8::/32`,
`::/0` and `::1/128`; refuses `2001:db8::/129`, `2001:db8::` and `10.0.0.0/8`.
Like `IPv6`, the address is not normalised.

```ts
import { cidrv6Schema } from '@nxgt/zod';

cidrv6Schema.parse('2001:db8::/32'); // '2001:db8::/32'
cidrv6Schema.parse('2001:db8::/129');
// throws ZodError: Invalid IPv6 range
```

## `MAC`

Schema `macSchema`. A string on both sides: six hex pairs
separated by `:`, in any case. Accepts `00:1a:2b:3c:4d:5e`, `00:1A:2B:3C:4D:5E`
and a mixed `00:1a:2B:3c:4d:5e`; refuses `-` or `.` separators, five pairs and
the empty string. The case is kept as sent: the spellings of one address are
different strings, so lowercase them before comparing.

```ts
import { macSchema } from '@nxgt/zod';

macSchema.parse('00:1A:2B:3C:4D:5E'); // '00:1A:2B:3C:4D:5E'
macSchema.parse('00-1a-2b-3c-4d-5e');
// throws ZodError: Invalid MAC address
```

## `Hostname`

Schema `hostnameSchema`. A string on both sides:
dot-separated labels of letters, digits and hyphens (RFC 1123), none starting
or ending with a hyphen, each up to 63 characters and 253 in all. A trailing
dot is allowed (`example.com.`). The last label is not a number: not all digits
and not `0x` and hex digits, which a URL parser reads as an IPv4 address too. So
`1.2.3.4`, `example.123` and `a.0x7f` are not host names (RFC 1123, 2.1: use
`IP` for an address). A single label (`localhost`) and punycode
(`xn--bcher-kva.example`) are; a Unicode label (`bücher.example`) is not.
Accepts `example.com`, `api.example.com` and `localhost`; refuses
`-example.com`, `exa_mple.com`, `1.2.3.4`, a space, the empty string and a
label of 64 characters. It checks the syntax only; nothing is resolved.

```ts
import { hostnameSchema } from '@nxgt/zod';

hostnameSchema.parse('api.example.com.'); // 'api.example.com.'
hostnameSchema.parse('exa_mple.com');
// throws ZodError: Invalid hostname
```

## `PhoneNumber`

Schema `phoneNumberSchema`. A string on both sides,
in E.164 form: `+`, a country code that does not start with 0, and at most 15
digits in all, with no space or separator. Accepts `+33612345678` and
`+14155550123`; refuses `33612345678` (no `+`), `+0123456789`,
`+33 6 12 34 56 78`, a 16-digit number and the empty string. It checks the
shape, not that the number exists.

```ts
import { phoneNumberSchema } from '@nxgt/zod';

phoneNumberSchema.parse('+33612345678'); // '+33612345678'
phoneNumberSchema.parse('+33 6 12 34 56 78');
// throws ZodError: Invalid E.164 number
```

## `URL`

Schema `urlSchema`. A string on both sides. Accepts
`https://example.com/a?b=c`, `http://localhost:3000` and
`https://[2001:db8::1]/`; refuses `javascript:`, `data:`, `mailto:` and
`example.com`.

An absolute `http:` or `https:` URL, and nothing else. `javascript:` and
`data:` URLs are refused because a client is likely to put the value in an
`href`, which makes them a script-injection vector. On top of `z.url()`:

- the scheme is lowercase (`HTTPS://x.com` is refused);
- the host, as written, is a `Hostname`, a canonical IPv4 or a bracketed IPv6
  address. What only a URL parser reads as a host (`https://123`,
  `https://0x7f.1`, `https://a_b.com`) is refused, and so is an empty host. A
  Unicode host is refused too: send its punycode form
  (`https://xn--bcher-kva.example`);
- no user info (`https://user:pass@x.com`): credentials in an `href` leak;
- a port is digits with no leading zero, and not empty (`:080` and `:` are
  refused);
- no white space, control or invisible format character anywhere, the path and
  query included. Where `z.url()` alone would trim or drop them, the value is
  refused, both ways: `' https://x.com\n'` is an error, not `'https://x.com'`.

What a parser rewrites to an equivalent URL is kept as sent: an uppercase host,
a default port (`:443`), dot segments (`/a/../b`) and percent-escapes in the
path.

```ts
import { urlSchema } from '@nxgt/zod';

urlSchema.parse('https://example.com/a?b=c'); // fine
urlSchema.parse('https://EXAMPLE.COM:443/a/../b%2f'); // kept as sent
urlSchema.parse('javascript:alert(1)');
// throws ZodError: Invalid URL
urlSchema.parse('https://user:pass@example.com');
// throws ZodError: Invalid URL: expected a host name, an IPv4 address or a bracketed IPv6 address, with no user info
```

## `EmailAddress`

Schema `emailAddressSchema`. A string on both
sides. Accepts `ada@example.com` and `a.b+c@sub.example.org`; refuses `ada`,
`ada@` and `a b@example.com`.

The local part is `z.email()`'s (letters, digits, `_`, `'`, `+`, `-` and dots
between them; no quoted form). The domain follows `Hostname`'s rule, with at
least two labels and a last label of letters or `xn--`: `ada@x.xn--p1ai` is
accepted; `ada@localhost`, `ada@a-.com`, `ada@x.c0m`, a label past 63
characters and a domain past 253 are refused. Any case, kept as sent. Only the
shape is checked, not that the address receives mail.

```ts
import { emailAddressSchema } from '@nxgt/zod';

emailAddressSchema.parse('ada@example.com'); // 'ada@example.com'
emailAddressSchema.parse('ada@x.c0m');
// throws ZodError: Invalid email address
```
