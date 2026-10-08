import { describe } from 'bun:test';
import { schemaCases } from '../../../test/schema-cases';
import { nanoIdSchema } from './nano-id';

describe('NanoID', () => {
	schemaCases('NanoID', nanoIdSchema, {
		accepted: ['V1StGXR8_Z5jdHi6B-myT', '___________________-_'],
		refused: [
			'V1StGXR8_Z5jdHi6B-my',
			'V1StGXR8_Z5jdHi6B-myTT',
			'V1StGXR8_Z5jdHi6B-my!',
			'',
		],
	});
});
