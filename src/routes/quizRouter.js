import express from 'express';
import { getQuestions } from '../controllers/quizController.js';

const router = express.Router();

router.get('/:id', getQuestions);

export default router;
