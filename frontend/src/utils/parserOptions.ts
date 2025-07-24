import { QuestionOption } from "../types/QuizTypes";


// Parse the input text into separate options
export const parseOptions = (text: string) => {
	if (!text.trim()) return [];

	const line = text.split('\n').filter((line) => line.trim() !== '');

	const options: QuestionOption[] = line.map((option, index) => {
		return {
			id: index + 1,
			text: option.trim(),
			isCorrect: false,
		};
	});

	return options;
};

export default parseOptions;
