import {
	FormControl,
	Flex,
	Box,
	Text,
	VStack,
	HStack,
	Badge,
} from '@chakra-ui/react';

import { MdCheckCircle, MdCancel } from 'react-icons/md';
import QuizStore, { QuizAttemptResult } from '../../store/quizStore';
import { QuestionData } from '../../hooks/useQuestionMaker';

const EvaluatedQuiz = ({quizAttemptResults, questions} : {quizAttemptResults: QuizAttemptResult, questions: QuestionData[] }) => {
	// const {setQuizAttemptResults} = QuizStore()
	// const handleFinishedQuiz = () => {
	// 	// Clear quiz attempt result
		
	// }

	return (
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
		{/* Display each questions with answers */}
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
												<b>{question.correctAnswer}</b>
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
  )
}

export default EvaluatedQuiz