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
	const { quizProfile, setQuizProfile, publishQuiz, isLoading , updateQuiz} = QuizStore();

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

	const handleUpdateQuiz = async (quizId: string) => {
		toast.promise(updateQuiz(quizId), {
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
						<FormLabel htmlFor='quiz_title'>Quiz Title</FormLabel>
						<Editable
							placeholder='Enter a quiz title'
							value={quizProfile.title}
							onChange={(value) => handleChangeQuizProfile('title', value)}
						>
							<EditablePreview
								p={3}
								borderRadius="md"
								border="1px"
								borderColor={borderColor}
								w={'full'}
							/>
							<EditableInput id='quiz_title' p={3} />
						</Editable>
					</FormControl>

					<Stack
						direction={{ base: 'column', md: 'row' }}
						spacing={4}
						align="start"
					>
						<FormControl>
							<FormLabel as='legend'>Subject</FormLabel>
							<RadioGroup
								onChange={(value) => handleChangeQuizProfile('subject', value)}
								value={quizProfile.subject}
								id='subject'
							>
								<Stack direction="row" spacing={4}>
									<Radio value="mesl">MESL</Radio>
									<Radio value="pipe">PIPE</Radio>
									<Radio value="mdsp">MDSP</Radio>
								</Stack>
							</RadioGroup>
						</FormControl>

						<FormControl>
							<FormLabel htmlFor='time_limit'>Time Limit (minutes)</FormLabel>
							<NumberInput
								value={quizProfile.timeLimit}
								onChange={(value) =>
									handleChangeQuizProfile('timeLimit', value)
								}
								maxW="150px"
								min={0}
								max={60*24}
							>
								<NumberInputField
									id='time_limit'
									placeholder="0"
								/>
							</NumberInput>
						</FormControl>

						<FormControl>
							<FormLabel htmlFor='passing_score'>Passing Score (%)</FormLabel>
							<NumberInput
								value={quizProfile.passingScore}
								onChange={(value) =>
									handleChangeQuizProfile('passingScore', value)
								}
								maxW="150px"
								min={1}
								max={100}
							>
								<NumberInputField
									id='passing_score'
									placeholder="50"
								/>
							</NumberInput>
						</FormControl>
					</Stack>

					<FormControl>
						<FormLabel as='legend'>Test Category</FormLabel>
						<RadioGroup
							value={quizProfile.category}
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

					<HStack >
						<Button
							onClick={handleSaveQuiz}
							backgroundColor={'orange.500'}
							disabled={isLoading}
						>
							Save
						</Button>
						<Button backgroundColor={'red.500'}>Delete</Button>
						<Button
							onClick={() =>
								handleChangeQuizProfile('isPublished', !quizProfile.isPublished)
							}
							backgroundColor={quizProfile.isPublished ? 'green' : 'gray.500'}
						>
							{quizProfile.isPublished ? 'Published' : 'Draft'}
						</Button>
						{quizProfile._id && <Button onClick={() => handleUpdateQuiz(quizProfile._id)}>Update</Button>}
						<Button variant="outline">Scan PDF</Button>
						
					</HStack>
				</VStack>
			</CardBody>
		</Card>
	);
};

export default QuizSettings;
