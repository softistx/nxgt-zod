# nxgt-zod

Shared Zod 4 building blocks for nxgt, in one Bun workspace.

| Package | |
| --- | --- |
| [`@nxgt/zod`](packages/zod) | the scalar schemas (IBAN, UUID, DateTime, IP, Long, JSON and 60 more), the exact rules `@nxgt/graphql-scalars` applies, for an app that validates without `graphql`. Later: an error map, user-friendly messages and i18n. Not published yet |

Each package's README is its npm page.

## Development

Bun 1.4.2.

```sh
bun install
bun run build        # first: exports point at dist/
bun run typecheck
bun run test
bun run verify:artifacts
bun run check        # Biome
```

See [AGENTS.md](AGENTS.md) for the layout, the release flow and the
duplications that are deliberate.
