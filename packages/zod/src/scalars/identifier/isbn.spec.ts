import { describe } from 'bun:test';
import { schemaCases } from '../../../test/schema-cases';
import { isbnSchema } from './isbn';

describe('ISBN', () => {
	schemaCases('ISBN', isbnSchema, {
		accepted: ['0306406152', '080442957X', '9780306406157', '9791090636071'],
		refused: [
			'0306406153',
			'080442957x',
			'978-0-306-40615-7',
			'9780306406158',
			'9770306406158',
			'9770000000003',
			'9790000000001',
			'030640615',
			'',
		],
	});
});
