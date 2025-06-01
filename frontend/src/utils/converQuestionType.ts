import { QuestionData } from '../hooks/useQuestionMaker';

export const convertQuestionType = (
	currentQuestion: QuestionData,
	questionType: 'multiple-choice' | 'short-answer'
): QuestionData => {
	const baseQuestion = {
		id: currentQuestion.id,
		questionText: currentQuestion.questionText,
		points: currentQuestion.points,
	};

	if (questionType === 'multiple-choice') {
		return {
			...baseQuestion,
			type: 'multiple-choice',
			options: [{ id: 1, text: 'Option 1', isCorrect: true }],
		};
	} else {
		return {
			...baseQuestion,
			type: 'short-answer',
			correctAnswer: '',
		};
	}
};

export default convertQuestionType;
