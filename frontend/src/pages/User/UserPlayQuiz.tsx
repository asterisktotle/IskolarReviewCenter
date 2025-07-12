import { Box, Button, Heading, VStack, Text } from '@chakra-ui/react';
import PlayQuiz from '../../components/PlayQuiz';
import QuizStore, { QuizProfile } from '../../store/quizStore';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useAuthStore from '../../store/authStore';



// Responsibility
// It fetches quizzes and display them

const UserPlayQuiz = () => {
	const { fetchQuizById, isLoading } = QuizStore();
	const { userData } = useAuthStore();
	const [quizData, setQuizData] = useState<QuizProfile>();
	// const [errorMessage, setErrorMessage] = useState(null || '')

	// const [quizData, setQuizData] = useState()
	const { quizId } = useParams();

	//  fetch the quiz using quizId url params so that it can be fetch if the user refresh the page
	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetchQuizById(quizId as string);

				if (!response || !response.data) {
					// setErrorMessage( 'Quiz not found');
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
				{quizData && quizData._id && userData?.userId && (
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
