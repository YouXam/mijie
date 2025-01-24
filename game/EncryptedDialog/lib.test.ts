import { describe, expect, it } from 'bun:test';
import { generateShuffleMap } from './lib';

describe('generateShuffleMap', () => {
	it('creates a valid shuffle map', () => {
		for (let run = 0; run < 100; run++) {
			const shuffleMap = generateShuffleMap();
			const letters = 'abcdefghijklmnopqrstuvwxyz';
			const shuffledValues = new Set(Object.values(shuffleMap));

			for (const letter of letters) {
				expect(shuffleMap).toHaveProperty(letter);
				expect(shuffleMap).toHaveProperty(letter.toUpperCase());
				expect(shuffledValues).toContain(letter);
				expect(shuffledValues).toContain(letter.toUpperCase());
				expect(shuffleMap[letter].toUpperCase()).toBe(shuffleMap[letter.toUpperCase()]);
			}

			expect(Object.keys(shuffleMap).length).toBe(52);
			expect(shuffledValues.size).toBe(52);
		}
	});
});
