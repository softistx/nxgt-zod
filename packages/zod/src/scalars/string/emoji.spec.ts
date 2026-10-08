import { describe } from 'bun:test';
import { schemaCases } from '../../../test/schema-cases';
import { emojiSchema } from './emoji';

describe('Emoji', () => {
	schemaCases('Emoji', emojiSchema, {
		accepted: [
			'😀',
			'👍🏽',
			'👨‍👩‍👧',
			'🇫🇷',
			'❤️',
			'❤',
			'1️⃣',
			'#️⃣',
			'🫠',
			'🏴󠁧󠁢󠁥󠁮󠁧󠁿',
			'🇿🇿',
			'🦰',
			'👩🏻\u200d🤝\u200d👨🏿',
		],
		refused: [
			'⃣',
			'🏻',
			`😀${'\ufe0f'.repeat(1000)}`,
			`${'👨\u200d'.repeat(200000)}👨`,
			'😀😀',
			'🇫🇷🇩🇪',
			'a',
			'😀a',
			' 😀',
			'😀\n',
			'‍',
			'️',
			'*',
			'👨\u200d',
			'👨\u200d👩\u200d',
			'❤\ufe0f\ufe0f',
			'👍🏽🏽',
			'👍🏽\ufe0f🏽',
			'🇫',
			'🇫🇷🇩',
			'',
			1,
		],
	});
});
