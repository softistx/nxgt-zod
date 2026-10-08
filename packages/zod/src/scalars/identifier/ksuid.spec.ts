import { describe } from 'bun:test';
import { schemaCases } from '../../../test/schema-cases';
import { ksuidSchema } from './ksuid';

describe('KSUID', () => {
	schemaCases('KSUID', ksuidSchema, {
		accepted: [
			'aWgEPTl1tmebfsQzFP4bxwgy80V',
			'000000000000000000000000000',
			'0ujtsYcgvSTl8PAuAdqWYSMnLOv',
		],
		refused: [
			'aWgEPTl1tmebfsQzFP4bxwgy80W',
			'zzzzzzzzzzzzzzzzzzzzzzzzzzz',
			'0ujtsYcgvSTl8PAuAdqWYSMnLO',
			'0ujtsYcgvSTl8PAuAdqWYSMnLOv0',
			'0ujtsYcgvSTl8PAuAdqWYSMnLO-',
			'',
		],
	});
});
