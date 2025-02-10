import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import categoryRouter from './src/routes/categoryRouter.js';
import questionRouter from './src/routes/questionRouter.js';
import quizRouter from './src/routes/quizRouter.js';
import process from 'node:process';

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'ejs');

app.use('/', categoryRouter);
app.use('/category', quizRouter);
app.use('/questions', questionRouter);

app.use((_req, res) => {
	res.status(404).render('404');
});

app.use((err, _req, res, _next) => {
	console.error(err);
	res.status(500).render('500');
});

const PORT = process.env.PORT || 3000;
const HOST = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';

app.listen(PORT, HOST, () => {
	console.log(`Server running on ${process.env.NODE_ENV === 'production' 
			? `https://Vef2-verk2.onrender.com`
			: `https://localhost:${PORT}`}`);
});
