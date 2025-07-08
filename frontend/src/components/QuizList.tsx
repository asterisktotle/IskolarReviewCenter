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
	TabPanel,
	Center,
	Spinner,
	Icon,
	Button
} from '@chakra-ui/react';
import { MdBook, MdDoneOutline, MdHourglassBottom, MdHourglassDisabled,  MdOutlineChecklist} from 'react-icons/md';

import QuizStore, { QuizProfile } from '../store/quizStore';
import {  useMemo} from 'react';
import useAuthStore from '../store/authStore';

export const SubjectQuizTab = ({ isLoading, quizzesFetch, subject }) => {
  const quizzesFetched = useMemo(() => 
	quizzesFetch.filter((quiz) => quiz.subject === subject), 
	[quizzesFetch]
  );

  if (isLoading) {
	return (
	  <TabPanel>
		<Center h="200px">
		  <Spinner size="xl" color="blue.500" />
		</Center>
	  </TabPanel>
	);
  }

  return (
	<TabPanel>
	  {quizzesFetched.length > 0 ? (
		<SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
		  {quizzesFetched.map((data) => (
			<QuizCard key={data._id} quiz={data} />
		  ))}
		</SimpleGrid>
	  ) : (
		<Center h="300px">
		  <VStack spacing={4}>
			<Icon as={MdBook} boxSize={16} color="gray.300" />
			<Heading size="md" color="gray.500">
			  No {subject.toUpperCase()}  Quizzes
			</Heading>
			<Text color="gray.400" textAlign="center" maxW="300px">
			  There are currently no quizzes available for the {subject.toUpperCase()} subject. 
			  New quizzes will appear here when they're published.
			</Text>
		  </VStack>
		</Center>
	  )}
	</TabPanel>
  );
};

 const QuizCard = ({ quiz }: {quiz: QuizProfile}) => {
	
	const {userData} = useAuthStore()
	const getCategoryColor = (category: string) => {
		const colors: Record<string, string> = {
			terms: 'blue',
			procedures: 'green',
			anatomy: 'purple',
			default: 'gray',
		};
		return colors[category] || colors.default;
	};

	const {fetchQuizParams} = QuizStore()

	const formatTime = (minutes: number) => {
		if (minutes === 0) return 'No time limit';
		return `${minutes} min`;
	};

	const handleSelectedQuizFetch = () => {
		fetchQuizParams({
			title: quiz.title,
			category: quiz.category
		})
	}

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
			// onClick={() => } // show stats trial
			bg="whiteAlpha.800"
			backdropFilter="blur(10px)"
			border="1px solid"
			borderColor="whiteAlpha.200"
			shadow="md"
            marginBlock={'1'}
			onClick={handleSelectedQuizFetch}
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

						{userData?.isAdmin && 
						
						<Badge
							colorScheme={quiz.isPublished ? 'green' : 'orange'}
							variant="outline"
							size="sm"
						>
							{quiz.isPublished ? 'Published' : 'Draft'}
						</Badge>
						}
					</VStack>
				</Flex>
			</CardHeader>

			<CardBody pt={0}>
				<VStack spacing={3} align="stretch">
					<SimpleGrid columns={2} spacing={4}>
						<HStack spacing={2}>
							<Icon as={quiz.timeLimit ? MdHourglassBottom: MdHourglassDisabled} color="blue.500" boxSize={4} />
							<Text
								fontSize="sm"
								color={useColorModeValue('gray.600', 'gray.400')}
							>
								{formatTime(quiz.timeLimit)}
							</Text>
						</HStack>

						<HStack spacing={2}>
							<Icon as={MdBook} color="green.500" boxSize={4} />
							<Text
								fontSize="sm"
								color={useColorModeValue('gray.600', 'gray.400')}
							>
								{quiz.questions.length} questions
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
						

						<HStack spacing={2}>

							{userData?.isAdmin && 
							
							<>
							<Button
								fontSize="sm"
							>
								Edit
							</Button>
							<Button
								fontSize="sm"
							>
								Delete
							</Button>
							
							</>
						
							}
							<Button
								fontSize="sm"
								bgColor={'green'}
							>
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