import { parseQuestionsFromText } from './questionParser.js';
import fs from 'fs';
import path from 'path';

// Read questions from a text file
const readQuestionsFromFile = (filename) => {
	try {
		const filePath = path.join(process.cwd(), filename);
		const text = fs.readFileSync(filePath, 'utf-8');
		return parseQuestionsFromText(text);
	} catch (error) {
		console.error('Error reading file:', error.message);
		return [];
	}
};

// Example usage with a text file
const questions = readQuestionsFromFile('MESL_ELEMENTS_9_questions.txt');
console.log('Parsed Questions:', JSON.stringify(questions, null, 2));

// Example 2: Using the parsed questions to create a quiz
const quizData = {
	title: 'Geometry Quiz',
	subject: 'mesl',
	category: 'terms',
	questions: questions,
	totalPoints: questions.length, // Each question is worth 1 point
	passingScore: 70,
	timeLimit: 30,
};

console.log('Quiz Data:', JSON.stringify(quizData, null, 2));
