import { describe } from 'bun:test';
import { integerCases, schemaCases } from '../../../test/schema-cases';
import { positiveIntSchema } from './positive-int';

describe('PositiveInt', () => {
	integerCases('PositiveInt', positiveIntSchema);

	schemaCases('PositiveInt', positiveIntSchema, {
		accepted: [1, 2147483647],
		refused: [0, -1, 1.5, 2147483648, '1'],
	});
});
