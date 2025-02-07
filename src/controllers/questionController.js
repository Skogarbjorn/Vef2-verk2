import { query } from '../models/db.js';
import xss from 'xss';


export const createQuestionForm = async (req, res) => {
	const categories = await query('SELECT * FROM categories');
	res.render('new-question', { categories: categories });
};

export const addQuestion = async (req, res) => {
	const { question, category, answers } = req.body;
	const sanitizedQuestion = xss(question);

	if (!sanitizedQuestion || !category || !answers) {
		return res.status(400).send('Invalid input');
	}

	console.log("adding question");
};
