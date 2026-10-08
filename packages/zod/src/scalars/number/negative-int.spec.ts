import { describe } from 'bun:test';
import { integerCases, schemaCases } from '../../../test/schema-cases';
import { negativeIntSchema } from './negative-int';

describe('NegativeInt', () => {
	integerCases('NegativeInt', negativeIntSchema);

	schemaCases('NegativeInt', negativeIntSchema, {
		accepted: [-1, -2147483648],
		refused: [0, 1, -1.5, -2147483649, '-1'],
	});
});
