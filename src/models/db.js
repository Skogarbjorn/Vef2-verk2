import pg from 'pg';
import dotenv from 'dotenv';
import process from 'node:process';

dotenv.config();

const { Client } = pg;

const client = new Client({
	connectionString: process.env.DATABASE_URL,
	ssl: process.env.NODE_ENV === 'production' 
		? { rejectUnauthorized: false, }
	  : false
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
