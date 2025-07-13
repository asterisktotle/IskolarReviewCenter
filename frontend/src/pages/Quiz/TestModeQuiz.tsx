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
	Button,
	useToast,

} from '@chakra-ui/react';
import {  useEffect, useState } from 'react';
import useCountdownTimer from '../../hooks/useCountdownTimer';
import QuizStore, {
	AnswerState,
	QuizFormEvaluation,
} from '../../store/quizStore';
import { QuestionData } from '../../hooks/useQuestionMaker';
const TestModeQuiz = ({ userId, quizId ,questions, timeLimit}: 
    { userId: string,
      quizId: string,
      questions: any, 
      timeLimit: number}) => {
    const [answers, setAnswers] = useState<AnswerState[]>([]);
	const toast = useToast();
	const { evaluateSubmittedQuiz, isLoading} = QuizStore();

	// TIMER COMPONENT	
	const { formatted: timer, isTimeUp , clearTimer} = useCountdownTimer(timeLimit);
	useEffect(() => {
		if(isTimeUp && timeLimit){
			// Auto submit if timer is zero
			handleSubmit();
		}
	}, [isTimeUp])
	
	//ACTIONS
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
		answers?.find((ans) => ans.questionId === questionId)?.selectedOption || '';

	const getTextAnswer = (questionId: string) =>
		answers?.find((ans) => ans.questionId === questionId)?.textAnswer || '';

	const handleSubmit = async () => {
		clearTimer(); // stop the timer
		const quizFormRequest: QuizFormEvaluation = {
			userId,
			quizId,
			answers,
		};
		
		try {
			const isEvaluated = await evaluateSubmittedQuiz(quizFormRequest);

			if (!isEvaluated) {
				toast({
					title: 'Failed to submit quiz',
					description: 'Please try again later.',
					status: 'error',
					duration: 5000,
					isClosable: true,
				});
				return;
			}
			toast({
				title: 'Quiz submitted successfully',
				duration: 5000,
				isClosable: true,
				status: 'success',
			});
		} catch (error) {
			console.error('Error submitting quiz:', error);
			toast({
				title: 'Failed to submit quiz',
				description: 'Please try again later.',
				status: 'error',
				duration: 5000,
				isClosable: true,
			});
		}
	};


  return (
 
    <FormControl onSubmit={handleSubmit}>
					{/* Display each questions for test mode */}
					 <Box
						position="sticky" 
						top={0} 
						zIndex={10} 
						bg="whiteAlpha.300" 
						padding={2}
						rounded="full"
						boxShadow="md"
						textAlign="center"
						mb={4}
						>
						<Text fontWeight="bold" color={isTimeUp ? "red.500" : "white"}>
							Time Limit: {timeLimit ? timer: "Unlimited"}
						</Text>
						</Box>
					{questions.map((question : QuestionData, index: number) => (
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
								<Text
									fontWeight="semibold"
									color="black"
									mb={2}
									lineHeight="1.5"
								>
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
													<Box key={choice._id} as="label" cursor="pointer">
														<Flex
															align="center"
															p={2}
															borderRadius="md"
															border="1px"
															borderColor={isSelected ? 'blue.300' : 'gray.200'}
															bg={isSelected ? 'blue.50' : 'gray.50'}
															_hover={{
																bg: isSelected ? 'blue.100' : 'gray.100',
																borderColor: isSelected
																	? 'blue.400'
																	: 'gray.300',
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
						</VStack>
					))}

					<Flex justify="center" mt={6} w={'full'}>
						<Button disabled={isLoading} onClick={() => handleSubmit()}>
							Submit Answer
						</Button>
					</Flex>
				</FormControl>
  
  )
}

export default TestModeQuiz