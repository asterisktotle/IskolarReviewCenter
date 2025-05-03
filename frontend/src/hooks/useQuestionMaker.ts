import { useState } from 'react';

export interface QuestionOption {
	id: number;
	text: string;
	isCorrect: boolean;
}

export interface QuestionData {
	id: number;
	questionText: string;
	type: 'multiple-choice' | 'short-answer';
	options?: QuestionOption[];
	correctAnswer?: string;
	points: number;
}

const useQuestionMaker = (initialQuestions = []) => {
	const [questions, setQuestions] = useState<QuestionData[]>(initialQuestions);

	// Add new question of the current type
	const addQuestion = (questionData: QuestionData) => {
		const newQuestion: QuestionData = {
			...questionData,
		};
		setQuestions((prevQuestions) => [...prevQuestions, newQuestion]);
		return newQuestion.id;
	};

	// Remove a question by ID
	const removeQuestion = (questionId: number) => {
		setQuestions((prevQuestions) =>
			prevQuestions.filter((question) => question.id !== questionId)
		);
	};

	// Update question by ID
	const updateQuestion = (
		questionId: number,
		updatedQuestion: QuestionData
	) => {
		setQuestions((prevQuestions) =>
			prevQuestions.map((question) =>
				question.id === questionId
					? { ...question, ...updatedQuestion }
					: question
			)
		);
	};

	return {
		questions,
		addQuestion,
		removeQuestion,
		updateQuestion,
	};
};

export default useQuestionMaker;
