import pg from 'pg';
import xss from 'xss';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
	user: process.env.DB_USER || 'skogarbjorn',
	host: process.env.DB_HOST || 'localhost',
	database: process.env.DB_NAME || 'verk2',
	password: process.env.DB_PASSWORD || '121212',
	port: process.env.DB_PORT || 5432,
});

export async function query(text, params) {
	try {
		const result = await pool.query(text, params);
		return result;
	} catch (err) {
		console.error('Error executing query:', err);
		throw err;
	}
}
