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
import {  useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QuizStore, {
	AnswerState,
	QuestionData,
	QuizFormEvaluation,
} from '../store/quizStore';
import { MdCheckCircle, MdCancel } from 'react-icons/md';

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
	// const navigate = useNavigate();
	const toast = useToast();
	const { evaluateSubmittedQuiz, isLoading, quizAttemptResults } = QuizStore();

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
		<Container
			maxW={{ base: '100%', md: '2xl' }}
			py={5}
			px={{ base: 2, md: 0 }}
		>
			{quizAttemptResults && quizAttemptResults.answers.length ? (
				<>
					{/* Result Summary */}
					<VStack spacing={3} mb={6} align="center">
						<Badge
							colorScheme={quizAttemptResults.passed ? 'green' : 'red'}
							fontSize="lg"
							px={4}
							py={2}
							borderRadius="md"
						>
							{quizAttemptResults.passed ? 'Passed' : 'Failed'}
						</Badge>
						<Text fontWeight="bold" fontSize="xl">
							Score: {quizAttemptResults.currentScore} /{' '}
							{questions.reduce((acc, q) => acc + (q.points || 1), 0)}
						</Text>
						<Text fontSize="md" color="gray.500">
							Percentage:{' '}
							{quizAttemptResults.currentPercentageScore.toFixed(1)}%
						</Text>
					</VStack>
					<FormControl>
						{quizAttemptResults.answers.map((ans, index) => {
							const question = questions.find((q) => q._id === ans.questionId);
							if (!question) return null;
							const isCorrect = ans.isCorrect;
							return (
								<VStack
									key={ans.questionId}
									spacing={4}
									mb={5}
									align="stretch"
									w="full"
								>
									<HStack justify="space-between" align="center">
										<Badge fontSize="sm" px={3} py={1} borderRadius="md">
											Question {index + 1} of{' '}
											{quizAttemptResults.answers.length}
										</Badge>
										<Text fontSize="sm" color="gray.400" fontWeight="medium">
											{question.points}{' '}
											{question.points === 1 ? 'point' : 'points'}
										</Text>
									</HStack>
									<Box
										bg="white"
										borderRadius="lg"
										p={{ base: 2, md: 4 }}
										border="1px"
										w="full"
										boxShadow="sm"
									>
										<HStack mb={2} align="center">
											<Text
												fontWeight="semibold"
												color="black"
												flex="1"
												lineHeight="1.5"
											>
												{question.questionText}
											</Text>
											{isCorrect ? (
												<MdCheckCircle
													color="#38A169"
													size={24}
													title="Correct"
												/>
											) : (
												<MdCancel color="#E53E3E" size={24} title="Incorrect" />
											)}
										</HStack>
										{question.type === 'multiple-choice' ? (
											<VStack spacing={1} align="stretch">
												{question.options.map((option) => {
													// User's selected option
													const isUserAnswer =
														option._id === ans.selectedOption;
													// The correct option
													const isCorrectOption = option.isCorrect;
													let bg = 'gray.50';
													let borderColor = 'gray.200';
													let icon = null;
													if (isCorrectOption) {
														bg = 'green.100';
														borderColor = 'green.400';
														icon = (
															<MdCheckCircle
																color="#38A169"
																size={18}
																style={{ marginRight: 4 }}
															/>
														);
													}
													if (isUserAnswer && !isCorrectOption) {
														bg = 'red.100';
														borderColor = 'red.400';
														icon = (
															<MdCancel
																color="#E53E3E"
																size={18}
																style={{ marginRight: 4 }}
															/>
														);
													}
													return (
														<Flex
															key={option._id}
															align="center"
															p={2}
															borderRadius="md"
															border="1px"
															borderColor={borderColor}
															bg={bg}
															transition="all 0.2s"
															w="full"
														>
															{icon}
															<Text
																color={
																	isUserAnswer
																		? isCorrectOption
																			? 'green.700'
																			: 'red.700'
																		: 'gray.700'
																}
																fontWeight={isCorrectOption ? 'bold' : 'normal'}
																fontSize="sm"
																flex="1"
															>
																{option.text}
															</Text>
															{isUserAnswer && !isCorrectOption && (
																<Text ml={2} color="red.500" fontSize="xs">
																	Your answer
																</Text>
															)}
															{isCorrectOption && (
																<Badge ml={2} colorScheme="green">
																	Correct
																</Badge>
															)}
														</Flex>
													);
												})}
											</VStack>
										) : (
											<VStack spacing={2} align="stretch">
												<Box
													p={2}
													borderRadius="md"
													border="1px"
													bg={ans.isCorrect ? 'green.100' : 'red.100'}
													borderColor={ans.isCorrect ? 'green.400' : 'red.400'}
													w="full"
													display="flex"
													alignItems="center"
												>
													{ans.isCorrect ? (
														<HStack>
															<MdCheckCircle color="#38A169" size={18} />
															<Text
																color="green.700"
																fontWeight="bold"
																fontSize="sm"
															>
																Your answer: {ans.textAnswer}
															</Text>
														</HStack>
													) : (
														<HStack>
															<MdCancel color="#E53E3E" size={18} />
															<Text
																color="red.700"
																fontWeight="bold"
																fontSize="sm"
															>
																Your answer: {ans.textAnswer}
															</Text>
														</HStack>
													)}
												</Box>
												{/* Show correct answer if user was wrong */}
												{!ans.isCorrect && question.type === 'short-answer' && (
													<Box
														p={2}
														borderRadius="md"
														border="1px"
														bg="green.50"
														borderColor="green.200"
														w="full"
													>
														<Text color="green.700" fontSize="sm">
															Correct answer:{' '}
															<b>{(question as any).correctAnswer}</b>
														</Text>
													</Box>
												)}
											</VStack>
										)}
									</Box>
								</VStack>
							);
						})}
					</FormControl>
				</>
			) : (
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
			)}
		</Container>
	);
};

export default PlayQuiz;
