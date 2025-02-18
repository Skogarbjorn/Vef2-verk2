import { describe, expect, it } from '@jest/globals';
import { readJson } from "./parse.js";

const dummy_data_path = './src/lib/test_data/data.json';
const invalid_path = './non-existent-folder/invalid.java';

describe('parse', () => {
	describe('readJson', () => {
		it('parses a json file into data for javascript', async () => {
			const data = {
				"gamer": "gamer",
				"gaming": "gamer.json",
				"content": [
					{
						"where": "here"
					},
					{
						"over": "here?"
					}
				]
			};
			const result = await readJson(dummy_data_path);

			expect(result).toMatchObject(data);
		});

		it('returns null if path does not lead to an existing json file', async () => {
			const result = await readJson(invalid_path);
			expect(result).toBe(null);
		});

		it('returns null if no input is given', async () => {
			const result = await readJson();

			expect(result).toBe(null);
		});
	});
});
