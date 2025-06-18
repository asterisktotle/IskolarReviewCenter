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
} from '@chakra-ui/react';
import { useState } from 'react';

const PlayQuiz = ({ question, questionNumber, totalQuestions }) => {
	const [selectedAnswer, setSelectedAnswer] = useState('');
	const [shortAnswer, setShortAnswer] = useState('');

	return (
		<Container maxW="2xl" py={6}>
			<VStack spacing={6} align="stretch">
				{/* Question Header */}
				<HStack justify="space-between" align="center">
					<Badge
						variant="subtle"
						colorScheme="whiteAlpha"
						fontSize="sm"
						px={3}
						py={1}
						borderRadius="md"
					>
						Question {questionNumber} of {totalQuestions}
					</Badge>
					<Text fontSize="sm" color="gray.500" fontWeight="medium">
						{question.points} {question.points === 1 ? 'point' : 'points'}
					</Text>
				</HStack>

				{/* Question Card */}
				<Box bg="white" borderRadius="lg" p={6} border="1px">
					{/* Question Text */}
					<Text fontWeight="semibold" color="black" mb={6} lineHeight="1.5">
						{question.questionText}
					</Text>

					<FormControl>
						{/* Multiple Choice Options */}
						{question.type === 'multiple-choice' ? (
							<RadioGroup value={selectedAnswer} onChange={setSelectedAnswer}>
								<VStack spacing={3} align="stretch">
									{question.options?.map((choice, index) => {
										const isSelected = selectedAnswer === choice.id.toString();

										return (
											<Box key={choice.id} as="label" cursor="pointer">
												<Flex
													align="center"
													p={4}
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
														value={choice.id.toString()}
														colorScheme="blue"
														mr={3}
													/>

													<Text fontSize="md" color="gray.700" flex="1">
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
										value={shortAnswer}
										onChange={(e) => setShortAnswer(e.target.value)}
										size="md"
										borderRadius="md"
										border="1px"
										borderColor="gray.300"
										_focus={{
											borderColor: 'blue.400',
											boxShadow: '0 0 0 1px var(--chakra-colors-blue-400)',
										}}
										textColor={'black'}
										bg="white"
										p={3}
									/>
								</VStack>
							)
						)}
					</FormControl>
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
		</Container>
	);
};

export default PlayQuiz;
