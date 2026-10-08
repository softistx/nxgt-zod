import { describe } from 'bun:test';
import { schemaCases } from '../../../test/schema-cases';
import { sha256Schema } from './sha256';

describe('SHA256', () => {
	schemaCases('SHA256', sha256Schema, {
		accepted: [
			'a'.repeat(64),
			'A'.repeat(64),
			'aB'.repeat(32),
			`${'0'.repeat(32)}${'f'.repeat(32)}`,
		],
		refused: [
			'a'.repeat(63),
			'a'.repeat(65),
			'g'.repeat(64),
			'a'.repeat(128),
			'',
		],
	});
});
