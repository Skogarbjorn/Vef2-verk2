import { shuffle } from "./shuffle.js";
import { describe, expect, it } from '@jest/globals';

describe('lib', () => {
	describe('shuffle', () => {
		it('returns a shuffled version of the input array', () => {
			const test_array = [1, 2, 3, 4];
			const result = shuffle(test_array);

			expect(result.sort()).toBe(test_array.sort());
		});

		it('returns null if input is not an array', () => {
			const result = shuffle(14);

			expect(result).toBe(null);
		});
	});
});
