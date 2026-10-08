import { describe } from 'bun:test';
import { schemaCases } from '../../../test/schema-cases';
import { positiveFloatSchema } from './positive-float';

describe('PositiveFloat', () => {
	schemaCases('PositiveFloat', positiveFloatSchema, {
		accepted: [0.5, 1, Number.MAX_VALUE],
		refused: [0, -0, -0.5, Number.POSITIVE_INFINITY, Number.NaN, '1'],
	});
});
