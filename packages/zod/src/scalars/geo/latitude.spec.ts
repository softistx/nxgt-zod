import { describe } from 'bun:test';
import { schemaCases } from '../../../test/schema-cases';
import { latitudeSchema } from './latitude';

describe('Latitude', () => {
	schemaCases('Latitude', latitudeSchema, {
		accepted: [0, -0, 48.8566, -90, 90, -0.5],
		refused: [
			90.000001,
			-90.5,
			Number.NaN,
			Number.POSITIVE_INFINITY,
			'48.8566',
			null,
		],
	});
});
