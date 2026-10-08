import { describe } from 'bun:test';
import { schemaCases } from '../../../test/schema-cases';
import { nonNegativeFloatSchema } from './non-negative-float';

describe('NonNegativeFloat', () => {
	schemaCases('NonNegativeFloat', nonNegativeFloatSchema, {
		accepted: [0, 0.5, 1],
		refused: [-0.5, Number.POSITIVE_INFINITY, Number.NaN, '0'],
	});
});
