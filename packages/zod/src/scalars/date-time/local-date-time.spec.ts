import { describe } from 'bun:test';
import { schemaCases } from '../../../test/schema-cases';
import { localDateTimeSchema } from './local-date-time';

describe('LocalDateTime', () => {
	schemaCases('LocalDateTime', localDateTimeSchema, {
		accepted: [
			'2024-03-10T10:15:30',
			'2024-03-10T10:15',
			'2024-02-29T00:00:00.5',
		],
		refused: [
			'2024-03-10T10:15:30Z',
			'2024-03-10T10:15:30+02:00',
			'2024-03-10 10:15:30',
			'2024-02-30T10:15:30',
			'2023-02-29T10:15',
			'2024-03-10',
			'',
		],
	});
});
