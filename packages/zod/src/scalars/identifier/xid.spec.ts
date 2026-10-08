import { describe } from 'bun:test';
import { schemaCases } from '../../../test/schema-cases';
import { xidSchema } from './xid';

describe('XID', () => {
	schemaCases('XID', xidSchema, {
		accepted: ['9m4e2mr0ui3e8a215n4g', '9m4e2mr0ui3e8a215n40'],
		refused: [
			'9M4E2MR0UI3E8A215N4G',
			'9m4e2mr0ui3e8a215n4h',
			'9m4e2mr0ui3e8a215n4v',
			'9m4e2mr0ui3e8a215n4w',
			'9m4e2mr0ui3e8a215n4',
			'',
		],
	});
});
