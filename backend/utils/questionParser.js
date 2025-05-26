export const parseQuestionsFromText = (text) => {
	// Split the text by the separator
	const questions = text
		.split('--------------------------------------------------')
		.filter((block) => block.trim() !== '') // Remove empty blocks
		.map((block) => {
			// Extract question number and text
			const questionMatch = block.match(/Question (\d+):\s*([\s\S]*?)(?=A\.)/);
			if (!questionMatch) return null;

			const questionNumber = questionMatch[1];
			// Clean up question text by replacing multiple spaces and line breaks with a single space
			const questionText = questionMatch[2]
				.trim()
				.replace(/\r\n/g, ' ') // Replace \r\n with space
				.replace(/\n/g, ' ') // Replace \n with space
				.replace(/\s+/g, ' '); // Replace multiple spaces with single space

			// Extract options
			const optionsMatch = block.match(
				/A\.\s*([^\n]+)\s*B\.\s*([^\n]+)\s*C\.\s*([^\n]+)\s*D\.\s*([^\n]+)/
			);
			if (!optionsMatch) return null;

			// Extract answer
			const answerMatch = block.match(/Answer:\s*([A-D])/);
			if (!answerMatch) return null;

			const correctAnswer = answerMatch[1];

			// Create options array
			const options = [
				{
					id: 1,
					text: optionsMatch[1].trim(),
					isCorrect: correctAnswer === 'A',
				},
				{
					id: 2,
					text: optionsMatch[2].trim(),
					isCorrect: correctAnswer === 'B',
				},
				{
					id: 3,
					text: optionsMatch[3].trim(),
					isCorrect: correctAnswer === 'C',
				},
				{
					id: 4,
					text: optionsMatch[4].trim(),
					isCorrect: correctAnswer === 'D',
				},
			];

			return {
				questionText,
				type: 'multiple-choice',
				points: 1,
				options,
			};
		})
		.filter((question) => question !== null); // Remove any null entries

	return questions;
};
