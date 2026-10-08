import { describe } from 'bun:test';
import { integerCases, schemaCases } from '../../../test/schema-cases';
import { safeIntSchema } from './safe-int';

describe('SafeInt', () => {
	integerCases('SafeInt', safeIntSchema);

	schemaCases('SafeInt', safeIntSchema, {
		accepted: [0, 2147483648, Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER],
		refused: [1.5, 2 ** 53, -(2 ** 53), Number.NaN, '1'],
	});
});
