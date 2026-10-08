import { describe } from 'bun:test';
import { schemaCases } from '../../../test/schema-cases';
import { cidrv4Schema } from './cidrv4';

describe('CIDRv4', () => {
	schemaCases('CIDRv4', cidrv4Schema, {
		accepted: ['10.0.0.1/8', '10.0.0.0/8', '192.168.1.0/24', '0.0.0.0/0'],
		refused: ['10.0.0.0/08', '10.0.0.0/33', '10.0.0.0', '10.0.0.0/', '::/0'],
	});
});
