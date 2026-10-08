import { describe } from 'bun:test';
import { schemaCases } from '../../../test/schema-cases';
import { nonEmptyStringSchema } from './non-empty-string';

describe('NonEmptyString', () => {
	schemaCases('NonEmptyString', nonEmptyStringSchema, {
		accepted: ['a', ' a ', '\u200b'],
		refused: ['', '   ', '\n\t', '\u00a0', '\ufeff', '\u3000', 1],
	});
});
