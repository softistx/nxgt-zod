import { describe } from 'bun:test';
import { schemaCases } from '../../../test/schema-cases';
import { currencySchema } from './currency';

describe('Currency', () => {
	schemaCases('Currency', currencySchema, {
		accepted: ['EUR', 'USD', 'JPY', 'CHF', 'XAU', 'XXX', 'SLE', 'VES'],
		refused: [
			'eur',
			'Eur',
			'EU',
			'EURO',
			'ZZZ',
			'FRF',
			'HRK',
			'SLL',
			' EUR',
			'',
			978,
		],
	});
});
