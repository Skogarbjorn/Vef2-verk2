import { readJson } from '../lib/parse.js';
import pg from 'pg';
import dotenv from 'dotenv';

const INDEX_PATH = './data/index.json'

const { Client } = pg;

dotenv.config();

const client = new Client({
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	ssl: {
		rejectUnauthorized: false,
	}
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

	let cIndex = 1;
	await Promise.all(
		allData.map(async (category, cIndex) => {
			const questions = category.content.questions;

			const categoryInsertSQL = `INSERT INTO categories (name) VALUES ('${escapeSQL(category.title)}') RETURNING id`;
			const categoryResult = await query(categoryInsertSQL);
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
						  VALUES (${categoryId}, '${escapeSQL(question.question)}')
						  RETURNING id
						`;
						const questionResult = await query(questionInsertSQL);
						const questionId = questionResult.rows[0].id;

						const answerSQL = question.answers
						  .filter(answer => answer.answer)
						  .map((answer, aIndex) => 
							`(${questionId}, '${escapeSQL(answer.answer)}', ${answer.correct ? 'true' : 'false'})`)
						  .join(',\n');

						if (answerSQL) {
							await query(`
								INSERT INTO answers (question_id, answer, is_correct)
								VALUES ${answerSQL};
							`);
						}
					})
			);
		})
	);

	//const categorySQL = allData.map((category, cIndex) => `('${category.title}')`).join(',\n');
	//await query(`INSERT INTO categories (name) VALUES\n${categorySQL} RETURNING id`);

	//await Promise.all(
	//	allData.map(async (category, cIndex) => {
	//		const questions = category.content.questions;
	//		const questionSQL = questions .filter(question => 
	//				question.question && 
	//				question.answers &&
	//				Array.isArray(question.answers))
	//			.map((question, qIndex) =>
	//			`('${(cIndex+1) * (qIndex+1)}', '${escapeSQL(question.question)}', ${cIndex+1})`).join(',\n');
	//		await query(`INSERT INTO questions (id, question, category_id) VALUES\n${questionSQL};`);

	//		await Promise.all(
	//			questions
	//			  .filter(question => 
	//					question.question && 
	//					question.answers &&
	//					Array.isArray(question.answers))
	//				.map(async (question, qIndex) => {
	//				if (!Array.isArray(question.answers)) {
	//					return;
	//				}
	//				const answerSQL = question.answers
	//					.filter(answer => answer.answer)
	//					.map((answer, aIndex) => {
	//						return `('${(cIndex+1) * (qIndex+1) * (aIndex+1)}', '${escapeSQL(answer.answer)}', ${answer.correct}, ${(cIndex+1) * (qIndex+1)})`}).join(',\n');
	//				await query(`INSERT INTO answers (id, answer, is_correct, question_id) VALUES\n${answerSQL};`);
	//			}));
	//	}));
}

async function createTables() {
	await query(`CREATE TABLE categories \( id SERIAL PRIMARY KEY, name VARCHAR\(255\) NOT NULL\)`);
	await query(`CREATE TABLE questions \( id SERIAL PRIMARY KEY, question TEXT NOT NULL, category_id INT REFERENCES categories\(id\) ON DELETE CASCADE\)`);
	await query(`CREATE TABLE answers \( id SERIAL PRIMARY KEY, answer TEXT NOT NULL, is_correct BOOLEAN DEFAULT FALSE, question_id INT REFERENCES questions\(id\) ON DELETE CASCADE\)`);
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

