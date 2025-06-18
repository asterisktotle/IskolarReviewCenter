import {
	Container,
	FormControl,
	VStack,
	Editable,
	EditableInput,
	EditablePreview,
	FormLabel,
	RadioGroup,
	Stack,
	Radio,
	Input,
	Select,
	HStack,
	Button,
	Flex,
	Icon,
	IconButton,
	NumberInput,
	NumberInputField,
	Tabs,
	TabList,
	TabPanels,
	Tab,
	TabPanel,
	Box,
	Text,
	Divider,
	Badge,
	Card,
	CardHeader,
	CardBody,
	Heading,
	useColorModeValue,
} from '@chakra-ui/react';
import { AddIcon, CloseIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { MdPlayArrow } from 'react-icons/md';
import { useEffect, useState } from 'react';
import useQuestionMaker, { QuestionOption } from '../../hooks/useQuestionMaker';
import { QuestionData } from '../../hooks/useQuestionMaker';
import QuizStore from '../../store/quizStore';
import parseOptions from '../../utils/parserOptions';
import convertQuestionType from '../../utils/converQuestionType';
import PlayQuiz from '../../components/PlayQuiz';

const AdminTests = () => {
	const {
		addQuestion,
		questions,
		removeQuestion,
		updateQuestion,
		quizProfile,
		setQuizProfile,
	} = useQuestionMaker();

	const { fetchQuizParams } = QuizStore();
	const [fetchedQuestions, setFetchedQuestions] = useState([]);
	const [tabIndex, setTabIndex] = useState(0);

	// Color mode values
	const cardBg = useColorModeValue('white', 'gray.800');
	const borderColor = useColorModeValue('gray.200', 'gray.600');

	const handleChangeQuizProfile = (field: string, value: string) => {
		setQuizProfile({
			...quizProfile,
			[field]: value,
		});
	};

	const handleUpdateOptions = (
		questionId: number,
		optionId: number,
		updatedOption: string
	) => {
		const currentQuestion = questions.find((q) => q.id === questionId);
		if (!currentQuestion) {
			return console.log(`Question with ID ${questionId} does not exist`);
		}

		if (currentQuestion.type !== 'multiple-choice') {
			return console.log(
				`Question with ID ${questionId} is not multiple-choice`
			);
		}

		let formattedOptions: QuestionOption[];

		if (updatedOption.match(/[\n\r]+/)) {
			formattedOptions = parseOptions(updatedOption);
		} else {
			formattedOptions = currentQuestion.options.map((option) =>
				option.id === optionId ? { ...option, text: updatedOption } : option
			);
		}

		const updatedQuestion: QuestionData = {
			...currentQuestion,
			options: formattedOptions,
		};
		updateQuestion(questionId, updatedQuestion);
	};

	const handleUpdateShortAnswer = (
		questionId: number,
		shortAnswerValue: string
	) => {
		const currentQuestion = questions.find((q) => q.id === questionId);

		if (!currentQuestion) {
			return console.log(`Question with ID ${questionId} does not exist`);
		}

		if (currentQuestion.type !== 'short-answer') {
			return console.log(`Question with ID ${questionId} is not short-answer`);
		}

		const updatedQuestion = {
			...currentQuestion,
			correctAnswer: shortAnswerValue,
		};

		updateQuestion(questionId, updatedQuestion);
	};

	const handleQuestionType = (
		questionId: number,
		questionType: 'multiple-choice' | 'short-answer'
	) => {
		const currentQuestion = questions.find((q) => q.id === questionId);

		if (!currentQuestion) {
			return console.log(`Question with ID ${questionId} does not exist`);
		}

		const updatedQuestion = convertQuestionType(currentQuestion, questionType);
		updateQuestion(questionId, updatedQuestion);
	};

	const handleAddQuestionButton = () => {
		const baseQuestion: QuestionData = {
			id: Date.now(),
			questionText: 'Untitled question',
			type: 'multiple-choice',
			options: [{ text: `Option 1`, isCorrect: true, id: 1 }],
			points: 1,
		};

		addQuestion(baseQuestion);
	};

	const handleRemoveQuestion = (questionId: number) => {
		if (questions.length === 0) {
			return null;
		} else {
			removeQuestion(questionId);
		}
	};

	const handleAddOption = (questionId: number) => {
		const currentQuestion = questions.find((q) => q.id === questionId);
		if (!currentQuestion) {
			return console.log(`Question with ID ${questionId} does not exist`);
		}
		if (currentQuestion.type !== 'multiple-choice') {
			return console.log(
				`Question with ID ${questionId} is not multiple-choice`
			);
		}

		const optionLength = currentQuestion.options.length;

		const newOption = {
			id: optionLength + 1,
			text: `Option ${optionLength + 1}`,
			isCorrect: false,
		};

		const updatedQuestion: QuestionData = {
			...currentQuestion,
			options: [...currentQuestion.options, newOption],
		};

		updateQuestion(questionId, updatedQuestion);
	};

	const handleRemoveChoices = (questionId: number, optionId: number) => {
		const updatedQuestion = questions.find((q) => q.id === questionId);
		if (!updatedQuestion) {
			return console.log(`Question with ID ${questionId} does not exist`);
		}

		if (updatedQuestion.type !== 'multiple-choice') {
			return console.log(
				`Question with ID ${questionId} is not multiple-choice`
			);
		}

		const newOptions = updatedQuestion.options.filter(
			(option) => option.id !== optionId
		);

		const question = {
			...updatedQuestion,
			options: [...newOptions],
		};

		updateQuestion(questionId, question);
	};

	const handleCorrectOption = (questionId: number, optionId: number) => {
		const currentQuestion = questions.find((q) => q.id === questionId);

		if (!currentQuestion) {
			return console.log(`Question with ID ${questionId} does not exist`);
		}
		if (currentQuestion.type !== 'multiple-choice') {
			return console.log(
				`Question with ID ${questionId} is not multiple-choice`
			);
		}

		const correctOption = currentQuestion.options.map((option) => {
			if (option.id === optionId) {
				return {
					...option,
					isCorrect: true,
				};
			} else
				return {
					...option,
					isCorrect: false,
				};
		});

		const updatedQuestion: QuestionData = {
			...currentQuestion,
			options: [...correctOption],
		};
		updateQuestion(questionId, updatedQuestion);
	};

	useEffect(() => {
		const getQuiz = async () => {
			try {
				const quiz = await fetchQuizParams({ title: 'Test Quiz' });

				if (quiz) {
					const quizItems = quiz.questions;
					setFetchedQuestions(quizItems);
				} else {
					console.log('Quiz failed to fetch');
				}
			} catch (error) {
				console.error('Error fetching quiz:', error);
			}
		};
		getQuiz();
	}, [fetchQuizParams]);

	const QuestionEditor = (question: QuestionData) => {
		return (
			<Card key={question.id} mb={4} bg={cardBg} borderColor={borderColor}>
				<CardBody>
					<VStack spacing={4} align="stretch">
						{/* Question Header */}
						<HStack justify="space-between">
							<Badge colorScheme="blue" px={2} py={1}>
								Question {questions.indexOf(question) + 1}
							</Badge>
							<HStack spacing={2}>
								<Select
									value={question.type}
									onChange={(e) =>
										handleQuestionType(question.id, e.target.value)
									}
									size="sm"
									maxW="200px"
								>
									<option value={'multiple-choice'}>Multiple Choice</option>
									<option value={'short-answer'}>Short Answer</option>
								</Select>
								<IconButton
									size="sm"
									colorScheme="red"
									onClick={() => handleRemoveQuestion(question.id)}
									icon={<DeleteIcon />}
									aria-label="Delete question"
								/>
							</HStack>
						</HStack>

						{/* Question Text */}
						<FormControl>
							<FormLabel fontSize="sm" fontWeight="medium">
								Question Text
							</FormLabel>
							<Editable
								defaultValue={question.questionText}
								onSubmit={(value) =>
									updateQuestion(question.id, {
										...question,
										questionText: value,
									})
								}
							>
								<EditablePreview
									p={3}
									borderRadius="md"
									border="1px"
									borderColor={borderColor}
									minH="40px"
									_hover={{ bg: 'gray.50' }}
								/>
								<EditableInput p={3} />
							</Editable>
						</FormControl>

						{/* Question Options */}
						{question.type === 'multiple-choice' ? (
							<FormControl>
								<HStack justify="space-between" mb={2}>
									<FormLabel fontSize="sm" fontWeight="medium" mb={0}>
										Answer Options
									</FormLabel>
									<Button
										size="sm"
										leftIcon={<AddIcon />}
										onClick={() => handleAddOption(question.id)}
										colorScheme="green"
									>
										Add Option
									</Button>
								</HStack>
								<VStack spacing={2} align="stretch">
									{question.options?.map((choice, index) => (
										<HStack key={choice.id} spacing={2}>
											<Radio
												isChecked={choice.isCorrect}
												onChange={() =>
													handleCorrectOption(question.id, choice.id)
												}
												colorScheme="green"
											/>
											<Input
												value={choice.text}
												onChange={(e) =>
													handleUpdateOptions(
														question.id,
														choice.id,
														e.target.value
													)
												}
												placeholder={`Option ${index + 1}`}
												size="sm"
											/>
											<IconButton
												size="sm"
												colorScheme="red"
												variant="ghost"
												icon={<CloseIcon />}
												onClick={() =>
													handleRemoveChoices(question.id, choice.id)
												}
												aria-label="Remove option"
											/>
										</HStack>
									))}
								</VStack>
							</FormControl>
						) : (
							<FormControl>
								<FormLabel fontSize="sm" fontWeight="medium">
									Correct Answer
								</FormLabel>
								<Input
									onChange={(e) =>
										handleUpdateShortAnswer(question.id, e.target.value)
									}
									placeholder="Enter the correct answer"
									size="sm"
								/>
							</FormControl>
						)}

						{/* Points */}
						<FormControl maxW="100px">
							<FormLabel fontSize="sm" fontWeight="medium">
								Points
							</FormLabel>
							<NumberInput
								size="sm"
								defaultValue={question.points}
								min={1}
								onChange={(value) =>
									updateQuestion(question.id, {
										...question,
										points: parseInt(value) || 1,
									})
								}
							>
								<NumberInputField />
							</NumberInput>
						</FormControl>
					</VStack>
				</CardBody>
			</Card>
		);
	};

	return (
		<Container maxW="6xl" py={6}>
			<VStack spacing={6} align="stretch">
				{/* Header */}
				<Box textAlign="center">
					<Heading size="lg" mb={2}>
						Quiz Administration
					</Heading>
					<Text color="gray.600">Create and manage your quizzes</Text>
				</Box>

				{/* Tabs */}
				<Tabs index={tabIndex} onChange={setTabIndex} variant="enclosed">
					<TabList>
						<Tab>
							<Flex align="center" gap={2}>
								<EditIcon />
								Create Quiz
							</Flex>
						</Tab>
						<Tab>
							<Flex align="center" gap={2}>
								<Icon as={MdPlayArrow} />
								Preview Quiz
							</Flex>
						</Tab>
					</TabList>

					<TabPanels>
						{/* Create Quiz Tab */}
						<TabPanel px={0}>
							<VStack spacing={6} align="stretch">
								{/* Quiz Settings */}
								<Card bg={cardBg} borderColor={borderColor}>
									<CardHeader>
										<Heading size="md">Quiz Settings</Heading>
									</CardHeader>
									<CardBody>
										<VStack spacing={4} align="stretch">
											<FormControl>
												<FormLabel>Quiz Title</FormLabel>
												<Editable
													defaultValue={quizProfile.title}
													onChange={(value) =>
														handleChangeQuizProfile('title', value)
													}
												>
													<EditablePreview
														p={3}
														borderRadius="md"
														border="1px"
														borderColor={borderColor}
													/>
													<EditableInput p={3} />
												</Editable>
											</FormControl>

											<HStack spacing={4} align="start">
												<FormControl>
													<FormLabel>Subject</FormLabel>
													<RadioGroup
														onChange={(value) =>
															handleChangeQuizProfile('subject', value)
														}
														defaultValue="mesl"
													>
														<Stack direction="row" spacing={4}>
															<Radio value="mesl">MESL</Radio>
															<Radio value="pipe">PIPE</Radio>
															<Radio value="mdsp">MDSP</Radio>
														</Stack>
													</RadioGroup>
												</FormControl>

												<FormControl>
													<FormLabel>Time Limit (minutes)</FormLabel>
													<NumberInput
														onChange={(value) =>
															handleChangeQuizProfile('timeLimit', value)
														}
														maxW="150px"
													>
														<NumberInputField
															placeholder="0"
															defaultValue={0}
														/>
													</NumberInput>
												</FormControl>
											</HStack>

											<FormControl>
												<FormLabel>Test Category</FormLabel>
												<RadioGroup
													defaultValue="terms"
													onChange={(value) =>
														handleChangeQuizProfile('category', value)
													}
												>
													<Stack
														direction={{ base: 'column', md: 'row' }}
														spacing={4}
													>
														<Radio value="terms">Terms</Radio>
														<Radio value="weekly-test">Weekly Exam</Radio>
														<Radio value="take-home-test">Take Home Exam</Radio>
														<Radio value="pre-board-exam">Pre-board Exam</Radio>
													</Stack>
												</RadioGroup>
											</FormControl>

											<HStack spacing={3}>
												<Button colorScheme="blue">Save Draft</Button>
												<Button colorScheme="green">Publish Quiz</Button>
												<Button variant="outline">Scan PDF</Button>
											</HStack>
										</VStack>
									</CardBody>
								</Card>

								<Divider />

								{/* Questions Section */}
								<Box>
									<HStack justify="space-between" mb={4}>
										<Heading size="md">Questions</Heading>
										<Button
											leftIcon={<AddIcon />}
											onClick={handleAddQuestionButton}
											colorScheme="blue"
										>
											Add Question
										</Button>
									</HStack>

									{questions.length === 0 ? (
										<Card bg={cardBg} borderColor={borderColor}>
											<CardBody textAlign="center" py={10}>
												<Text color="gray.500" mb={4}>
													No questions added yet
												</Text>
												<Button
													leftIcon={<AddIcon />}
													onClick={handleAddQuestionButton}
													colorScheme="blue"
												>
													Add Your First Question
												</Button>
											</CardBody>
										</Card>
									) : (
										<VStack spacing={4} align="stretch">
											{questions.map((q) => QuestionEditor(q))}
										</VStack>
									)}
								</Box>
							</VStack>
						</TabPanel>

						{/* Preview Quiz Tab */}
						<TabPanel px={0}>
							<VStack spacing={6} align="stretch">
								<Box textAlign="center">
									<Heading size="md" mb={2}>
										Quiz Preview
									</Heading>
									<Text color="gray.600">
										See how your quiz will look to students
									</Text>
								</Box>

								{fetchedQuestions && fetchedQuestions.length > 0 ? (
									<VStack spacing={6} align="stretch">
										{fetchedQuestions.map((item, index) => (
											<PlayQuiz
												key={item._id}
												question={item}
												questionNumber={index + 1}
												totalQuestions={fetchedQuestions.length}
											/>
										))}
									</VStack>
								) : (
									<Card bg={cardBg} borderColor={borderColor}>
										<CardBody textAlign="center" py={10}>
											<Text color="gray.500" mb={4}>
												No quiz available for preview
											</Text>
											<Button onClick={() => setTabIndex(0)} colorScheme="blue">
												Create Questions First
											</Button>
										</CardBody>
									</Card>
								)}
							</VStack>
						</TabPanel>
					</TabPanels>
				</Tabs>
			</VStack>
		</Container>
	);
};

export default AdminTests;
