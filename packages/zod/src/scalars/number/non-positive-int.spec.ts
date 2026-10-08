import { describe } from 'bun:test';
import { integerCases, schemaCases } from '../../../test/schema-cases';
import { nonPositiveIntSchema } from './non-positive-int';

describe('NonPositiveInt', () => {
	integerCases('NonPositiveInt', nonPositiveIntSchema);

	schemaCases('NonPositiveInt', nonPositiveIntSchema, {
		accepted: [0, -1, -2147483648],
		refused: [1, -1.5, -2147483649, '0'],
	});
});
