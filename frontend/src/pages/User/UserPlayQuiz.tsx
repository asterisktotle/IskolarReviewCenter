import { Box, Heading, Text, VStack } from '@chakra-ui/react';
import PlayQuiz from '../../components/PlayQuiz';
import QuizStore from '../../store/quizStore';
import { useParams } from 'react-router-dom';
//TODO
//TEST THE PLAY QUIZ BY COMPARING ITS USE IN THE ADMIN TEST
// PLAYQUIZ RENDERS WHITE 
const UserPlayQuiz = () => {
	const { selectedQuiz, isLoading } = QuizStore();
	const { id } = useParams()

	//  fetch the quiz using quizId url params so that it can be fetch if the user refresh the page

	if (isLoading) {
		return <Box>Please wait..</Box>;
	}
	// fetch the quiz using id


	// console.log('selected quiz user playquiz: ', selectedQuiz.map(q => q.questions).map(q => console.log('question:',q)));

	const quizQuestions = selectedQuiz.map((q) => q.questions)
	// console.log('quizQ:', quizQuestions.map(q => console.log('question mapped:', q)))

	return (
		<VStack spacing={6} align="stretch">
			<Box textAlign="center">
				<Heading size="md" mb={2}>
					Quiz Preview
				</Heading>
				<Text color="gray.200">See how your quiz will look to students</Text>
			</Box>

			{selectedQuiz && selectedQuiz.length > 0 && (
				<VStack spacing={6} align="stretch">
					{/* {quizQuestions.map((item, index) => (
						<PlayQuiz
							key={index}
							question= {item}
							questionNumber={index + 1}
							totalQuestions={quizQuestions.length}
						/>
					))} */}
					{quizQuestions.map((item) => item.map((q, i) => 
					<PlayQuiz question={q} questionNumber={i + 1} totalQuestions={item.length} key={i} /> )
					  )}
				</VStack>
			)}
		</VStack>
	);
};
export default UserPlayQuiz;
