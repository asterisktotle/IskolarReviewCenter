import { Box, Button, Heading,  VStack } from '@chakra-ui/react';
import PlayQuiz from '../../components/PlayQuiz';
import QuizStore, { QuizProfile } from '../../store/quizStore';
import {  useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';



// TODO: 

//PRIOR
//1. submit the answer then show the evaluated answer, and user score
//2. if the user exit the quiz, then the quiz will be auto submitted,
//3. Or if the user exit the quiz, it will track the users answer but not evaluated -- must do on backend
//3. Display the timer if there is a timer, then auto submit,

// LEAST FEATURE
// 1. Display the timer if there is a timer, then auto submit,

const UserPlayQuiz = () => {
	const { fetchQuizById, isLoading } = QuizStore();
	const [quizData, setQuizData] = useState<QuizProfile>()
	// const [errorMessage, setErrorMessage] = useState(null || '')

	// const [quizData, setQuizData] = useState()
	const { quizId } = useParams()

	//  fetch the quiz using quizId url params so that it can be fetch if the user refresh the page
	useEffect( () => {
		  const fetchData = async () => {
			try{
				const {data} = await fetchQuizById(quizId as string);

				if(!data){
					// setErrorMessage( 'Quiz not found');
				console.error('Error fetching quiz')

					return;
				}


				setQuizData(data);
				// setErrorMessage(null);
				console.log('quiz titles: ', quizData.title )


			}catch (err){
				console.error('Error fetching quiz')
				// setErrorMessage('Error fetching quiz data');
			}

    };
    fetchData();


}, [fetchQuizById, quizId])

const handleButton = () => {
	console.log('quiz submitted')
}

	if (isLoading) {
		return <Box>Please wait..</Box>;
	}
	


	return (

		   <VStack spacing={6} align="stretch" px={4}>
      <Box textAlign="center">
        <Heading size="md" mb={2}>
          {/* {quizData.title} */}
        </Heading>
        {/* <Text color="gray.200">{quizData.title}</Text> */}
      </Box>

      <VStack spacing={6} align="stretch">
        {quizData?.questions?.map((q, i) => (
          <PlayQuiz 
            key={i} 
            question={q} 
            questionNumber={i + 1} 
            totalQuestions={quizData.questions.length}
          />
        ))}
        
        <Box display="flex" justifyContent="center">
          <Button 
            w={{ base: 'full', sm: 'sm' }} 
            onClick={handleButton}
          >
            Submit 
          </Button>
        </Box>
      </VStack>
    </VStack>
  );
	
};
export default UserPlayQuiz;
