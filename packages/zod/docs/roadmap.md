# Roadmap

Where `@nxgt/zod` is going. A direction, not a commitment: the version an item
shipped in is the only number on this page. Items under Next and Later are
candidates, not promises.

## Now

Nothing queued.

## Next

Nothing queued.

## Later

- **An error map** (candidate) — one Zod error map for the whole package.
- **User-friendly messages** (candidate) — messages written for the person who
  typed the value, beside the technical ones the schemas carry now.
- **i18n** (candidate) — those messages in several languages.
- **Load only the schemas you import** (candidate) — importing any schema loads
  them all, because the scalars namespace is one object. Per-category entry
  points stay a candidate if a consumer needs them.

## Not planned

- **A `Date` that decodes to a JavaScript `Date`** — a calendar date is not an
  instant, and the conversion moves a birthday by a day in some time zones.
- **A `DateTime` without an offset** — it names no instant.

## Shipped

### 0.2.0

- **`ZOD_JITLESS` for pages under a strict CSP** — an inline boot snippet,
  exported from `@nxgt/zod/csp` and the root, that turns Zod's `jitless` mode
  on for every copy of Zod on the page, so no `unsafe-eval` violation is
  reported.

### 0.1.2

- **Declarations resolve under `nodenext`** — `moduleResolution` `nodenext` and
  `node16` find every export, as `bundler` does.

### 0.1.0

- **The scalar schemas** — 65 schemas with the rules of
  `@nxgt/graphql-scalars`, `scalarSchemas` keyed by GraphQL name, and
  `schemas`.
