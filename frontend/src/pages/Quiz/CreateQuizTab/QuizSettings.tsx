import {
	FormControl,
	VStack,
	Editable,
	EditableInput,
	EditablePreview,
	FormLabel,
	RadioGroup,
	Stack,
	Radio,
	HStack,
	Button,
	NumberInputField,
	Card,
	CardHeader,
	CardBody,
	Heading,
	NumberInput,
	useToast,
	useColorModeValue,
} from '@chakra-ui/react';
import QuizStore from '../../../store/quizStore';

const QuizSettings = () => {
	const { quizProfile, setQuizProfile, publishQuiz, isLoading } = QuizStore();

	const toast = useToast();

	// Color mode values
	const cardBg = useColorModeValue('white', 'gray.800');
	const borderColor = useColorModeValue('gray.200', 'gray.600');

	//Actions
	const handleChangeQuizProfile = (field: string, value: string | boolean) => {
		setQuizProfile({
			...quizProfile,
			[field]: value,
		});
		console.log('quiz profile: ', quizProfile);
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
	};

	return (
		<Card bg={cardBg} borderColor={borderColor}>
			<CardHeader>
				<Heading size="md">Quiz Settings</Heading>
			</CardHeader>
			<CardBody>
				<VStack spacing={4} align="stretch">
					<FormControl>
						<FormLabel>Quiz Title</FormLabel>
						<Editable
							placeholder='Enter a quiz title'
							onChange={(value) => handleChangeQuizProfile('title', value)}
						>
							<EditablePreview
								p={3}
								borderRadius="md"
								border="1px"
								borderColor={borderColor}
								w={'full'}
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
								onChange={(value) => handleChangeQuizProfile('subject', value)}
								// value={quizProfile.subject}
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
								/>
							</NumberInput>
						</FormControl>
					</Stack>

					<FormControl>
						<FormLabel>Test Category</FormLabel>
						<RadioGroup
							// defaultValue={quizProfile.category}
							onChange={(value) => handleChangeQuizProfile('category', value)}
						>
							<Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
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
							onClick={() =>
								handleChangeQuizProfile('isPublished', !quizProfile.isPublished)
							}
							backgroundColor={quizProfile.isPublished ? 'green' : 'gray.500'}
						>
							{quizProfile.isPublished ? 'Published' : 'Draft'}
						</Button>
						<Button variant="outline">Scan PDF</Button>
					</HStack>
				</VStack>
			</CardBody>
		</Card>
	);
};

export default QuizSettings;
