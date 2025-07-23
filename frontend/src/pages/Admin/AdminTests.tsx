import {
	Container,
	VStack,
	Button,
	Flex,
	Icon,
	Tabs,
	TabList,
	TabPanels,
	Tab,
	TabPanel,
	Box,
	Text,
	Divider,
	Card,
	CardBody,
	Heading,
	useColorModeValue,
} from '@chakra-ui/react';
import { AddIcon, EditIcon } from '@chakra-ui/icons';
import { MdPlayArrow, MdFormatListBulleted } from 'react-icons/md';
import { useEffect, useState } from 'react';
import { QuestionData } from '../../hooks/useQuestionMaker';
import QuizStore from '../../store/quizStore';
import PlayQuiz from '../Quiz/PlayQuiz';
import { SubjectQuizTab } from '../../components/QuizList';
import QuestionEditor from '../Quiz/QuestionEditor';
import QuizSettings from '../Quiz/CreateQuizTab/QuizSettings';
import { useAuth } from '../../hooks/useAuth';

const AdminTests = () => {
	// TODO: Add Create New Quiz so that Create Quiz will clear questions data
	// Stores
	const {
		fetchQuizParams,
		quizzesFetch,
		questions,
		addQuestions,	
		isLoading,
		tabIndex,
		setTabIndex,
		quizProfile,
	} = QuizStore();
	const {userData} = useAuth()

	const [tabIndexQuizzes, setTabIndexQuizzes] = useState(0);

	// Color mode values
	const cardBg = useColorModeValue('white', 'gray.800');
	const borderColor = useColorModeValue('gray.200', 'gray.600');

	useEffect(() => {
		fetchQuizParams();
	}, []);

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

	// QUIZ CARD COMPONENT

	return (
		<Container maxW="6xl" py={6}>
			<VStack spacing={6} align="stretch">
				{/* Header */}
				<Box textAlign="center">
					<Heading size="lg" mb={2}>
						Quiz Administration
					</Heading>
					<Text>Create and manage your quizzes</Text>
				</Box>

				{/* Tabs */}
				<Tabs index={tabIndex} onChange={setTabIndex} variant="enclosed">
					{/* Outer Tab */}
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
									<Tabs
										index={tabIndexQuizzes}
										onChange={setTabIndexQuizzes}
										variant={'soft-rounded'}
									>
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
											{/* QUIZ SUBJECTS */}
											<SubjectQuizTab
												quizzesFetch={quizzesFetch}
												subject={'mesl'}
												isLoading={isLoading}
											/>
											<SubjectQuizTab
												quizzesFetch={quizzesFetch}
												subject={'pipe'}
												isLoading={isLoading}
											/>
											<SubjectQuizTab
												quizzesFetch={quizzesFetch}
												subject={'mdsp'}
												isLoading={isLoading}
											/>
										</TabPanels>
									</Tabs>
								</Box>
							</VStack>
						</TabPanel>

						{/* Create Quiz Tab */}
						<TabPanel px={0}>
							<VStack spacing={6} align="stretch">
								{/* Quiz Settings */}
								<QuizSettings />

								<Divider />

								{/* Questions Section */}
								<Box>
									
										<VStack spacing={4} align="stretch">
										
											
											{tabIndex &&
												questions?.map((q, index) => 
													<QuestionEditor key={q._id || index} question={q} />
												)}
											<Button
												leftIcon={<AddIcon />}
												onClick={handleAddQuestionButton}
												colorScheme="blue"
											>
												Add Question
											</Button>
										</VStack>
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
								{/* Conditional Render: Check if the questions is already fetch then show the questions */}
								{quizProfile._id && userData?.userId && questions.length > 0 ? (
									<VStack spacing={6} align="stretch">
										<PlayQuiz 
											questions={questions}
											timeLimit={quizProfile.timeLimit}
											userId={userData.userId}
											quizId={quizProfile._id}
										/> 
									</VStack>
								) : (
									<Card bg={cardBg} borderColor={borderColor}>
										<CardBody textAlign="center" py={10}>
											<Text color="gray.500" mb={4}>
												No quiz available for preview
											</Text>
											<Button onClick={() => setTabIndex(1)} colorScheme="blue">
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
