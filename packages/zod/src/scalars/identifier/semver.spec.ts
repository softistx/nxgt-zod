import { describe } from 'bun:test';
import { schemaCases } from '../../../test/schema-cases';
import { semverSchema } from './semver';

describe('SemVer', () => {
	schemaCases('SemVer', semverSchema, {
		accepted: [
			'1.2.3',
			'0.0.0',
			'1.0.0-rc.1+build.5',
			'1.0.0-alpha-a.b-c',
			'10.20.30',
		],
		refused: [
			'v1.2.3',
			'1.2',
			'01.2.3',
			'1.2.3-01',
			'1.2.3-',
			'1.2.3+',
			' 1.2.3',
			'',
		],
	});
});
