import express from 'express';
import { userAuth } from '../middleware/userAuth.js';
// import multer from 'multer';
import {
	createQuiz,
	getAllQuizzes,
	submitAndEvaluateQuiz,
	getUserQuizHistory,
	deleteQuiz,
	updateQuiz,
	// parseQuestionsFromFile,
} from '../controllers/featuresController.js';

const quizRouter = express.Router();
// const upload = multer({ storage: multer.memoryStorage() });

quizRouter.post('/create-quiz', createQuiz); // deleted userauth
quizRouter.post('/submit-quiz', submitAndEvaluateQuiz);
quizRouter.delete('/delete-quiz/:id', deleteQuiz); // deleted userauth
quizRouter.put('/update-quiz/:id', updateQuiz); // deleted userauth
quizRouter.get('/get-all-quizzes', getAllQuizzes);
quizRouter.post('/get-user-quiz-history', getUserQuizHistory);
// quizRouter.get('/parse-questions', parseQuestionsFromFile); // this parse the txt fle from pdf extractor [TODO]

export default quizRouter;
