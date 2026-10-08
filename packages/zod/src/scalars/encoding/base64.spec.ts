import { describe } from 'bun:test';
import { schemaCases } from '../../../test/schema-cases';
import { base64Schema } from './base64';

describe('Base64', () => {
	schemaCases('Base64', base64Schema, {
		accepted: ['', 'YQ==', 'aGk=', 'aGVsbG8=', 'a+b/'],
		refused: ['aGl=', 'YR==', 'aGk', 'aGk==', 'a-b_', 'aG k=', 'aGk=\n', 1],
	});
});
