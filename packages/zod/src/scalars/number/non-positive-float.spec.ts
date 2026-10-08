import { describe } from 'bun:test';
import { schemaCases } from '../../../test/schema-cases';
import { nonPositiveFloatSchema } from './non-positive-float';

describe('NonPositiveFloat', () => {
	schemaCases('NonPositiveFloat', nonPositiveFloatSchema, {
		accepted: [0, -0.5, -1],
		refused: [0.5, Number.NEGATIVE_INFINITY, Number.NaN, '0'],
	});
});
