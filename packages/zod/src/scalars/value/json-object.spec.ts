import { describe } from 'bun:test';
import { schemaCases } from '../../../test/schema-cases';
import { jsonObjectSchema } from './json-object';

describe('JSONObject', () => {
	schemaCases('JSONObject', jsonObjectSchema, {
		accepted: [{}, { a: 1 }, { a: { b: [null] } }, Object.create(null)],
		refused: [
			null,
			[],
			[{}],
			'text',
			1,
			true,
			new Date(0),
			new Map(),
			{ a: undefined },
			{ a: Number.NaN },
			{ a: -0 },
			undefined,
		],
	});
});
