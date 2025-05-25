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

export interface QuizProfile {
    title: string; 
    subject: 'mesl' | 'mdsp' | 'pipe';
    category: 'terms' | 'weekly-test' | 'take-home-test' | 'pre-board-exam'; 
    timeLimit?: number; 
    passingScore?: number; 
    totalPoints: number;
    questions: QuestionData[];
}

interface QuizStore {
    questions: QuestionData[],
    quizProfile: QuizProfile, 
    setQuestions: (questions: QuestionData[]) => void;
    setQuizProfile: (quizProfile: QuizProfile) => void;
    addQuestions: (question: QuestionData) => void;
    removeQuestion: (questionId: number) => void;
    updateQuestion: (questionId: number, updatedQuestion: QuestionData) => void;
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
},
setQuizProfile: (quizProfile) => set({quizProfile}),
questions: [],
setQuestions: (questions) => set({questions}),
//Add new question 
addQuestions: async (question: QuestionData) => {
    const {setQuestions, questions} = get();
    
    const newQuestion: QuestionData = {...question};
    setQuestions([newQuestion, ...questions]);

},
removeQuestion: (questionId: number) => {
    const {questions, setQuestions} = get();
    
    //check if question exist and prevent deletion of all questions
    if(questions.length === 0) {
        return;
    }

    //check if question exist
    const questionExist = questions.some((q) => q.id === questionId);
    
    if(!questionExist) {
        return;
    }

    const updatedQuestions = questions.filter((question) => question.id !== questionId);
    setQuestions(updatedQuestions);
},
updateQuestion: (questionId: number, updatedQuestion: QuestionData) => {
    const {questions, setQuestions} = get();

    //check if question exist
    const questionExist = questions.some((q) => q.id === questionId);

    if(!questionExist) {
        return;
    }

    const updatedQuestions = questions.map((question) =>
        question.id === questionId ? updatedQuestion : question
    );
    setQuestions(updatedQuestions);
},
publishQuiz: async() => {
    const {quizProfile, questions} = get();
    try{
        const {data} = await axios.post(BACKEND_URL + '/api/quiz/create-quiz', {
            title: quizProfile.title,
            subject: quizProfile.subject,
            category: quizProfile.category,
            questions,
            totalPoints: quizProfile.totalPoints,
            passingScore: quizProfile.passingScore,
            timeLimit: quizProfile.timeLimit,
        })

        if(data.success){
            console.log('Quiz published successfully')
        }
        else{
            console.log('QUiz published failed')
        }
    }catch(err){
        console.log('publishQUiz error: ', err)
    }
}



}))
