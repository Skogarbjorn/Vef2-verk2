import { query } from '../models/db.js';

export const getCategories = async (_req, res) => {
	const result = await query('SELECT * FROM categories');
	res.render('categories', { categories: result.rows });
};
