import { describe, expect, test } from 'bun:test';
import { refusal, schemaCases } from '../../../test/schema-cases';
import { ipSchema } from './ip';

describe('IP', () => {
	schemaCases('IP', ipSchema, {
		accepted: ['192.168.0.1', '::1', '2001:db8::1'],
		refused: ['256.0.0.1', 'example.com', '', 1],
	});

	test('its refusal says what it takes, for any input', () => {
		for (const value of ['x', 1, null]) {
			expect(refusal(ipSchema, value)).toBe(
				'Invalid IP address: expected IPv4 or IPv6',
			);
		}
	});
});
