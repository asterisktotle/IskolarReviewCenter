import {
	Container,
} from '@chakra-ui/react';
import {  useEffect } from 'react';

import QuizStore, {
	QuestionData,
} from '../../store/quizStore';
import EvaluatedQuiz from './EvaluatedQuiz';
import TestModeQuiz from './TestModeQuiz';


const PlayQuiz = ({
	questions,
	userId,
	quizId,
	timeLimit
}: {
	questions: QuestionData[];
	userId: string;
	quizId: string;
	timeLimit: number;
}) => {
	const {  quizAttemptResults, setQuizAttemptResults } = QuizStore();

	useEffect(() => {
		const savedQuizInLocalStorage = localStorage.getItem("quizResult")
		if(savedQuizInLocalStorage){
			const savedQuiz = JSON.parse(savedQuizInLocalStorage);
			const isQuizMatched = savedQuiz.quiz === quizId

			if(isQuizMatched){
				setQuizAttemptResults(savedQuiz)
				return;
			} else setQuizAttemptResults(null)
			
		} 
		console.log("saved: ", savedQuizInLocalStorage)
	},[])
	
	return (
		<Container
			maxW={{ base: '100%', md: '2xl' }}
			py={5}
			px={{ base: 2, md: 0 }}
		>
			{/* Display evaluated quiz */}
			{quizAttemptResults && quizAttemptResults.answers.length ? (
			<EvaluatedQuiz quizAttemptResults={quizAttemptResults} questions={questions}/>	
			) 
			
			: (
			<TestModeQuiz questions={questions} userId={userId} quizId={quizId} timeLimit={timeLimit}/>	
			)}
		</Container>
	);
};

export default PlayQuiz;
