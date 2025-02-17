import { query } from '../models/db.js';

export async function readQuestions(id) {
	const categoryResult = await query(
		'SELECT * FROM categories WHERE id = $1',
		[id]
	);

	const questionsResult = await query(
		'SELECT * FROM questions WHERE category_id = $1',
		[id]
	);

	const questionsWithAnswers = await Promise.all(
		questionsResult.rows.map(async (question) => {
			const answersResult = await query(
				'SELECT * FROM answers WHERE question_id = $1',
				[question.id]
			);
			question.answers = answersResult.rows;
			return question;
		})
	);

	return { 
		questions: questionsWithAnswers,
		category: categoryResult,
	}
}
