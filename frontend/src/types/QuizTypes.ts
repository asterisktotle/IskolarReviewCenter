
// Creating Quizzes
export interface QuestionOption {
    id: number | string;
    text: string;
    isCorrect: boolean;
    _id?: string;
}

interface BaseQuestionData {
    id: number | string;
    questionText: string;
    points: number;
    _id?: string;
}

export interface MultipleChoiceQuestion extends BaseQuestionData {
    type: 'multiple-choice';
    options: QuestionOption[];
    correctAnswer?: never;
    _id?: string;
}
interface ShortAnswerQuestion extends BaseQuestionData {
    type: 'short-answer';
    correctAnswer: string;
    options?: never;
}
export type QuestionData = MultipleChoiceQuestion | ShortAnswerQuestion;



export interface AnswerState {
    questionId: string;
    selectedOption?: string;
    textAnswer?: string;
}

export interface QuizFormEvaluation {
    quizId: string;
    userId: string;
    answers: AnswerState[];
}


export type SubjectTypes = 'all' | 'mesl' | 'mdsp' | 'pipe'
export type CategoryTypes = 'all' |  'terms' | 'weekly-test' | 'take-home-test' | 'pre-board-exam';

export interface QuizProfile {
    title: string;
    subject: SubjectTypes;
    category: CategoryTypes;
    timeLimit: number; 
    passingScore: number;
    totalPoints: number;
    questions?: QuestionData[];
    isPublished: boolean;
    _id?: string;
}

export interface FetchResponse {
    data: QuizProfile;
    success: boolean;
}

export interface QuizAttemptResult {
    quiz: string;
    quizTitle: string;
    user: string;
    answers: Array<{
        questionId: string;
        selectedOption?: string;
        textAnswer?: string;
        isCorrect: boolean;
        pointsEarned: number;
    }>;
    currentScore: number;
    scores: number[];
    currentPercentageScore: number;
    percentageScores: number[];
    passed: boolean;
    completedAt: string;
    attemptNumber: number;
    attemptDates: string[];
}
