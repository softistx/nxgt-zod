import { describe } from 'bun:test';
import { integerCases, schemaCases } from '../../../test/schema-cases';
import { nonNegativeIntSchema } from './non-negative-int';

describe('NonNegativeInt', () => {
	integerCases('NonNegativeInt', nonNegativeIntSchema);

	schemaCases('NonNegativeInt', nonNegativeIntSchema, {
		accepted: [0, 1, 2147483647],
		refused: [-1, 1.5, 2147483648, '0'],
	});
});
