# @nxgt/zod

## 0.2.0

### Minor Changes

- [#16](https://github.com/softistx/nxgt-zod/pull/16) [`c5e26e3`](https://github.com/softistx/nxgt-zod/commit/c5e26e3e0cbb72dc49aee71211b16b590d13a8a7) Thanks [@SteveGT96](https://github.com/SteveGT96)! - Export `ZOD_JITLESS` (from `@nxgt/zod/csp` and the root), the inline boot snippet that turns Zod's `jitless` mode on for every copy of Zod on a page under a CSP without `'unsafe-eval'`.

## 0.1.3

### Patch Changes

- [#10](https://github.com/softistx/nxgt-zod/pull/10) [`099b311`](https://github.com/softistx/nxgt-zod/commit/099b311f22eae354f4fc1c044a5ab0712ab931d4) Thanks [@SteveGT96](https://github.com/SteveGT96)! - Accept TypeScript 7 as a peer: `typescript` is now `^6.0.3 || ^7.0.0`.

## 0.1.2

### Patch Changes

- [#6](https://github.com/softistx/nxgt-zod/pull/6) [`adcb6a1`](https://github.com/softistx/nxgt-zod/commit/adcb6a1710c7fd6d1879ab146c94d02fa126e99b) Thanks [@SteveGT96](https://github.com/SteveGT96)! - The declaration files now import each other with a `.js` extension, so a project with `moduleResolution: "nodenext"` (or `node16`) sees every export: `import { scalarSchemas } from '@nxgt/zod'` failed there with TS2305.

## 0.1.1

### Patch Changes

- [#4](https://github.com/softistx/nxgt-zod/pull/4) [`dbbf7c0`](https://github.com/softistx/nxgt-zod/commit/dbbf7c0af6e3fdabffd006bd047e11fdf1b90ec1) Thanks [@SteveGT96](https://github.com/SteveGT96)! - The roadmap records 0.1.0 as shipped.

## 0.1.0

### Minor Changes

- [`8259fb8`](https://github.com/softistx/nxgt-zod/commit/8259fb8719d32ec9ea19df5be8d5de1defe6d0ec) - First release: the scalar schemas
