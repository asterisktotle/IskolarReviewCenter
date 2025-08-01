import axios from 'axios';
import { create } from 'zustand';
import {
	FetchResponse,
	QuestionData,
	QuizAttemptResult,
	QuizFormEvaluation,
	QuizProfile,
} from '../types/QuizTypes';

axios.defaults.withCredentials = true;
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

interface QuizStore {
	// storing quizzes data
	quizzesFetch: QuizProfile[];
	setQuizzesFetch: (quizzes: QuizProfile[]) => void;

	//Admin Create Quiz Actions
	questions: QuestionData[];
	setQuestions: (questions: QuestionData[]) => void;
	quizProfile: QuizProfile;
	setQuizProfile: (quizProfile: QuizProfile) => void;
	addQuestions: (question: QuestionData) => void;
	removeQuestion: (questionId: number | string) => void;
	updateQuestion: (
		questionId: number | string,
		updatedQuestion: QuestionData
	) => void;
	publishQuiz: () => Promise<any>;
	updateQuiz: (quizId: string) => Promise<any>;
	deleteQuiz: (quizId: string) => Promise<any>;

	// User Actions
	quizAttemptResults: QuizAttemptResult | null;
	setQuizAttemptResults: (quizAttempt: QuizAttemptResult | null) => void;
	evaluateSubmittedQuiz: (quizForm: QuizFormEvaluation) => void | Promise<any>;
	loadQuizAttemptResults: () => void;
	fetchQuizParams: (searchParams?: { [key: string]: string | boolean }) => void;
	fetchQuizById: (quizId: string) => Promise<FetchResponse | void>;
	//Utils
	isLoading: boolean;
	setIsLoading: (isLoading: boolean) => void;
	tabIndex: number;
	setTabIndex: (tabIndex: number) => void;
}

const QuizStore = create<QuizStore>((set, get) => ({
	quizProfile: {
		title: 'Quiz Title',
		subject: 'mesl',
		category: 'terms',
		timeLimit: 0,
		passingScore: 50,
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

	quizAttemptResults: {
		quiz: '',
		quizTitle: '',
		user: '',
		answers: [],
		currentScore: 0,
		scores: [],
		currentPercentageScore: 0,
		percentageScores: [],
		passed: false,
		completedAt: '',
		attemptNumber: 0,
		attemptDates: [],
	},
	setQuizAttemptResults: (quizAttemptResults) => set({ quizAttemptResults }),
	isLoading: false,
	setIsLoading: (isLoading) => set({ isLoading }),
	tabIndex: 0,
	setTabIndex: (tabIndex) => set({ tabIndex }),
	addQuestions: async (question: QuestionData) => {
		const { setQuestions, questions } = get();

		const newQuestion: QuestionData = { ...question };
		setQuestions([...questions, newQuestion]);
	},
	removeQuestion: (questionId: number | string) => {
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
	updateQuestion: (
		questionId: number | string,
		updatedQuestion: QuestionData
	) => {
		const { questions, setQuestions } = get();

		//check if question exist
		const questionExist = questions.some((q) => q.id === questionId);

		if (!questionExist) {
			console.log('Cannot updated, question does not exist');
			return null;
		}

		const updatedQuestions = questions.map((question) =>
			question.id === questionId ? updatedQuestion : question
		);
		setQuestions(updatedQuestions);
	},
	publishQuiz: async () => {
		const {
			quizProfile,
			questions,
			setIsLoading,
			setQuizProfile,
			setQuestions,
		} = get();

		if (!questions.length) {
			throw new Error('No quiz submitted');
		}

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

			// Clearing the forms field
			setQuizProfile({
				title: 'Quiz Title',
				subject: 'mesl',
				category: 'terms',
				timeLimit: 0,
				passingScore: 50,
				totalPoints: 0,
				questions: [],
				isPublished: false,
			});
			setQuestions([]);
			return data;
		} catch (err) {
			console.log('publishQUiz error: ', err);
		} finally {
			setIsLoading(false);
		}
	},
	updateQuiz: async (quizId: string) => {
		const { quizProfile, questions, setIsLoading } = get();
		const { title, subject, category, timeLimit, passingScore, isPublished } =
			quizProfile;
		try {
			setIsLoading(true);
			const response = await axios.put(
				BACKEND_URL + '/api/quiz/update-quiz/' + quizId,
				{
					title,
					subject,
					category,
					timeLimit,
					passingScore,
					isPublished,
					questions: questions,
				}
			);
			if (!response.data.success) {
				console.error('cannot update', response.data.message);
			}
			console.log('response data:', response.data);
			return response;
		} catch (err) {
			throw new Error(err.message);
		} finally {
			setIsLoading(false);
		}
	},
	deleteQuiz: async (quizId: string) => {
		const { setIsLoading } = get();
		try {
			setIsLoading(true);
			const response = await axios.delete(
				BACKEND_URL + `/api/quiz/delete-quiz/${quizId}`
			);

			if (!response || !response.data.success) {
				console.error(
					'Delete quiz error: ',
					response?.data?.message || 'Unknown error occurred'
				);
				return;
			}

			console.log('Quiz deleted successfully:', response.data);
			return response.data;
		} catch (err) {
			console.error('Delete quiz exception:', err);
			throw new Error(err.message);
		} finally {
			setIsLoading(false);
		}
	},

	fetchQuizParams: async (searchParams = {}) => {
		const { setQuizzesFetch, setIsLoading } = get();
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

			if (data.success) {
				setQuizzesFetch(data.data);
				return data.data; 
			} else {
				throw new Error('Failed to fetch quizzes');
			}
		} catch (err) {
			console.log('fetching error: ', err);
			throw err; 		} finally {
			setIsLoading(false);
		}
	},
	fetchQuizById: async (quizId: string) => {
		const { setIsLoading } = get();

		try {
			setIsLoading(true);
			const { data } = await axios.get(
				BACKEND_URL + `/api/quiz/get-quiz/${quizId}`
			);

			if (!data.success) {
				throw new Error(data.message);
			}
			return data;
		} catch (err) {
			//make a an error message later on
			console.log('fetching error: ', err);
		} finally {
			setIsLoading(false);
		}
	},

	//TODO: do a clean up to the quiz attempt after seeing the result
	evaluateSubmittedQuiz: async (quizForm: QuizFormEvaluation) => {
		const { setIsLoading, setQuizAttemptResults } = get();
		try {
			setIsLoading(true);
			const { data } = await axios.post(BACKEND_URL + '/api/quiz/submit-quiz', {
				quizId: quizForm.quizId,
				userId: quizForm.userId,
				answers: quizForm.answers,
			});
			if (!data.success) {
				throw new Error(data.message);
			}

			console.log('quiz evaluation: ', data);
			setQuizAttemptResults(data.data);
			const { answers, passed, currentPercentageScore, currentScore, quiz } =
				data.data;
			const result = {
				answers,
				passed,
				currentPercentageScore,
				currentScore,
				quiz,
			};
			console.log('Saved to local storage: ', result);
			localStorage.setItem('quizResult', JSON.stringify(result));
			return data.success;
			// return data;
		} catch (err) {
			console.log('fetching error: ', err);
		} finally {
			setIsLoading(false);
		}
	},

	loadQuizAttemptResults: () => {
		const savedResults = localStorage.getItem('quizResult');
		if (savedResults) {
			set({ quizAttemptResults: JSON.parse(savedResults) });
		}
	},

	getQuizHistory: async (quizId, userId) => {
		// not implemented yet
		console.log('getquiz history: ', quizId, userId);
	},
}));

export default QuizStore;
