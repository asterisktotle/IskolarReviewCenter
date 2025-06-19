// import { getGridFSBucket } from '../config/db.js';
// import pdfModel from '../models/pdfSchema.js';
import { Quiz, QuizAttempt } from '../models/quizSchema.js';

// QUIZ MAKER
export const createQuiz = async (req, res) => {
	const {
		title,
		subject,
		category,
		questions,
		totalPoints,
		passingScore,
		timeLimit,
		isPublished,
	} = req.body;

	if (!title || !subject || !questions || !category) {
		return res.json({ success: false, message: 'Provide all the fields' });
	}

	if (questions.length < 1) {
		return res.json({
			success: false,
			message: 'At least one question is required',
		});
	}

	try {
		const quiz = new Quiz({
			title,
			subject,
			category,
			questions,
			totalPoints: totalPoints || 0,
			passingScore: passingScore || 70,
			timeLimit: timeLimit || 0, //minutes
			isPublished,
		});

		await quiz.save();
		return res.json({
			success: true,
			message: 'Quiz created successfully',
			quizId: quiz._id,
		});
	} catch (err) {
		return res.json({ success: false, message: err.message });
	}
};
//GET ALL OR SEARCH QUIZZES
export const getAllQuizzes = async (req, res) => {
	try {
		const filter = {};

		if (req.query.subject) {
			filter.subject = req.query.subject;
		}

		if (req.query.category) {
			filter.category = req.query.category;
		}

		if (req.query.title) {
			filter.title = { $regex: `^${req.query.title}$`, $options: 'i' }; // case-insensitive
		}

		const quizzes = await Quiz.find(filter);
		if (quizzes.length === 0) {
			return res.json({ success: true, message: 'No quizzes found' });
		}

		return res.json({ success: true, data: quizzes });
	} catch (err) {
		return res.json({
			success: false,
			message: 'Failed to retrieve quizzes',
			error: err.message,
		});
	}
};

export const submitAndEvaluateQuiz = async (req, res) => {
	try {
		const { quizId, answers, userId } = req.body;
		if (!quizId || !answers) {
			return res.json({
				success: false,
				message: 'Provide the Quiz ID and answers',
			});
		}

		if (!userId) {
			return res.json({ success: false, message: 'Provide the user ID' });
		}

		const quiz = await Quiz.findById(quizId);
		if (!quiz) {
			return res.json({ success: false, message: 'Quiz not found' });
		}

		let score = 0;

		const evaluatedAnswers = [];
		let totalPoints = 0;
		const passingScore = quiz.passingScore || 0;

		for (let userAnswer of answers) {
			const question = quiz.questions.id(userAnswer.questionId);
			if (!question) continue; // skip question not found

			let isCorrect = false;
			let pointsEarned = 0;

			// Evaluate based on type
			if (question.type === 'multiple-choice') {
				// find the the element in array with true value of isCorrect
				const correctOption = question.options.find(
					(option) => option.isCorrect
				);

				isCorrect =
					correctOption &&
					correctOption._id.toString() === userAnswer.selectedOption;
			} else if (question.type === 'short-answer') {
				isCorrect =
					question.correctAnswer.trim().toLowerCase() ===
					userAnswer.textAnswer.trim().toLowerCase();
			}

			//add points
			if (isCorrect) {
				pointsEarned = question.points || 0;
				totalPoints += pointsEarned;
			}

			evaluatedAnswers.push({
				questionId: userAnswer.questionId,
				questionText: question.questionText,
				userAnswer: userAnswer.selectedOptions || userAnswer.textAnswer,
				isCorrect,
				pointsEarned,
			});
		}

		score = totalPoints;
		const percentageScore = quiz.totalPoints
			? (score / quiz.totalPoints) * 100
			: 0;
		const passed = percentageScore >= passingScore;

		const quizAttempt = new QuizAttempt({
			quiz: quizId,
			quizTitle: quiz.title,
			user: userId,
			answers: evaluatedAnswers,
			score,
			percentageScore,
			passed,
			completedAt: new Date(),
		});

		await quizAttempt.save();
		res.json({ success: true, attempt: quizAttempt });
	} catch (err) {
		return res.json({
			success: false,
			message: 'Submission error: ' + err.message,
		});
	}
};

export const getUserQuizHistory = async (req, res) => {
	try {
		const { userId, quizId } = req.body;

		if (!userId || !quizId) {
			return res.json({ success: false, message: 'Provide all the fields' });
		}

		const userAttemptQuiz = await QuizAttempt.findOne({
			user: userId,
			quiz: quizId,
		})
			.sort({ completedAt: -1 })
			.select('score percentageScore passed completedAt answers');

		if (!userAttemptQuiz) {
			return res.json({
				success: false,
				message: 'User did not take the quiz',
			});
		}

		return res.json({
			success: true,
			data: userAttemptQuiz,
		});
	} catch (err) {
		return res.json({ success: false, message: err.message });
	}
};

export const deleteQuiz = async (req, res) => {
	try {
		const { quizId } = req.params;
		if (!quizId) {
			return res.json({ success: false, message: 'NO Quiz ID provided' });
		}
		const quiz = await Quiz.findByIdAndDelete(quizId);
		if (!quiz) {
			return res.json({ success: false, message: 'Quiz not found' });
		}
		return res.json({ success: true, message: 'Quiz deleted successfully' });
	} catch (err) {
		return res.json({ success: false, message: err.message });
	}
};

export const updateQuiz = async (req, res) => {
	try {
		const { id } = req.params;
		const updates = req.body;

		if (!id) {
			return res.json({ success: false, message: 'NO Quiz ID provided' });
		}

		const quiz = await Quiz.findById(id);
		if (!quiz) {
			return res.json({ success: false, message: 'Quiz not found' });
		}

		// UPDATE QUIZ FIELDS
		if (updates.title) quiz.title = updates.title;
		if (updates.subject) quiz.subject = updates.subject;
		if (updates.isPublished) quiz.isPublished = updates.isPublished;
		if (updates.timeLimit !== undefined) quiz.timeLimit = updates.timeLimit;
		if (updates.passingScore !== undefined)
			quiz.passingScore = updates.passingScore;

		if (updates.category) {
			const validCategories = [
				'terms',
				'weekly-test',
				'take-home-test',
				'pre-board-exam',
			];
			if (validCategories.includes(updates.category)) {
				quiz.category = updates.category;
			} else {
				return res.json({
					success: false,
					message: 'Invalid category provided',
				});
			}
		}

		if (updates.totalPoints)
			if (updates.questions && Array.isArray(updates.questions)) {
				//UPDATE QUESTIONS
				quiz.questions = updates.questions.map((questions) => {
					const validatedQuestion = {
						questionText: questions.questionText,
						type: questions.type,
						points: questions.points || 1,
					};

					if (questions.type === 'multiple-choice') {
						validatedQuestion.options =
							questions.options?.map((option) => {
								return {
									text: option.text,
									isCorrect: option.isCorrect,
								};
							}) || [];
					} else if (questions.type === 'short-answer') {
						validatedQuestion.correctAnswer = questions.correctAnswer;
					}
					return validatedQuestion;
				});

				quiz.totalPoints = quiz.questions.reduce(
					(sum, q) => sum + (q.points || 1),
					0
				);
			}
		await quiz.save();
		return res.json({
			success: true,
			message: 'Quiz updated successfully',
			quiz: quiz,
		});
	} catch (err) {
		return res.json({ success: false, message: err.message });
	}
};

// TODO: use the utils function for pdf text extraction

// export const parseQuestionsFromFile = async (req, res) => {
// 	try {
// 		// Path to your questions file - using absolute path
// 		const filePath = path.join(
// 			process.cwd(),
// 			'..',
// 			'pdf_extractor',
// 			'MESL_ELEMENTS_9_questions.txt'
// 		);

// 		// Read the file
// 		const text = fs.readFileSync(filePath, 'utf-8');

// 		// Parse the questions
// 		const questions = parseQuestionsFromText(text);

// 		return res.json({
// 			success: true,
// 			message: 'Questions parsed successfully',
// 			questions,
// 		});
// 	} catch (err) {
// 		console.error('Error reading file:', err);
// 		return res.json({ success: false, message: err.message });
// 	}
// };
