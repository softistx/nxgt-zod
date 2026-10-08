import { describe } from 'bun:test';
import { schemaCases } from '../../../test/schema-cases';
import { sha512Schema } from './sha512';

describe('SHA512', () => {
	schemaCases('SHA512', sha512Schema, {
		accepted: ['a'.repeat(128), 'F'.repeat(128), 'aF'.repeat(64)],
		refused: ['a'.repeat(127), 'a'.repeat(129), 'a'.repeat(64), ''],
	});
});
