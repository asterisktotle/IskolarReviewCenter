import axios from 'axios';
import { create } from 'zustand';
// NOTE INTEGRATE FETCHQUIZ QUESTION CONTENT TO ADMINTEST QUESTION FORMAT

axios.defaults.withCredentials = true;
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

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

export interface QuizProfile {
	title: string;
	subject: 'mesl' | 'mdsp' | 'pipe';
	category: 'terms' | 'weekly-test' | 'take-home-test' | 'pre-board-exam';
	timeLimit: number;
	passingScore: number;
	totalPoints: number;
	questions: QuestionData[];
	isPublished: boolean;
}

interface QuizStore {
	questions: QuestionData[];
	setQuestions: (questions: QuestionData[]) => void;
	quizzesFetch: QuizProfile[];
	setQuizzesFetch: (quizzes: QuizProfile[]) => void;
	selectedQuiz: QuizProfile[];
	setSelectedQuiz: (selectedQuiz: QuizProfile[]) => void;
	isLoading: boolean;
	setIsLoading: (isLoading: boolean) => void;
	quizProfile: QuizProfile;
	setQuizProfile: (quizProfile: QuizProfile) => void;
	addQuestions: (question: QuestionData) => void;
	removeQuestion: (questionId: number) => void;
	updateQuestion: (questionId: number, updatedQuestion: QuestionData) => void;
	fetchQuizParams: (searchParams?: { [key: string]: string | boolean }) => void;
	publishQuiz: () => Promise<any>;
}

const QuizStore = create<QuizStore>((set, get) => ({
	quizProfile: {
		title: 'Quiz Title',
		subject: 'mesl',
		category: 'terms',
		timeLimit: 0,
		passingScore: 0,
		totalPoints: 0,
		questions: [],
		isPublished: false,
	},
	setQuizProfile: (updates) =>
		set((state) => ({
			quizProfile: {
				...state.quizProfile,
				...updates,
			},
		})),
	questions: [],
	setQuestions: (questions) => set({ questions }),
	quizzesFetch: [],
	setQuizzesFetch: (quizzesFetch) => set({ quizzesFetch }),
	selectedQuiz: [],
	setSelectedQuiz: (selectedQuiz) => set({ selectedQuiz }),
	isLoading: false,
	setIsLoading: (isLoading) => set({ isLoading }),
	addQuestions: async (question: QuestionData) => {
		const { setQuestions, questions } = get();

		const newQuestion: QuestionData = { ...question };
		setQuestions([...questions, newQuestion]);
	},
	removeQuestion: (questionId: number) => {
		const { questions, setQuestions } = get();

		//check if question exist and prevent deletion of all questions
		if (questions.length === 0) {
			return;
		}

		//check if question exist
		const questionExist = questions.some((q) => q.id === questionId);

		if (!questionExist) {
			return;
		}

		const updatedQuestions = questions.filter(
			(question) => question.id !== questionId
		);
		setQuestions(updatedQuestions);
	},
	updateQuestion: (questionId: number, updatedQuestion: QuestionData) => {
		const { questions, setQuestions } = get();

		//check if question exist
		const questionExist = questions.some((q) => q.id === questionId);

		if (!questionExist) {
			return;
		}

		const updatedQuestions = questions.map((question) =>
			question.id === questionId ? updatedQuestion : question
		);
		setQuestions(updatedQuestions);
	},
	publishQuiz: async () => {
		const { quizProfile, questions, setIsLoading } = get();
		try {
			setIsLoading(true);
			const { data } = await axios.post(BACKEND_URL + '/api/quiz/create-quiz', {
				title: quizProfile.title,
				subject: quizProfile.subject,
				category: quizProfile.category,
				questions,
				totalPoints: quizProfile.totalPoints,
				passingScore: quizProfile.passingScore,
				timeLimit: quizProfile.timeLimit,
				isPublished: quizProfile.isPublished,
			});

			return data;
		} catch (err) {
			console.log('publishQUiz error: ', err);
		} finally {
			setIsLoading(false);
		}
	},
	fetchQuizParams: async (searchParams = {}) => {
		const { setSelectedQuiz, setQuizzesFetch, setIsLoading } = get();
		const stringParams: { [key: string]: string } = {};
		for (const key in searchParams) {
			stringParams[key] = String(searchParams[key]);
		}

		const params = new URLSearchParams(stringParams);
		try {
			setIsLoading(true);

			const { data } = await axios.get(
				BACKEND_URL + `/api/quiz/get-all-quizzes?${params}`
			);

			if (data.success && data.data.length === 1) {
				setSelectedQuiz(data.data);
				return;
			}

			if (data.success && data.data.length > 1) {
				setQuizzesFetch(data.data);
				return;
			}
		} catch (err) {
			console.log('fetching error: ', err);
		} finally {
			setIsLoading(false);
		}
	},
	getQuizHistory: async (quizId, userId) => {}
	
}));

export default QuizStore;
