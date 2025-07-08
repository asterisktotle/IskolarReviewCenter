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
	useToast,

} from '@chakra-ui/react';
import { AddIcon, CloseIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { MdPlayArrow, MdFormatListBulleted, MdBook } from 'react-icons/md';
import { useEffect, useState } from 'react';
import { QuestionOption } from '../../hooks/useQuestionMaker';
import { QuestionData } from '../../hooks/useQuestionMaker';
import QuizStore from '../../store/quizStore';
import parseOptions from '../../utils/parserOptions';
import convertQuestionType from '../../utils/converQuestionType';
import PlayQuiz from '../../components/PlayQuiz';

import {SubjectQuizTab } from '../../components/QuizList';

const AdminTests = () => {
	const {
		fetchQuizParams,
		quizzesFetch,
		questions,
		quizProfile,
		setQuizProfile,
		removeQuestion,
		updateQuestion,
		addQuestions,
		publishQuiz, 
		isLoading,
		selectedQuiz
	} = QuizStore();
	const [tabIndex, setTabIndex] = useState(0);
	const [tabIndexQuizzes, setTabIndexQuizzes] = useState(0);
	const [published, setPublished] = useState<boolean>(false);
	const [clearQuizForm, setClearQuizForm] = useState(true)
	const toast = useToast()

	// Color mode values
	const cardBg = useColorModeValue('white', 'gray.800');
	const borderColor = useColorModeValue('gray.200', 'gray.600');

	const handleChangeQuizProfile = (field: string, value: string | boolean) => {
		setQuizProfile({
			...quizProfile,
			[field]: value,
		});
	};

	const handleSaveQuiz = async () => {
		toast.promise(publishQuiz(), {
			success: { title: 'Quiz created', description: 'Lez go' },
			error: {
				title: 'Quiz failed to upload',
				description: 'Something wrong',
			},
			loading: { title: 'Quiz creating', description: 'Please wait' },
		});
		setClearQuizForm(true)
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
			questionText: '',
			type: 'multiple-choice',
			options: [{ text: `Option 1`, isCorrect: true, id: 1 }],
			points: 1,
		};
		
		addQuestions(baseQuestion);
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
			text: '',
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
		fetchQuizParams()
	}, [clearQuizForm]);

	



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
								placeholder={'Enter a question'}								
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
										Answer Choices
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

								<RadioGroup
									value={
										question.options
											.find((opt) => opt.isCorrect)
											?.id.toString() || ''
									}
									onChange={(value) =>
										handleCorrectOption(question.id, Number(value))
									}
								>
									<VStack spacing={2} align="stretch">
										{question.options?.map((choice, index) => (
											<HStack key={choice.id} spacing={2}>
												<Radio
													value={choice.id.toString()}
													colorScheme="green"
												/>
												<Input
									
													onChange={(e) =>
														handleUpdateOptions(
															question.id,
															choice.id,
															e.target.value
														)
													}
													value={choice.text}
													placeholder={`Option ${index + 1}`}
													size="sm"
													onPaste={(e) => {
														e.preventDefault();
														const pastedText = e.clipboardData.getData('text');
														handleUpdateOptions(
															question.id,
															choice.id,
															pastedText
														);
													}}
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
								</RadioGroup>
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
								<Icon as={MdFormatListBulleted} />
								Quizzes
							</Flex>
						</Tab>
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
						
						{/*  Quizzes Tab */}
						<TabPanel px={0}>
							<VStack spacing={6} align="stretch">
								
							<Box>


								<Tabs index={tabIndexQuizzes} onChange={setTabIndexQuizzes} variant={'soft-rounded'} >

							
									<TabList>
										<Tab>
											<Flex align="center" gap={2}>
												MESL
											</Flex>
										</Tab>
										<Tab>
											<Flex align="center" gap={2}>
												PIPE
											</Flex>
										</Tab>
										<Tab>
											<Flex align="center" gap={2}>
												MDSP
											</Flex>
										</Tab>
									</TabList>

									<TabPanels>
										{/* NOTES INSERT FETCHED DISPLAYED QUIZ HERE */}
										{/* <TabPanel>
											{!isLoading ? quizzesFetch.filter((quiz) => quiz.subject === 'mesl').map((data) => (
												
											<QuizCard key={data._id} quiz={data}/>
												
												
											)) : <Box>Loading...</Box>}


										</TabPanel> */}
										<SubjectQuizTab quizzesFetch={quizzesFetch} subject={'mesl'} isLoading={isLoading}/>
										
										{/* <TabPanel> */}
										<SubjectQuizTab quizzesFetch={quizzesFetch} subject={'pipe'} isLoading={isLoading}/>
										
										{/* </TabPanel> */}
										{/* <TabPanel> */}
										<SubjectQuizTab quizzesFetch={quizzesFetch} subject={'mdsp'} isLoading={isLoading}/>
										
										{/* </TabPanel> */}

									</TabPanels>

								</Tabs>

									
							</Box>
							</VStack>
						</TabPanel>

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

											<Stack
												direction={{ base: 'column', md: 'row' }}
												spacing={4}
												align="start"
											>
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
											</Stack>

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
												<Button
													onClick={handleSaveQuiz}
													backgroundColor={'orange.500'}
													disabled={isLoading}
												>
													Save Quiz
												</Button>
												<Button backgroundColor={'red.500'}>Delete Quiz</Button>
												<Button
													onClick={() => {
														setPublished((prev) => !prev);
														handleChangeQuizProfile('isPublished', published);
														console.log(
															'published profile',
															quizProfile.isPublished
														);
													}}
													backgroundColor={published ? 'green' : 'gray.500'}
												>
													{published ? 'Published' : 'Draft'}
												</Button>
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
									</HStack>

									{clearQuizForm ? (
										<Card bg={cardBg} borderColor={borderColor}>
											<CardBody textAlign="center" py={10}>
												<Text color="gray.500" mb={4}>
													No questions added yet
												</Text>
												<Button
													leftIcon={<AddIcon />}
													onClick={() => {
														//unset the clear form first to render the question form
														setClearQuizForm(false)
														//add question
														handleAddQuestionButton()
													} }
													colorScheme="blue"
												>
													Add Your First Question
												</Button>
											</CardBody>
										</Card>
									) : (
										<VStack spacing={4} align="stretch">
											{questions.map((q) => QuestionEditor(q))}
											<Button
												leftIcon={<AddIcon />}
												onClick={handleAddQuestionButton}
												colorScheme="blue"
											>
												Add Question
											</Button>
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
									<Text color="gray.200">
										See how your quiz will look to students
									</Text>
								</Box>

								{selectedQuiz && selectedQuiz.length > 0 ? (
									<VStack spacing={6} align="stretch">
										{selectedQuiz.map(q => q).map((item, index) => (
											<PlayQuiz
												key={item._id}
												question={item}
												questionNumber={index + 1}
												totalQuestions={selectedQuiz.length}
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
