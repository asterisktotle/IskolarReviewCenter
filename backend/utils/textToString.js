// convert text to string
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import path from 'path';
import { parseQuestionsFromText } from './questionParser.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const file = path.join(__dirname, 'TEXT_SAMPLE.txt');

const readFileText = async (txtFile) => {
	try {
		const text = await readFile(txtFile, 'utf-8');
		return text;
	} catch (error) {
		console.error('Error: ', error.message);
		throw error;
	}
};

const parsedQuestions = async () => {
	const textToParse = await readFileText(file);
	const quizItems = parseQuestionsFromText(textToParse);
	const formattedItems = quizItems.map((item) => ({
		...item,
		options: item.options.map((opt) => ({ ...opt })),
	}));
	// console.log('This is the items: ', formattedItems);
	console.log('This is the items: ', JSON.stringify(formattedItems, null, 2));
};

parsedQuestions();
