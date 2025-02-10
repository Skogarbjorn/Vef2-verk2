import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Client } = pg;

const client = new Client({
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	ssl: {
		rejectUnauthorized: false,
	},
});

client.connect().then(() => {
	console.log('Connected to PostgreSQL database');
}).catch((err) => {
	console.error('Connection error', err.stack);
});

export async function query(text, params) {
	try {
		const result = await client.query(text, params);
		return result;
	} catch (err) {
		console.error('Error executing query:', err);
		throw err;
	}
}
