import { describe } from 'bun:test';
import { schemaCases } from '../../../test/schema-cases';
import { cidrv6Schema } from './cidrv6';

describe('CIDRv6', () => {
	schemaCases('CIDRv6', cidrv6Schema, {
		accepted: [
			'2001:db8::1/32',
			'2001:DB8::/32',
			'2001:db8::/32',
			'::/0',
			'::1/128',
			'2001:dB8::aBcD/64',
		],
		refused: ['::/01', '2001:db8::/129', '2001:db8::', '10.0.0.0/8'],
	});
});
