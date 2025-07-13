import {
	FormControl,
	RadioGroup,
	Radio,
	Flex,
	Box,
	Text,
	Input,
	VStack,
	HStack,
	Badge,
	Container,
	Button,
	useToast,

} from '@chakra-ui/react';
import {  useEffect, useState } from 'react';

import QuizStore, {
	AnswerState,
	QuestionData,
	QuizFormEvaluation,
} from '../../store/quizStore';
import { MdCheckCircle, MdCancel } from 'react-icons/md';
import useCountdownTimer from '../../hooks/useCountdownTimer';
import EvaluatedQuiz from './EvaluatedQuiz';
import TestModeQuiz from './TestModeQuiz';
import { useLocation, useParams } from 'react-router-dom';

// Responsibility
// It display quiz form for user to answer 
// It evaluate quiz and display the result

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
