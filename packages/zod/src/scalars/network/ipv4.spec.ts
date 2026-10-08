import { describe } from 'bun:test';
import { schemaCases } from '../../../test/schema-cases';
import { ipv4Schema } from './ipv4';

describe('IPv4', () => {
	schemaCases('IPv4', ipv4Schema, {
		accepted: ['192.168.0.1', '0.0.0.0', '255.255.255.255'],
		refused: [
			'127.1',
			'0x7f.0.0.1',
			'1.2.3.4 ',
			'256.0.0.1',
			'01.2.3.4',
			'1.2.3',
			' 1.2.3.4',
			'::1',
			1,
		],
	});
});
