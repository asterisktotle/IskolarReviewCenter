import { Box, Heading, VStack, Text } from '@chakra-ui/react';
import PlayQuiz from './PlayQuiz';
import QuizStore, { QuizProfile } from '../../store/quizStore';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useAuthStore from '../../store/authStore';

// Responsibility
// It fetches quizzes and display them
// Quizzes can be played by PlayQuiz component

const UserPlayQuiz = () => {
	const { fetchQuizById, isLoading } = QuizStore();
	const { userData } = useAuthStore();
	const [quizData, setQuizData] = useState<QuizProfile>();
	const { quizId } = useParams();

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetchQuizById(quizId as string);

				if (!response || !response.data) {
					console.error('Error fetching quiz');
					return;
				}

				setQuizData(response.data);
			} catch {
				console.error('Error fetching quiz');
				// setErrorMessage('Error fetching quiz data');
			}
		};
		fetchData();
	}, [fetchQuizById, quizId]);

	if (isLoading) {
		return <Box>Please wait..</Box>;
	}

	return (
		<VStack spacing={6} align="stretch" px={4}>
			<Box textAlign="center">
				<Heading size="md" mb={2}>
					{/* {quizData.title} */}
				</Heading>
				<Text color="gray.200" fontSize={'2xl'}>
					{quizData?.title}
				</Text>
			</Box>

			<VStack spacing={6} align="stretch">
				{quizData && quizData._id && userData?.userId && quizData.questions && (
					<PlayQuiz
						questions={quizData.questions}
						timeLimit={quizData.timeLimit}
						userId={userData.userId}
						quizId={quizData._id}
					/>
				)}
			</VStack>
		</VStack>
	);
};
export default UserPlayQuiz;
