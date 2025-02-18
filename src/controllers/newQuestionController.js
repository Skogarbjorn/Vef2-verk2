import { validateInputs } from '../lib/questionFilter.js';
import { query } from '../models/db.js';
import xss from 'xss';


export const createQuestionForm = async (req, res) => {
	const categories = await query('SELECT * FROM categories');
	res.render('add-question', { 
		categories: categories.rows,
		user_inputs: null,
		error: null
	});
};

export const addQuestion = async (req, res) => {
	const { question, category, answers, correct } = req.body;
	const sanitizedQuestion = xss(question);
	const sanitizedAnswers = xss(answers).split(',');

	const invalid = validateInputs(sanitizedAnswers, sanitizedQuestion);

	if (invalid) {
		const categories = await query('SELECT * FROM categories');
		res.render('add-question', { 
			categories: categories.rows,
			user_inputs: { 
				question: question,
				answers: answers,
				category: category,
				correct: correct
			},
			error: invalid
		});
		return;
	}

	if (!sanitizedQuestion || !category || !sanitizedAnswers) {
		return res.status(400).send('Invalid input');
	}

	const questionSQL = `INSERT INTO questions (category_id, question) VALUES ($1, $2) RETURNING id`;
	const questionResult = await query(questionSQL, [category, sanitizedQuestion]);
	const questionId = questionResult.rows[0].id;
	await Promise.all(
		sanitizedAnswers.map(async (answer, aIndex) => {
			const answerSQL = `INSERT INTO answers (question_id, answer, is_correct) VALUES ($1, $2, $3)`;
			await query(answerSQL, [questionId, answer, aIndex+1 == correct ? 'true' : 'false']);
		})
	);

	res.render('question-added');
};
