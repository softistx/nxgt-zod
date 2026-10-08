import { describe } from 'bun:test';
import { schemaCases } from '../../../test/schema-cases';
import { longitudeSchema } from './longitude';

describe('Longitude', () => {
	schemaCases('Longitude', longitudeSchema, {
		accepted: [0, -0, 2.3522, -180, 180, -0.5],
		refused: [
			180.000001,
			-180.5,
			Number.NaN,
			Number.POSITIVE_INFINITY,
			'48.8566',
			null,
		],
	});
});
