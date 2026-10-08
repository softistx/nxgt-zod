import { describe } from 'bun:test';
import { schemaCases } from '../../../test/schema-cases';
import { voidSchema } from './void';

describe('Void', () => {
	schemaCases('Void', voidSchema, {
		accepted: [null],
		refused: [undefined, 0, '', false, {}, 'null'],
	});
});
