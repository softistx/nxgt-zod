import { describe } from 'bun:test';
import { schemaCases } from '../../../test/schema-cases';
import { utcOffsetSchema } from './utc-offset';

describe('UtcOffset', () => {
	schemaCases('UtcOffset', utcOffsetSchema, {
		accepted: ['+00:00', '+05:30', '-08:00', '+14:00', '-12:00', '+13:45'],
		refused: [
			'-00:00',
			'+14:30',
			'-12:30',
			'+15:00',
			'05:30',
			'+5:30',
			'+0530',
			'Z',
			'UTC',
			'',
		],
	});
});
