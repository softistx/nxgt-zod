import { describe } from 'bun:test';
import { schemaCases } from '../../../test/schema-cases';
import { durationSchema } from './duration';

describe('Duration', () => {
	schemaCases('Duration', durationSchema, {
		accepted: [
			'PT0,5S',
			'P0D',
			'PT0S',
			'P1D',
			'PT2H',
			'P1Y2M3DT4H5M6S',
			'P2W',
			'PT0.5S',
		],
		refused: ['P', 'PT', 'P1W2D', 'P1.5D', '-P1D', 'P-1D', 'p1d', '1D', ''],
	});
});
