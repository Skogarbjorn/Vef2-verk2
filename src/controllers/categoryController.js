import { query } from '../models/db.js';

export const getCategories = async (req, res) => {
	const result = await query('SELECT * FROM categories');
	res.render('categories', { categories: result.rows });
};

export const getCategoryById = async (req, res) => {
	const { id } = req.params;
	const result = await query(
		'SELECT * FROM questions WHERE category_id = $1',
		[id]
	);
	res.render('category', { questions: result.rows });
};
