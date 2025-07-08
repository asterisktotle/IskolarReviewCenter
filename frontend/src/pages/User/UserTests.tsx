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
	Box,
	Card,
	CardBody,
	Stack,
	Badge,
	Spinner,
	useBreakpointValue,
	Flex,
	InputGroup,
	InputLeftElement,
	Select,
	HStack,
	Button,
	Icon,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import {
	MdBook,
	MdCheck,
	MdChecklist,
	MdDoneOutline,
	MdHourglassBottom,
	MdHourglassDisabled,
	MdOutlineChecklist,
} from 'react-icons/md';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import QuizStore, { QuizProfile } from '../../store/quizStore';
import { MdOutlineClass } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import PlayQuiz from '../../components/PlayQuiz';

const UsersTest = () => {
	const { fetchQuizParams, quizzesFetch, isLoading , selectedQuiz} = QuizStore();

	//Actions
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedCategory, setSelectedCategory] = useState('all');
	const [selectedSubject, setSelectedSubject] = useState('all');
	const navigate = useNavigate()

	// Responsive breakpoint
	const isMobile = useBreakpointValue({ base: true, lg: false });
	const cardSpacing = useBreakpointValue({ base: 3, md: 4 });

	// Fetch quizzes
	useEffect(() => {
		fetchQuizParams();
		
	}, []);


	// Handle play quiz action
	const handlePlayQuiz = (quizId: string) => {
		

		navigate(`/user-tests/play/${quizId}`)

		

	}

	// Filter logic
	const filteredQuizzes = quizzesFetch.filter((q) => q.isPublished).filter((quiz) => {
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
	const categories = [
		...new Set(quizzesFetch?.map((quiz) => quiz.category) || []),
	];
	const subjects = [
		...new Set(quizzesFetch?.map((quiz) => quiz.subject) || []),
	];

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

	// Mobile Card Component
	const MobileCard = ({ quiz }: { quiz: QuizProfile }) => (
		<Card
			cursor="pointer"
			transition="all 0.2s ease"
			_hover={{
				transform: 'translateY(-2px)',
				shadow: 'lg',
				borderColor: 'purple.400',
			}}
			_active={{ transform: 'translateY(0px)' }}
			bg="whiteAlpha.100"
			backdropFilter="blur(10px)"
			border="1px solid"
			borderColor="whiteAlpha.200"

		>
			<CardBody p={4}>
				<Stack spacing={3}>
					{/* Subject and Category Badges */}
					<HStack justify="space-between" wrap="wrap" spacing={2}>
						<Badge
							colorScheme="purple"
							variant="subtle"
							fontSize="xs"
							px={2}
							py={1}
							borderRadius="full"
						>
							{quiz.subject.toUpperCase()}
						</Badge>
						<Badge
							colorScheme="blue"
							variant="outline"
							fontSize="xs"
							px={2}
							py={1}
							borderRadius="full"
						>
							{quiz.category.toUpperCase()}
						</Badge>
					</HStack>

					{/* Title */}
					<Box>
						<Text
							fontWeight="semibold"
							color="white"
							fontSize="md"
							lineHeight="1.4"
							noOfLines={2}
						>
							{quiz.title.toUpperCase()}
						</Text>
					</Box>
					{/* Points */}
					<Box display="flex" alignItems="center" gap={2}>
						<Icon as={MdOutlineChecklist} />
						<Text fontWeight="semibold" color="white" fontSize="sm">
							Total Items: {quiz.totalPoints}
						</Text>
					</Box>
					{/* Passing Score */}
					<Box display="flex" alignItems="center" gap={2}>
						<Icon as={MdCheck} color={'green'} />
						<Text fontWeight="semibold" color="white" fontSize="sm">
							Passing score:{' '}
							{Math.ceil((quiz.passingScore / 100) * quiz.totalPoints)}
						</Text>
					</Box>
					{/* Time Limit */}
					<Box display="flex" alignItems="center" gap={2}>
						<Icon
							as={quiz.timeLimit ? MdHourglassBottom : MdHourglassDisabled}
						/>
						<Text fontWeight="semibold" color="white" fontSize="sm">
							Time Limit:{' '}
							{quiz.timeLimit ? `${quiz.timeLimit} mins` : 'Unlimited'}
						</Text>
					</Box>

					{/* Action indicator */}
						<Button fontSize="sm" onClick={() => handlePlayQuiz(quiz._id)}>	
							Tap to Play →
						</Button>
						
				</Stack>
			</CardBody>
		</Card>
	);

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
								placeholder="Search quizzes, subjects, or categories..."
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
						//  Mobile Card View
						<VStack spacing={cardSpacing} align="stretch">
							{filteredQuizzes.filter(q => q.isPublished).map((quiz) => (
								<MobileCard key={quiz._id} quiz={quiz} />
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
											<Th
												textAlign={'center'}
												color="white"
												fontSize="sm"
												fontWeight="bold"
											>
												Subject
											</Th>
											<Th
												textAlign={'center'}
												color="white"
												fontSize="sm"
												fontWeight="bold"
											>
												Category
											</Th>
											<Th
												textAlign={'center'}
												color="white"
												fontSize="sm"
												fontWeight="bold"
											>
												Title
											</Th>
											<Th
												textAlign={'center'}
												color="white"
												fontSize="sm"
												fontWeight="bold"
											>
												Items
											</Th>
											<Th
												textAlign={'center'}
												color="white"
												fontSize="sm"
												fontWeight="bold"
											>
												Passing Score
											</Th>
											<Th
												textAlign={'center'}
												color="white"
												fontSize="sm"
												fontWeight="bold"
											>
												Time Limit
											</Th>
										</Tr>
									</Thead>
									<Tbody>
										{filteredQuizzes.filter(q => q.isPublished).map((quiz) => (
											<Tr
												onClick={() => console.log('play quiz: ', quiz._id)}
												key={quiz._id}
												_hover={{ bg: 'whiteAlpha.100' }}
												transition="background 0.2s ease"
											>
												<Td color="gray.200" textAlign={'center'}>
													<Badge colorScheme="purple" variant="subtle">
														{quiz.subject.toUpperCase()}
													</Badge>
												</Td>
												<Td color="gray.200" textAlign={'center'}>
													<Badge colorScheme="blue" variant="outline">
														{quiz.category.toUpperCase()}
													</Badge>
												</Td>
												<Td
													textAlign={'center'}
													cursor="pointer"
													color="white"
													fontWeight="medium"
													_hover={{ color: 'purple.300' }}
													transition="color 0.2s ease"
													onClick={() => handlePlayQuiz(quiz._id)}
												>
													{quiz.title}
												</Td>
												<Td
													textAlign={'center'}
													cursor="pointer"
													color="white"
													fontWeight="medium"
													_hover={{ color: 'purple.300' }}
													// onClick={() => handleViewPdf(quiz._id)}
													transition="color 0.2s ease"
												>
													{quiz.totalPoints}
												</Td>
												<Td
													textAlign={'center'}
													cursor="pointer"
													color="white"
													fontWeight="medium"
													_hover={{ color: 'purple.300' }}
													// onClick={() => handleViewPdf(quiz._id)}
													transition="color 0.2s ease"
												>
													{quiz.passingScore}%
												</Td>
												<Td
													textAlign={'center'}
													cursor="pointer"
													color="white"
													fontWeight="medium"
													_hover={{ color: 'purple.300' }}
													// onClick={() => handleViewPdf(quiz._id)}
													transition="color 0.2s ease"
												>
													{quiz.timeLimit} mins
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
							<MdOutlineClass size={'5rem'} />
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
