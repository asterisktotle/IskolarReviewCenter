import { useState } from 'react';

export interface QuestionOption {
	text: string;
	isCorrect: boolean;
}

export interface QuestionData {
	type: 'multiple-choice' | 'short-answer';
	questionText: string;
	options?: QuestionOption[];
	correctAnswer?: string;
	points: number;
}

export interface Question extends QuestionData {
	id: number;
}

const useQuestionMaker = (initialQuestions = []) => {
	const [questions, setQuestions] = useState<Question[]>(initialQuestions);

	// Add new question of the current type
	const addQuestion = (questionData: QuestionData) => {
		const newQuestion: Question = {
			id: Date.now() * Math.random() * 100,
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
