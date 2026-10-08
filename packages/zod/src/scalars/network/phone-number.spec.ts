import { describe } from 'bun:test';
import { schemaCases } from '../../../test/schema-cases';
import { phoneNumberSchema } from './phone-number';

describe('PhoneNumber', () => {
	schemaCases('PhoneNumber', phoneNumberSchema, {
		accepted: ['+123456789012345', '+1234567', '+33612345678', '+14155550123'],
		refused: [
			'+123456',
			'33612345678',
			'+0123456789',
			'+33 6 12 34 56 78',
			'+3361234567890123',
			'',
		],
	});
});
