---
"@nxgt/zod": patch
---

The declaration files now import each other with a `.js` extension, so a project with `moduleResolution: "nodenext"` (or `node16`) sees every export: `import { scalarSchemas } from '@nxgt/zod'` failed there with TS2305.
