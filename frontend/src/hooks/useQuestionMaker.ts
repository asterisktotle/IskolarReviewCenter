import { useState } from 'react';

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

interface MultipleChoiceQuestion extends BaseQuestionData {
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

	// Add new question of the current type
	const addQuestion = (questionData: QuestionData) => {
		const newQuestion: QuestionData = {
			...questionData,
		};
		setQuestions((prevQuestions) => [...prevQuestions, newQuestion]);
		return newQuestion.id;
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

	return {
		questions,
		addQuestion,
		removeQuestion,
		updateQuestion,
	};
};

export default useQuestionMaker;
