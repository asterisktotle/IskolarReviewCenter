import { useState } from 'react';
//refactor this to zustand
export interface QuestionOption {
	id: number;
	text: string;
	isCorrect: boolean;
}

interface BaseQuestionData {
	id: number;
	questionText: string;
	points: number;
}

export interface MultipleChoiceQuestion extends BaseQuestionData {
	type: 'multiple-choice';
	options: QuestionOption[];
	correctAnswer?: never;
}
interface ShortAnswerQuestion extends BaseQuestionData {
	type: 'short-answer';
	correctAnswer: string;
	options?: never;
}

export type QuestionData = MultipleChoiceQuestion | ShortAnswerQuestion;

const useQuestionMaker = (initialQuestions = []) => {
	const [questions, setQuestions] = useState<QuestionData[]>(initialQuestions);
	const [quizProfile, setQuizProfile] = useState({
		title: 'Quiz Title',
		subject: 'mesl',
		category: 'terms',
		timeLimit: 0,
		passingScore: 0,
		totalPoints: 0,
	});

	// Add new question of the current type
	const addQuestion = (questionData: QuestionData) => {
		const newQuestion: QuestionData = {
			...questionData,
		};
		setQuestions((prevQuestions) => [...prevQuestions, newQuestion]);
	};

	// Remove a question by	 ID
	const removeQuestion = (questionId: number) => {
		if (questions.length === 0) {
			return;
		}
		setQuestions((prevQuestions) =>
			prevQuestions.filter((question) => question.id !== questionId)
		);
	};

	// Update question by ID
	const updateQuestion = (
		questionId: number,
		updatedQuestion: QuestionData
	) => {
		setQuestions((prevQuestions) => {
			if (prevQuestions.length === 0) {
				return [updatedQuestion];
			}

			//check if question exist
			const questionExist = prevQuestions.some((q) => q.id === questionId);

			if (questionExist) {
				return prevQuestions.map((q) =>
					q.id === questionId ? updatedQuestion : q
				);
			} else {
				return [...prevQuestions, updatedQuestion];
			}
		});
	};

	// const publishQuiz = (profile) ==> {
	// 	const quizData = {
	// 		title: ,
	// 		subject: ,
	// 	}
	// }

	return {
		questions,
		addQuestion,
		removeQuestion,
		updateQuestion,
		setQuizProfile,
		quizProfile,
	};
};

export default useQuestionMaker;
