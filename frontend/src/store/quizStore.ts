import axios from 'axios',
import {create} from 'zustand'

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


const QuizStore = create(() => ({

quizProfile: [],



}))
