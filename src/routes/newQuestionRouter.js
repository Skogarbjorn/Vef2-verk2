import express from 'express';
import { addQuestion, createQuestionForm } from '../controllers/newQuestionController.js';

const router = express.Router();

router.get('/', createQuestionForm);
router.post('/', addQuestion);

export default router;
