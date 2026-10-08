import { describe } from 'bun:test';
import { schemaCases } from '../../../test/schema-cases';
import { hexadecimalSchema } from './hexadecimal';

describe('Hexadecimal', () => {
	schemaCases('Hexadecimal', hexadecimalSchema, {
		accepted: ['0', 'ab', 'AB', 'aB', 'abc', 'deadbeef'],
		refused: ['', '0x1f', 'g', 'ab cd', 1],
	});
});
