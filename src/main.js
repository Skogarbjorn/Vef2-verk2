import { readJson } from './lib/parse.js';

const INDEX_PATH = './data/index.json'

async function main() {
	const indexData = await readJson(INDEX_PATH);

	if (!Array.isArray(indexData)) {
		console.error("index.json is not an array. Check the file format.");
		return [];
	}

	const allData = (
		await Promise.all(
			indexData.map(async (item) => {
				const filePath = `./data/${item.file}`;
				const fileData = await readJson(filePath);
				return fileData
				  ? {
							...item,
							content: fileData.title && fileData.questions ? fileData : null,
					}
				: null;
			}),
		)
	).filter(item => item && item.content);

	const categorySQL = allData.map(category => `('${category.title}')`).join(',\n');
	console.log(`INSERT INTO categories (name) VALUES\n${categorySQL};`);

	allData.forEach((category, cIndex) => {
		const questions = category.content.questions;
		const questionSQL = questions.map((question, qIndex) =>
			`('${escapeSQL(question.question)}', ${cIndex+1})`).join(',\n');
		console.log(`INSERT INTO questions (question, category_id) VALUES\n${questionSQL};`);

		questions.forEach((question, qIndex) => {
			const questionId = qIndex + 1;
			if (!Array.isArray(question.answers)) {
				return;
			}
			const answerSQL = question.answers.map((answer, aIndex) => {
				if (!answer.answer) return;
				return `('${escapeSQL(answer.answer)}', ${answer.correct}, ${questionId})`}).join(',\n');
				console.log(`INSERT INTO answers (answer, is_correct, question_id) VALUES\n${answerSQL};`);
				});
			});
}

function escapeSQL(str) {
  if (typeof str !== 'string') {
    throw new TypeError('Input must be a string');
  }
  return str.replace(/'/g, "''");
}

main();
