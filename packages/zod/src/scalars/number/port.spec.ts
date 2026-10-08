import { describe } from 'bun:test';
import { integerCases, schemaCases } from '../../../test/schema-cases';
import { portSchema } from './port';

describe('Port', () => {
	integerCases('Port', portSchema);

	schemaCases('Port', portSchema, {
		accepted: [0, 80, 65535],
		refused: [-1, 65536, 80.5, '80'],
	});
});
