// An application's own schemas, behind exported values whose types are
// inferred: a declaration build must be able to name each one through
// `@nxgt/zod` and its peers alone (TS2883 otherwise), whether the consumer
// resolves as a bundler does or as Node does (TS2305 otherwise).
import { dateTimeSchema, ibanSchema, scalarSchemas, schemas } from '@nxgt/zod';
import { scalarSchemas as fromScalars } from '@nxgt/zod/scalars';
import { z } from 'zod';

export const user = z.object({
	iban: ibanSchema,
	since: dateTimeSchema,
	email: schemas.emailAddress,
});

export const generated = z.object({
	id: scalarSchemas.UUID,
	at: fromScalars.DateTime,
});
