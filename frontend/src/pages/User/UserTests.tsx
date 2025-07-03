import {
	Input,
	Text,
	Container,
	VStack,
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	TableContainer,
	Heading,
	Box,
	Card,
	CardBody,
	Stack,
	Badge,
	Spinner,
	Alert,
	AlertIcon,
	AlertDescription,
	useBreakpointValue,
	Flex,
	InputGroup,
	InputLeftElement,
	Select,
	HStack,
	Button,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import AdminStore from '../../store/adminStore';
import { useNavigate } from 'react-router-dom';
import QuizStore from '../../store/quizStore';
import QuizCard from '../../components/QuizList';
import { MdOutlineClass } from 'react-icons/md';

const UsersTest = () => {
	// const { getAllPdf,  messageError, loading } = AdminStore();
	const {fetchQuizParams, quizzesFetch, selectedQuiz, isLoading} = QuizStore()

	const [searchTerm, setSearchTerm] = useState('');
	const [selectedCategory, setSelectedCategory] = useState('all');
	const [selectedSubject, setSelectedSubject] = useState('all');

	// Responsive breakpoint
	const isMobile = useBreakpointValue({ base: true, lg: false });
	const cardSpacing = useBreakpointValue({ base: 3, md: 4 });

	useEffect(() => {
		fetchQuizParams()
	}, []);

	// Filter logic
	const filteredQuizzes = quizzesFetch.filter((quizzes) => quizzes.isPublished).filter((quiz) => {
		const matchesSearch =
			quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			quiz.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
			quiz.category.toLowerCase().includes(searchTerm.toLowerCase());

		const matchesCategory =
			selectedCategory === 'all' ||
			quiz.category.toLowerCase() === selectedCategory.toLowerCase();
		const matchesSubject =
			selectedSubject === 'all' ||
			quiz.subject.toLowerCase() === selectedSubject.toLowerCase();

		return matchesSearch && matchesCategory && matchesSubject;
	});

	// Get unique categories and subjects for filters
	const categories = [...new Set(quizzesFetch?.map((quiz) => quiz.category) || [])];
	const subjects = [...new Set(quizzesFetch?.map((quiz) => quiz.subject) || [])];

	// const handleViewquiz = (quizId: string) => {
	// 	navigate(`/view-quiz/${quizId}`);
	// };

	if (isLoading) {
		return (
			<Container maxW="full" centerContent py={10}>
				<VStack spacing={4}>
					<Spinner size="xl" color="purple.500" thickness="4px" />
					<Text color="gray.300">Loading your lectures...</Text>
				</VStack>
			</Container>
		);
	}

	//TODO
	//add play quiz when click play
	//display history of quiz

	// if (messageError) {
	// 	return (
	// 		<Container maxW="full" py={6}>
	// 			<Alert status="error" bg="red.900" color="white" borderRadius="md">
	// 				<AlertIcon />
	// 				<AlertDescription>{messageError}</AlertDescription>
	// 			</Alert>
	// 		</Container>
	// 	);
	// }

	return (
		<Container maxW="full" p={0}>
			<VStack spacing={6} align="stretch">
				{/* Header */}
				<Box textAlign="center" mb={2}>
					<Heading
						size={isMobile ? 'lg' : 'xl'}
						color="white"
						mb={2}
						fontWeight="bold"
					>
						📚 Your Lectures
					</Heading>
					<Text color="gray.300" fontSize={isMobile ? 'sm' : 'md'}>
						{filteredQuizzes?.length || 0} lectures available
					</Text>
				</Box>

				{/* Search and Filters */}
				<Box
					bg="whiteAlpha.100"
					backdropFilter="blur(10px)"
					p={4}
					borderRadius="xl"
					border="1px solid"
					borderColor="whiteAlpha.200"
				>
					<VStack spacing={4}>
						{/* Search */}
						<InputGroup size={isMobile ? 'md' : 'lg'}>
							<InputLeftElement pointerEvents="none">
								<MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
							</InputLeftElement>
							<Input
								placeholder="Search lectures, subjects, or categories..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								bg="whiteAlpha.100"
								border="1px solid"
								borderColor="whiteAlpha.300"
								color="white"
								_placeholder={{ color: 'gray.400' }}
								_focus={{
									borderColor: 'purple.400',
									boxShadow: '0 0 0 1px rgba(168, 85, 247, 0.6)',
								}}
							/>
						</InputGroup>

						{/* Filters */}
						<Stack direction={isMobile ? 'column' : 'row'} spacing={3} w="full">
							<Select
								value={selectedSubject}
								onChange={(e) => setSelectedSubject(e.target.value)}
								bg="whiteAlpha.100"
								border="1px solid"
								borderColor="whiteAlpha.300"
								color="white"
								_focus={{ borderColor: 'purple.400' }}
								size={isMobile ? 'md' : 'lg'}
							>
								<option value="all" style={{ background: '#1a202c' }}>
									All Subjects
								</option>
								{subjects.map((subject) => (
									<option
										key={subject}
										value={subject}
										style={{ background: '#1a202c' }}
									>
										{subject.toUpperCase()}
									</option>
								))}
							</Select>

							<Select
								value={selectedCategory}
								onChange={(e) => setSelectedCategory(e.target.value)}
								bg="whiteAlpha.100"
								border="1px solid"
								borderColor="whiteAlpha.300"
								color="white"
								_focus={{ borderColor: 'purple.400' }}
								size={isMobile ? 'md' : 'lg'}
							>
								<option value="all" style={{ background: '#1a202c' }}>
									All Categories
								</option>
								{categories.map((category) => (
									<option
										key={category}
										value={category}
										style={{ background: '#1a202c' }}
									>
										{category.toUpperCase()}
									</option>
								))}
							</Select>
						</Stack>
					</VStack>
				</Box>

				{/* Content */}
				{filteredQuizzes && filteredQuizzes.length > 0 ? (
					isMobile ? (
						// Mobile Card View
						<VStack spacing={cardSpacing} align="stretch">
							{filteredQuizzes.map((quiz) => (
								<QuizCard key={quiz._id} quiz={quiz}/>
							))}
						</VStack>
					) : (
						// Desktop Table View
						<Box
							bg="whiteAlpha.100"
							backdropFilter="blur(10px)"
							borderRadius="xl"
							border="1px solid"
							borderColor="whiteAlpha.200"
							overflow="hidden"
						>
							<TableContainer>
								<Table variant="simple">
									<Thead bg="whiteAlpha.200">
										<Tr>
											<Th color="white" fontSize="sm" fontWeight="bold">
												Subject
											</Th>
											<Th color="white" fontSize="sm" fontWeight="bold">
												Category
											</Th>
											<Th color="white" fontSize="sm" fontWeight="bold">
												Title
											</Th>
										</Tr>
									</Thead>
									<Tbody>
										{filteredQuizzes.map((quiz) => (
											<Tr
												key={quiz._id}
												_hover={{ bg: 'whiteAlpha.100' }}
												transition="background 0.2s ease"
											>
												<Td color="gray.200">
													<Badge colorScheme="purple" variant="subtle">
														{quiz.subject.toUpperCase()}
													</Badge>
												</Td>
												<Td color="gray.200">
													<Badge colorScheme="blue" variant="outline">
														{quiz.category.toUpperCase()}
													</Badge>
												</Td>
												<Td
													cursor="pointer"
													color="white"
													fontWeight="medium"
													_hover={{ color: 'purple.300' }}
													// onClick={() => handleViewPdf(quiz._id)}
													transition="color 0.2s ease"
												>
													{quiz.title}
												</Td>
											</Tr>
										))}
									</Tbody>
								</Table>
							</TableContainer>
						</Box>
					)
				) : (
					// Empty State
					<Box
						textAlign="center"
						py={12}
						bg="whiteAlpha.50"
						borderRadius="xl"
						border="2px dashed"
						borderColor="whiteAlpha.200"
					>
						<VStack spacing={4}>
							<MdOutlineClass size={'5rem'}/>
							<Text color="gray.300" fontSize="lg" fontWeight="medium">
								No quizzes found
							</Text>
							<Text color="gray.400" fontSize="sm">
								{searchTerm ||
								selectedCategory !== 'all' ||
								selectedSubject !== 'all'
									? 'Try adjusting your search or filters'
									: 'No Quiz available at the moment'}
							</Text>
						</VStack>
					</Box>
				)}
			</VStack>
		</Container>
	);
};

export default UsersTest;
