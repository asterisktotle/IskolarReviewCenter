import express from 'express';
import { userAuth } from '../middleware/userAuth.js';
import {
	createQuiz,
	getAllQuizzes,
	submitAndEvaluateQuiz,
	getUserQuizHistory,
	deleteQuiz,
	updateQuiz,
	getQuizById,
	// parseQuestionsFromFile,
} from '../controllers/quizController.js';

const quizRouter = express.Router();

quizRouter.post('/create-quiz', createQuiz); // deleted userauth
quizRouter.post('/submit-quiz', submitAndEvaluateQuiz);
quizRouter.delete('/delete-quiz/:id', deleteQuiz); // deleted userauth
quizRouter.put('/update-quiz/:id', updateQuiz); // deleted userauth
quizRouter.get('/get-all-quizzes', getAllQuizzes);
quizRouter.get('/get-quiz/:id', getQuizById)
quizRouter.post('/get-user-quiz-history', getUserQuizHistory);
// quizRouter.get('/parse-questions', parseQuestionsFromFile); // this parse the txt fle from pdf extractor [TODO]

export default quizRouter;
