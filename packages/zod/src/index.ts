// The root re-exports the scalar schemas for now: `@nxgt/zod` and
// `@nxgt/zod/scalars` are the same names. Later areas (an error map, messages)
// get their own subpath, and the root keeps what a consumer reaches for first.
export * from './scalars';
