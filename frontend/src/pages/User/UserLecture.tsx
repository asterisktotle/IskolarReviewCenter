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
	Alert,
	AlertIcon,
	AlertDescription,
	useBreakpointValue,
	Flex,
	InputGroup,
	InputLeftElement,
	Select,
	HStack,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import AdminStore, { PdfFiles } from '../../store/adminStore';
import { useNavigate } from 'react-router-dom';

const UsersLecture = () => {
	const { getAllPdf, pdfList, messageError, loading } = AdminStore();
	const navigate = useNavigate();
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedCategory, setSelectedCategory] = useState('all');
	const [selectedSubject, setSelectedSubject] = useState('all');

	// Responsive breakpoint
	const isMobile = useBreakpointValue({ base: true, lg: false });
	const cardSpacing = useBreakpointValue({ base: 3, md: 4 });

	useEffect(() => {
		getAllPdf();
	}, [getAllPdf]);

	// Filter logic
	const filteredPdfs = pdfList?.filter((pdf) => {
		const matchesSearch =
			pdf.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			pdf.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
			pdf.category.toLowerCase().includes(searchTerm.toLowerCase());

		const matchesCategory =
			selectedCategory === 'all' ||
			pdf.category.toLowerCase() === selectedCategory.toLowerCase();
		const matchesSubject =
			selectedSubject === 'all' ||
			pdf.subject.toLowerCase() === selectedSubject.toLowerCase();

		return matchesSearch && matchesCategory && matchesSubject;
	});

	// Get unique categories and subjects for filters
	const categories = [...new Set(pdfList?.map((pdf) => pdf.category) || [])];
	const subjects = [...new Set(pdfList?.map((pdf) => pdf.subject) || [])];

	const handleViewPdf = (pdfId: string) => {
		navigate(`/view-pdf/${pdfId}`);
	};

	// Mobile Card Component
	const MobileCard = ({ pdf }: {pdf: PdfFiles}) => (
		<Card
			cursor="pointer"
			transition="all 0.2s ease"
			_hover={{
				transform: 'translateY(-2px)',
				shadow: 'lg',
				borderColor: 'purple.400',
			}}
			_active={{ transform: 'translateY(0px)' }}
			onClick={() => handleViewPdf(pdf._id)}
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
							{pdf.subject.toUpperCase()}
						</Badge>
						<Badge
							colorScheme="blue"
							variant="outline"
							fontSize="xs"
							px={2}
							py={1}
							borderRadius="full"
						>
							{pdf.category.toUpperCase()}
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
							{pdf.title}
						</Text>
					</Box>

					{/* Action indicator */}
					<Flex justify="flex-end" align="center" mt={2}>
						<Text fontSize="sm" color="purple.300">
							Tap to view →
						</Text>
					</Flex>
				</Stack>
			</CardBody>
		</Card>
	);

	if (loading) {
		return (
			<Container maxW="full" centerContent py={10}>
				<VStack spacing={4}>
					<Spinner size="xl" color="purple.500" thickness="4px" />
					<Text color="gray.300">Loading your lectures...</Text>
				</VStack>
			</Container>
		);
	}

	if (messageError) {
		return (
			<Container maxW="full" py={6}>
				<Alert status="error" bg="red.900" color="white" borderRadius="md">
					<AlertIcon />
					<AlertDescription>{messageError}</AlertDescription>
				</Alert>
			</Container>
		);
	}

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
				{filteredPdfs && filteredPdfs.length > 0 ? (
					isMobile ? (
						// Mobile Card View
						<VStack spacing={cardSpacing} align="stretch">
							{filteredPdfs.map((pdf) => (
								<MobileCard key={pdf._id} pdf={pdf} />
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
										{filteredPdfs.map((pdf) => (
											<Tr
												key={pdf._id}
												_hover={{ bg: 'whiteAlpha.100' }}
												transition="background 0.2s ease"
											>
												<Td color="gray.200">
													<Badge colorScheme="purple" variant="subtle">
														{pdf.subject.toUpperCase()}
													</Badge>
												</Td>
												<Td color="gray.200">
													<Badge colorScheme="blue" variant="outline">
														{pdf.category.toUpperCase()}
													</Badge>
												</Td>
												<Td
													cursor="pointer"
													color="white"
													fontWeight="medium"
													_hover={{ color: 'purple.300' }}
													onClick={() => handleViewPdf(pdf._id)}
													transition="color 0.2s ease"
												>
													{pdf.title}
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
							<Box fontSize="4xl">📖</Box>
							<Text color="gray.300" fontSize="lg" fontWeight="medium">
								No lectures found
							</Text>
							<Text color="gray.400" fontSize="sm">
								{searchTerm ||
								selectedCategory !== 'all' ||
								selectedSubject !== 'all'
									? 'Try adjusting your search or filters'
									: 'No lectures available at the moment'}
							</Text>
						</VStack>
					</Box>
				)}
			</VStack>
		</Container>
	);
};

export default UsersLecture;
