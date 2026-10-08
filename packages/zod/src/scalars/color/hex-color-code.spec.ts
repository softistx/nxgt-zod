import { describe } from 'bun:test';
import { schemaCases } from '../../../test/schema-cases';
import { hexColorCodeSchema } from './hex-color-code';

describe('HexColorCode', () => {
	schemaCases('HexColorCode', hexColorCodeSchema, {
		accepted: [
			'#f00',
			'#F00',
			'#f008',
			'#ff0000',
			'#FF0000',
			'#ff000080',
			'#aBcDeF',
			'#fA0',
			'#Ff00aA80',
		],
		refused: [
			'#f00\n',
			'f00',
			'#ff',
			'#fffff',
			'#fffffff',
			'#fffffffff',
			'#ggg',
			'# f00',
			'#ff0000 ',
			'',
			0xff0000,
		],
	});
});
