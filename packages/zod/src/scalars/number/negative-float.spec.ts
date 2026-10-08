import { describe } from 'bun:test';
import { schemaCases } from '../../../test/schema-cases';
import { negativeFloatSchema } from './negative-float';

describe('NegativeFloat', () => {
	schemaCases('NegativeFloat', negativeFloatSchema, {
		accepted: [-0.5, -1, -Number.MAX_VALUE],
		refused: [0, -0, 0.5, Number.NEGATIVE_INFINITY, Number.NaN, '-1'],
	});
});
