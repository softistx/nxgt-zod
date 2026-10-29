// The root re-exports the scalar schemas for now: `@nxgt/zod` and
// `@nxgt/zod/scalars` are the same names. Later areas (an error map, messages)
// get their own subpath, and the root keeps what a consumer reaches for first.
// `ZOD_JITLESS` is the boot snippet of `@nxgt/zod/csp`.
export * from './csp';
export * from './scalars';
