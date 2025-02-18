import { describe, expect, it } from '@jest/globals';
import { validateInputs } from "./questionFilter.js";

const valid_answers = ["a","b","c","d"];
const invalid_answers = ["a","b","c"];
const valid_question = "valid question length";
const invalid_question = "short";

describe('questionFilter', () => {
	describe('validateInputs', () => {
		it('returns an appropriate message if length is too short', () => {
			const result = validateInputs(valid_answers, invalid_question);
			expect(result).toBe("Question must be between 10 and 200 characters");
		});

		it('returns an appropriate message if answers are not 4', () => {
			const result = validateInputs(invalid_answers, valid_question);
			expect(result).toBe("There must be 4 answers");
		});

		it('returns null if the input is valid', () => {
			const result = validateInputs(valid_answers, valid_question);
			expect(result).toBe(null);
		});
	});
});
