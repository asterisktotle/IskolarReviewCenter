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
import PlayQuiz from '../Quiz/PlayQuiz';

import {SubjectQuizTab } from '../../components/QuizList';
import QuestionEditor from '../Quiz/QuestionEditor';

const AdminTests = () => {
	const {
		fetchQuizParams,
		quizzesFetch,
		questions,
		quizProfile,
		setQuizProfile,
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


	useEffect(() => {
		fetchQuizParams()
	}, [clearQuizForm]);

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


	

	return (
		<Container maxW="6xl" py={6}>
			<VStack spacing={6} align="stretch">
				{/* Header */}
				<Box textAlign="center">
					<Heading size="lg" mb={2}>
						Quiz Administration
					</Heading>
					<Text >Create and manage your quizzes</Text>
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
								
										<SubjectQuizTab quizzesFetch={quizzesFetch} subject={'mesl'} isLoading={isLoading}/>
										
									
										<SubjectQuizTab quizzesFetch={quizzesFetch} subject={'pipe'} isLoading={isLoading}/>
								
										<SubjectQuizTab quizzesFetch={quizzesFetch} subject={'mdsp'} isLoading={isLoading}/>
										
									

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
											{questions.map((q, i) => ( <QuestionEditor key={i} question={q}/>))}
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
