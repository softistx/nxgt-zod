import { describe } from 'bun:test';
import { schemaCases } from '../../../test/schema-cases';
import { base64UrlSchema } from './base64-url';

describe('Base64URL', () => {
	schemaCases('Base64URL', base64UrlSchema, {
		accepted: ['', 'YQ', 'aGk', 'a-b_'],
		refused: ['aGl', 'A', 'aGVsb', 'YR', 'aGk=', 'a+b/', 'a b', 1],
	});
});
