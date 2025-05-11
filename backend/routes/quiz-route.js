import express from 'express';
import { userAuth } from '../middleware/userAuth.js';
import {
	createQuiz,
	getAllQuizzes,
	submitAndEvaluateQuiz,
	getUserQuizHistory,
	deleteQuiz,
	updateQuiz,
} from '../controllers/featuresController.js';

const quizRouter = express.Router();

quizRouter.post('/create-quiz', userAuth, createQuiz);
quizRouter.post('/submit-quiz', submitAndEvaluateQuiz);
quizRouter.delete('/delete-quiz/:id', userAuth, deleteQuiz);
quizRouter.put('/update-quiz/:id', userAuth, updateQuiz);
quizRouter.get('/get-all-quizzes', userAuth, getAllQuizzes);
quizRouter.get('/get-user-quiz-history', userAuth, getUserQuizHistory);

export default quizRouter;
