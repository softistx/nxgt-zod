import type { z } from 'zod';
import * as all from './all';

export * from './all';

type All = typeof all;

/** The export of a scalar file that holds its GraphQL name: `ibanName`. */
type NameExport = Extract<keyof All, `${string}Name`>;

/** The schema beside a name export: `ibanName` goes with `ibanSchema`. */
type SchemaOf<K extends NameExport> = K extends `${infer Base}Name`
	? `${Base}Schema` extends keyof All
		? All[`${Base}Schema`]
		: never
	: never;

/**
 * The schema behind each scalar, keyed by its GraphQL name, each entry
 * exactly the schema's own type: `ScalarSchemas['DateTime']` is
 * `typeof dateTimeSchema`, never `z.ZodType`. Derived from what `./all`
 * exports, so a new scalar is registered by its category's `index.ts` alone.
 */
export type ScalarSchemas = {
	[K in NameExport as All[K] extends string ? All[K] : never]: SchemaOf<K>;
};

/** The GraphQL name of one of the scalars: the keys of {@link scalarSchemas}. */
export type ScalarName = keyof ScalarSchemas;

/**
 * The schema behind each scalar, keyed by its export name without `Schema`:
 * `dateTimeSchema` is `schemas.dateTime`.
 */
export type Schemas = {
	[K in keyof All as K extends `${infer Base}Schema`
		? All[K] extends z.ZodType
			? Base
			: never
		: never]: All[K];
};

/** Code-unit order, which is what `Array#sort` does with no comparator. */
function byKey<T>([a]: [string, T], [b]: [string, T]): number {
	return a < b ? -1 : a > b ? 1 : 0;
}

const exported = Object.entries(all) as [string, unknown][];

/**
 * The schema behind each scalar, keyed by its exact GraphQL name, in the
 * code-unit order of `<Name>Scalar`, the export of @nxgt/graphql-scalars the
 * same record is ordered by (`HSLA` before `HSL`, since `HSLAScalar` sorts
 * before `HSLScalar`; `IBAN` before `IP`). Each file of a
 * scalar exports its name beside its schema, and this record is built from
 * those, so a scalar nobody listed cannot be forgotten. A code generator
 * reads it by name.
 */
export const scalarSchemas = Object.fromEntries(
	exported
		.filter(([key]) => key.endsWith('Name'))
		.map(([key, name]): [string, unknown] => {
			const schemaKey = `${key.slice(0, -'Name'.length)}Schema`;
			if (!Object.hasOwn(all, schemaKey)) {
				throw new TypeError(`${key} has no ${schemaKey} beside it`);
			}
			return [name as string, (all as Record<string, unknown>)[schemaKey]];
		})
		.sort(([a], [b]) => byKey([`${a}Scalar`, null], [`${b}Scalar`, null])),
) as ScalarSchemas;

/**
 * The same schemas keyed by their export name without `Schema`:
 * `schemas.dateTime` is `dateTimeSchema`. Ordered by the `…Schema` names.
 */
export const schemas = Object.fromEntries(
	exported
		.filter(([key]) => key.endsWith('Schema'))
		.sort(byKey)
		.map(([key, schema]): [string, unknown] => [
			key.slice(0, -'Schema'.length),
			schema,
		]),
) as Schemas;
