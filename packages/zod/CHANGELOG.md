# @nxgt/zod

## 0.1.2

### Patch Changes

- [#6](https://github.com/softistx/nxgt-zod/pull/6) [`adcb6a1`](https://github.com/softistx/nxgt-zod/commit/adcb6a1710c7fd6d1879ab146c94d02fa126e99b) Thanks [@SteveGT96](https://github.com/SteveGT96)! - The declaration files now import each other with a `.js` extension, so a project with `moduleResolution: "nodenext"` (or `node16`) sees every export: `import { scalarSchemas } from '@nxgt/zod'` failed there with TS2305.

## 0.1.1

### Patch Changes

- [#4](https://github.com/softistx/nxgt-zod/pull/4) [`dbbf7c0`](https://github.com/softistx/nxgt-zod/commit/dbbf7c0af6e3fdabffd006bd047e11fdf1b90ec1) Thanks [@SteveGT96](https://github.com/SteveGT96)! - The roadmap records 0.1.0 as shipped.

## 0.1.0

### Minor Changes

- [`8259fb8`](https://github.com/softistx/nxgt-zod/commit/8259fb8719d32ec9ea19df5be8d5de1defe6d0ec) - First release: the scalar schemas
