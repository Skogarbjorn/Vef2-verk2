import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'url';
import categoryRouter from './src/routes/categoryRouter.js';
import questionRouter from './src/routes/questionRouter.js';
import quizRouter from './src/routes/quizRouter.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'ejs');

app.use('/', categoryRouter);
app.use('/category', quizRouter);
app.use('/questions', questionRouter);

app.use((req, res) => {
	res.status(404).render('404');
});

app.use((err, req, res, next) => {
	console.error(err);
	res.status(500).render('500');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server running on ${process.env.NODE_ENV === 'production' ? `https://Vef2-verk2.onrender.com` : `https://localhost:${PORT}`}`);
});
