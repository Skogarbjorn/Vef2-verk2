import express from 'express';
import { addQuestion, createQuestionForm } from '../controllers/questionController.js';

const router = express.Router();

router.get('/new', createQuestionForm);
router.post('/', addQuestion);

export default router;
