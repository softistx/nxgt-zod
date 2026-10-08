# Finance schemas

The `finance` category of `@nxgt/zod`. Each schema is `<name>Schema`, named after the format's
GraphQL scalar name; the [schemas guide](../scalars.md) covers what they share.

## `IBAN`

Schema `ibanSchema`. A string on both sides: an
International Bank Account Number in its electronic form, uppercase, no spaces.
Accepts `FR1420041010050500013M02606`, `DE89370400440532013000`,
`GB82WEST12345698765432`, `NO9386011117947` and
`LC55HEMM000100010012001200023015`; refuses a wrong check digit
(`FR1420041010050500013M02607`), lower case, the printed form in groups of four,
a country not in the SWIFT IBAN registry (`XX…`), a length that is not the
country's (`DE41370400440532013` has valid check digits but is 19 characters,
where Germany's is 22), `""` and a number.

The check digits (ISO 13616, mod 97) are verified by `z.iban()`, and the
country and its length against a table of the SWIFT IBAN registry embedded in
the package, so a typo is caught before it reaches a bank. The printed form
is refused, not rewritten: strip the spaces and upper-case on the client.

```ts
import { ibanSchema } from '@nxgt/zod';

ibanSchema.parse('FR1420041010050500013M02606'); // 'FR1420041010050500013M02606'
ibanSchema.parse('FR14 2004 1010 0505 0001 3M02 606');
// throws ZodError: Invalid IBAN
ibanSchema.parse('FR1420041010050500013M02607');
// throws ZodError: Invalid IBAN
```

On the client, before sending what a user typed or pasted:

```ts
const iban = input.replace(/\s+/g, '').toUpperCase();
```

## `Currency`

Schema `currencySchema`. A string on both sides: an
ISO 4217 currency code in force, uppercase. Accepts `EUR`, `USD`, `JPY`,
`CHF`, `XAU`, `XXX`, `SLE` and `VES`; refuses `eur` and `Eur` (the case is
not rewritten), `EU`, `EURO`, `ZZZ` (not a code), ` EUR`, `""`, a number
(`978`) and the withdrawn codes `FRF`, `HRK` and `SLL`.

The list is Zod's. It holds the codes for funds, metals and testing (`XAU`,
`XTS`, `XXX`) as well as currencies, and drops a code once ISO withdraws it,
so a newer Zod 4 may know a code an older one refuses (and the other way
round for a withdrawn one).

```ts
import { currencySchema } from '@nxgt/zod';

currencySchema.parse('EUR'); // 'EUR'
currencySchema.parse('eur');
// throws ZodError: Invalid currency: expected an ISO 4217 code in force
currencySchema.parse('FRF');
// throws ZodError: Invalid currency: expected an ISO 4217 code in force
```

## With an amount

`Currency` names the unit, not the sum. There is no schema for a money amount
here. Do not send one as a `Float`: `0.1 + 0.2` is not `0.3`. Send an integer
of minor units (`1999` for 19.99 EUR, with the number of decimals of the
currency: none for `JPY`, three for `KWD`), or a decimal string (`"19.99"`),
and keep the two together:
