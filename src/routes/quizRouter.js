import express from 'express';
import { getQuestions, handleSubmit } from '../controllers/quizController.js';

const router = express.Router();

router.get('/:id', getQuestions);
router.post('/:id', handleSubmit);

export default router;
