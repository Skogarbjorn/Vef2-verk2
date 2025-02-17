import { query } from '../models/db.js';
import { readQuestions } from '../lib/readQuestions.js';

export const getQuestions = async (req, res) => {
	const { id } = req.params;
	const queryResults = await readQuestions(id);

	res.render('quiz', { 
		id: [id],
		questions: queryResults.questions,
		category: queryResults.category.rows,
		results: null,
		checked: null
	});
}

export const handleSubmit = async (req, res) => {
	const { id } = req.params;
	const userAnswers = req.body;
	const results = [];
	const checked = [];

	const answers = await query(`
		SELECT answers.id,question_id FROM answers, questions
		WHERE is_correct = true
		AND question_id = questions.id
		AND category_id = $1
		`, [id]);

	answers.rows.forEach((row, index) => {
		const correctAnswer = (row.id-1) % 4;
		const userAnswer = Number(userAnswers[index]);
		checked.push(userAnswer);
		if (correctAnswer === userAnswer) {
			results.push({
				correct: correctAnswer,
				incorrect: -1
			});
		} else {
			results.push({
				correct: correctAnswer,
				incorrect: userAnswer
			});
		}
	});

	const queryResults = await readQuestions(id);
	res.render('quiz', { 
		id: [id],
		questions: queryResults.questions,
		category: queryResults.category.rows,
		results: results,
		checked: checked
	});
}
