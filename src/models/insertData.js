import { readJson } from '../lib/parse.js';
import pg from 'pg';
import dotenv from 'dotenv';
import process from 'node:process';
import { shuffle } from '../lib/shuffle.js';

const INDEX_PATH = './data/index.json'

const { Client } = pg;

dotenv.config();

const client = new Client({
	connectionString: process.env.DATABASE_URL,
	ssl: { rejectUnauthorized: false, }
});

client.connect().then(() => {
	console.log('Connected to PostgreSQL database');
}).catch((err) => {
	console.error('Connection error', err.stack);
});

async function query(text, params) {
	try {
		const result = await client.query(text, params);
		return result;
	} catch (err) {
		console.error('Error executing query:', err);
		throw err;
	}
}

async function insertData() {
	const indexData = await readJson(INDEX_PATH);
	console.log(indexData);

	if (!Array.isArray(indexData)) {
		console.error("index.json is not an array. Check the file format.");
		return [];
	}

	const allData = (
		await Promise.all(
			indexData.map(async (item) => {
				const filePath = `./data/${item.file}`;
				const fileData = await readJson(filePath);
				return fileData
				  ? {
							...item,
							content: fileData.title && fileData.questions ? fileData : null,
					}
				: null;
			}),
		)
	).filter(item => item && item.content);

	console.log("Items filtered");

	await Promise.all(
		allData.map(async (category) => {
			const questions = category.content.questions;

			const categoryInsertSQL = `INSERT INTO categories (name) VALUES ($1) RETURNING id`;
			const categoryResult = await query(categoryInsertSQL, [escapeSQL(category.title)]);
			const categoryId = categoryResult.rows[0].id;

			console.log(questions);
			await Promise.all(
				questions
				  .filter(question =>
						question.question &&
						question.answers &&
						Array.isArray(question.answers))
				.map(async (question) => {
					const questionInsertSQL = `
					INSERT INTO questions (category_id, question)
					VALUES ($1, $2)
					RETURNING id
					`;
					const questionResult = await query(questionInsertSQL, [categoryId, escapeSQL(question.question)]);
					const questionId = questionResult.rows[0].id;

					const values = [];
					const placeholders = [];

					shuffle(question.answers.filter(answer => answer.answer)).forEach((answer, index) => {
						values.push(questionId, answer.answer, answer.correct);
						placeholders.push(`($${index * 3 + 1}, $${index * 3 + 2}, $${index * 3 + 3})`);
					});

					if (values.length > 0) {
						await query(
							`INSERT INTO answers (question_id, answer, is_correct) VALUES ${placeholders.join(', ')}`,
							values
						);
					}
				})
			);
		})
	);
}

async function createTables() {
	await query(`CREATE TABLE categories ( id SERIAL PRIMARY KEY, name VARCHAR(255) NOT NULL)`);
	await query(`CREATE TABLE questions ( id SERIAL PRIMARY KEY, question TEXT NOT NULL, category_id INT REFERENCES categories(id) ON DELETE CASCADE)`);
	await query(`CREATE TABLE answers ( id SERIAL PRIMARY KEY, answer TEXT NOT NULL, is_correct BOOLEAN DEFAULT FALSE, question_id INT REFERENCES questions(id) ON DELETE CASCADE)`);
}

async function deleteTables() {
	await query(`DROP TABLE answers CASCADE`);
	await query(`DROP TABLE questions CASCADE`);
	await query(`DROP TABLE categories CASCADE`);
}

function escapeSQL(str) {
  if (typeof str !== 'string') {
    throw new TypeError('Input must be a string');
  }
  return str.replace(/'/g, "''");
}

await deleteTables();
await createTables();
await insertData();

client.end()
  .then(() => console.log('Build successful, disconnecting from database'))
  .catch(err => console.error('Disconnection error', err.stack));

