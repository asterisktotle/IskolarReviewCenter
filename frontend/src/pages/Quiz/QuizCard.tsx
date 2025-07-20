import {
    Card,
    CardBody,
    CardHeader,
    Heading,
    Text,
    Badge,
    VStack,
    HStack,
    Flex,
    useColorModeValue,
    SimpleGrid,
    Icon,
    Button,
    useToast,
} from '@chakra-ui/react';
import {
    MdDoneOutline,
    MdHourglassBottom,
    MdHourglassDisabled,
    MdOutlineChecklist,
} from 'react-icons/md';
import QuizStore, { QuizProfile } from '../../store/quizStore';

const QuizCard = ({ quiz }: { quiz: QuizProfile }) => {
    //Responsibility
    // It displays individual quiz
    // It can delete the quiz 
    // It can edit by getting the data in quizProfile then redirecting tab to create Quiz 
	const { setTabIndex, fetchQuizById, setQuestions, setQuizProfile, deleteQuiz, fetchQuizParams } =
		QuizStore();
	const toast = useToast()
	const getCategoryColor = (category: string) => {
		const colors: Record<string, string> = {
			terms: 'blue',
			procedures: 'green',
			anatomy: 'purple',
			default: 'gray',
		};
		return colors[category] || colors.default;
	};

	const formatTime = (minutes: number) => {
		if (minutes === 0) return 'No time limit';
		return `${minutes} min`;
	};

	const handleSelectedQuizFetch = async (quizId: string) => {
		try {
			setQuestions([]);
			// setQuizProfile()
			const response = await fetchQuizById(quizId);
			if (!response.success) {
				window.alert('Cannot fetched quiz');
				console.log('Failed to fetch the quiz');
				return;
			}
			const {
				title,
				subject,
				category,
				timeLimit,
				passingScore,
				totalPoints,
				questions,
				isPublished,
				_id,
			} = response.data;

            console.log('selected quiz',response.data)

			const quizProfile = {
				title,
				subject,
				category,
				timeLimit,
				passingScore,
				isPublished,
                questions,
				totalPoints,
				_id,
			};
			// console.log('questions: ', questions);
            // const questionWithIds = questions.map
			setQuizProfile(quizProfile); 
			setTabIndex(1);
		} catch (err) {
			console.log('quiz fetched error: ', err);
		}
	};

	const handleDelete = async (quizId: string) => {
    try {
        const response = await deleteQuiz(quizId);
        if (response && response.success) {
            toast({
                title: 'Quiz deleted successfully.',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            fetchQuizParams(); // Refetch the quiz list
        } else {
            toast({
                title: 'Failed to delete quiz.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            console.error('Failed to delete quiz:', response?.message || 'Unknown error');
        }
    } catch (err) {
        toast({
            title: 'An error occurred while deleting the quiz.',
            status: 'error',
            duration: 3000,
            isClosable: true,
        });
        console.error('Delete quiz exception:', err);
    }
};

	return (
		<Card
			cursor="pointer"
			transition="all 0.2s ease"
			_hover={{
				transform: 'translateY(-2px)',
				shadow: 'lg',
				borderColor: 'purple.400',
			}}
			_active={{ transform: 'translateY(0px)' }}
			backdropFilter="blur(10px)"
			border="1px solid"
			borderColor="whiteAlpha.200"
			shadow="md"
			marginBlock={'1'}
			marginInline={{ sm: 0, base: -5 }}
		>
			<CardHeader pb={2}>
				<Flex justify="space-between" align="start">
					<Heading size="md" color={useColorModeValue('gray.800', 'white')}>
						{quiz.title}
					</Heading>
					<VStack spacing={1} align="end">
						<Badge
							colorScheme={getCategoryColor(quiz.category)}
							variant="subtle"
							textTransform="capitalize"
						>
							{quiz.category}
						</Badge>

						<Badge
							colorScheme={quiz.isPublished ? 'green' : 'orange'}
							variant="outline"
							size="sm"
						>
							{quiz.isPublished ? 'Published' : 'Draft'}
						</Badge>
					</VStack>
				</Flex>
			</CardHeader>

			<CardBody pt={0} ml={2}>
				<VStack spacing={4} align="stretch">
					<SimpleGrid columns={2} spacing={4}>
						<HStack spacing={2}>
							<Icon
								as={quiz.timeLimit ? MdHourglassBottom : MdHourglassDisabled}
								color="blue.500"
								boxSize={4}
							/>
							<Text
								fontSize="sm"
								color={useColorModeValue('gray.600', 'gray.400')}
							>
								{formatTime(quiz.timeLimit)}
							</Text>
						</HStack>

						<HStack spacing={2}>
							<Icon as={MdDoneOutline} color="yellow.500" boxSize={4} />
							<Text
								fontSize="sm"
								color={useColorModeValue('gray.600', 'gray.400')}
							>
								{quiz.passingScore}% to pass
							</Text>
						</HStack>

						<HStack spacing={2}>
							<Icon as={MdOutlineChecklist} color="purple.500" boxSize={4} />
							<Text
								fontSize="sm"
								color={useColorModeValue('gray.600', 'gray.400')}
							>
								{quiz.totalPoints} points
							</Text>
						</HStack>

						<HStack spacing={1}>
							<Button
								w={'5rem'}
								onClick={() => {
									handleSelectedQuizFetch(quiz._id);
								}}
								fontSize="sm"
							>
								Edit
							</Button>
							<Button
                             onClick={() => handleDelete(quiz._id)} bg={'red'} fontSize="sm">
								Delete
							</Button>

							<Button fontSize="sm" bgColor={'green'}>
								Play
							</Button>
						</HStack>
					</SimpleGrid>
				</VStack>
			</CardBody>
		</Card>
	);
};

export default QuizCard;