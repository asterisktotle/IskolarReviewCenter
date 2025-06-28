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
} from '@chakra-ui/react';

import { QuizProfile } from '../store/quizStore';

 const QuizCard = ({ quiz }: {quiz: QuizProfile}) => {
	const cardBg = useColorModeValue('white', 'gray.800');
	const borderColor = useColorModeValue('gray.200', 'gray.600');

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

	return (
		<Card
			bg={cardBg}
			border="1px"
			borderColor={borderColor}
			shadow="md"
			_hover={{ shadow: 'lg', transform: 'translateY(-2px)' }}
			transition="all 0.2s"
			opacity={quiz.isPublished ? 1 : 0.7}
            marginBlock={'1'}
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

			<CardBody pt={0}>
				<VStack spacing={3} align="stretch">
					<SimpleGrid columns={2} spacing={4}>
						<HStack spacing={2}>
							{/* <Icon as={Clock} color="blue.500" boxSize={4} /> */}
							<Text
								fontSize="sm"
								color={useColorModeValue('gray.600', 'gray.400')}
							>
								{formatTime(quiz.timeLimit)}
							</Text>
						</HStack>

						<HStack spacing={2}>
							{/* <Icon as={BookOpen} color="green.500" boxSize={4} /> */}
							<Text
								fontSize="sm"
								color={useColorModeValue('gray.600', 'gray.400')}
							>
								{quiz.questions.length} questions
							</Text>
						</HStack>

						<HStack spacing={2}>
							{/* <Icon as={IoMdTrophy} color="yellow.500" boxSize={4} /> */}
							<Text
								fontSize="sm"
								color={useColorModeValue('gray.600', 'gray.400')}
							>
								{quiz.passingScore}% to pass
							</Text>
						</HStack>

						<HStack spacing={2}>
							{/* <Icon as={Users} color="purple.500" boxSize={4} /> */}
							<Text
								fontSize="sm"
								color={useColorModeValue('gray.600', 'gray.400')}
							>
								{quiz.totalPoints} points
							</Text>
						</HStack>
					</SimpleGrid>
				</VStack>
			</CardBody>
		</Card>
	);
};
 

export default QuizCard;