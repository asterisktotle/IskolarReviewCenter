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
	Spinner,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QuizStore, { AnswerState, QuestionData, QuizFormEvaluation } from '../store/quizStore';
import { set } from 'react-hook-form';


const PlayQuiz = ({
	questions,
	userId,
	quizId,
}: {
	questions: QuestionData[];
	userId: string;
	quizId: string;
}) => {
	const [answers, setAnswers] = useState<AnswerState[]>([]);
	const [spinner, setSpinner ] = useState(false)
	// const navigate = useNavigate();
	const toast = useToast()
	const {evaluateSubmittedQuiz, isLoading} = QuizStore()

	const updateAnswer = (
		questionId: string,
		selectedOption?: string,
		textAnswer?: string
	) => {
		setAnswers((prev = []) => {
			const filtered = prev.filter((ans) => ans.questionId !== questionId);

			return [
				...filtered,
				{
					questionId,
					...(selectedOption ? { selectedOption } : {}),
					...(textAnswer ? { textAnswer } : {}),
				},
			];
		});
	};

	const getSelectedOption = (questionId: string) =>
		answers?.find((ans) => ans.questionId === questionId)?.selectedOption||
		'';

	const getTextAnswer = (questionId: string) =>
		answers?.find((ans) => ans.questionId === questionId)?.textAnswer || '';

	const handleSubmit = () => {
		const quizFormRequest : QuizFormEvaluation = {
			userId,
			quizId,
			answers,
		};


		try {
			setSpinner(true)
			
			setTimeout( async() => {

				const response = await evaluateSubmittedQuiz(quizFormRequest)
				if(!response.success){
					toast({
					title: 'Failed to submit quiz',
					description: 'Please try again later.',
					status: 'error',
					duration: 5000,
					isClosable: true,
				});
				setSpinner(false)
				return
				}
	
				const { data } = response;
				setSpinner(false)
				console.log('quiz result: ', data);

			}, 5000)
			


		}catch (error){
			console.error('Error submitting quiz:', error);
			toast({
				title: 'Failed to submit quiz',
				description: 'Please try again later.',
				status: 'error',
				duration: 5000,
				isClosable: true,
			});
			setSpinner(false)
		
		}
		
		
		
	};

	 if (spinner) {
        return (
            <Flex justify="center" align="center" minH="300px">
                <Spinner size="xl" thickness="4px" color="blue.400" />
                <Text ml={4} fontSize="lg">Evaluating your answers...</Text>
            </Flex>
        );
    }

	return (
			

		<Container maxW="2xl" py={5}>
			<FormControl onSubmit={handleSubmit}>
				{questions.map((question, index) => (
					<VStack key={question._id} spacing={6} mb={5} align="stretch">
						{/* Question Header */}
						<HStack justify="space-between" align="center">
							<Badge fontSize="sm" px={3} py={1} borderRadius="md">
								Question {index + 1} of {questions.length}
							</Badge>
							<Text fontSize="sm" color="gray.300" fontWeight="medium">
								{question.points} {question.points === 1 ? 'point' : 'points'}
							</Text>
						</HStack>

						{/* Question Card */}
						<Box
							bg="white"
							borderRadius="lg"
							p={4}
							w={'-moz-min-content'}
							border="1px"
						>
							{/* Question Text */}
							<Text fontWeight="semibold" color="black" mb={2} lineHeight="1.5">
								{question.questionText}
							</Text>

							{/* Multiple Choice Options */}
							{question.type === 'multiple-choice' ? (
								<RadioGroup
									value={getSelectedOption(String(question._id))}
									onChange={(value) =>
										updateAnswer(String(question._id), value)
									}
								>
									<VStack spacing={1} align="stretch">
										{question.options?.map((choice) => {
											const isSelected =
												getSelectedOption(String(question._id)) ===
												String(choice._id);

											return (
												<Box key={choice.id} as="label" cursor="pointer">
													<Flex
														align="center"
														p={2}
														borderRadius="md"
														border="1px"
														borderColor={isSelected ? 'blue.300' : 'gray.200'}
														bg={isSelected ? 'blue.50' : 'gray.50'}
														_hover={{
															bg: isSelected ? 'blue.100' : 'gray.100',
															borderColor: isSelected ? 'blue.400' : 'gray.300',
														}}
														transition="all 0.2s ease"
													>
														<Radio
															value={choice._id}
															colorScheme="blue"
															mr={3}
														/>

														<Text fontSize="sm" color="gray.700" flex="1">
															{choice.text}
														</Text>
													</Flex>
												</Box>
											);
										})}
									</VStack>
								</RadioGroup>
							) : (
								/* Short Answer Input */
								question.type === 'short-answer' && (
									<VStack spacing={3}>
										<Input
											placeholder="Type your answer here..."
											value={getTextAnswer(String(question._id))}
											onChange={(e) =>
												updateAnswer(
													String(question._id),
													undefined,
													e.target.value
												)
											}
											size="sm"
											borderRadius="md"
											border="1px"
											borderColor="gray.500"
											textColor={'black'}
											bg="white"
											p={2}
										/>
									</VStack>
								)
							)}
						</Box>

						{/* ILL ADD THIS IF I WANT  */}
						{/* Progress Bar
				<Box>
					<HStack justify="space-between" mb={2}>
						<Text fontSize="xs" color="gray.500">
							Progress
						</Text>
						<Text fontSize="xs" color="gray.500">
							{questionNumber}/{totalQuestions}
						</Text>
					</HStack>
					<Box w="full" h="2" bg="gray.200" borderRadius="full">
						<Box
							h="full"
							bg="blue.400"
							borderRadius="full"
							transition="width 0.3s ease"
							w={`${(questionNumber / totalQuestions) * 100}%`}
						/>
					</Box>
				</Box> */}
					</VStack>
				))}

				<Flex justify="center" mt={6} w={'full'}>
					<Button disabled={isLoading} onClick={handleSubmit}>Submit Answer</Button>
				</Flex>
			</FormControl>
		</Container>
	);
};

export default PlayQuiz;
