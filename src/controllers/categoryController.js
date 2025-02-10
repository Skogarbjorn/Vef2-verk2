import { query } from '../models/db.js';

export const getCategories = async (_req, res) => {
	const result = await query('SELECT * FROM categories');
	console.log(result);
	res.render('categories', { categories: result.rows });
};
