import {
	Text,
	Container,
	VStack,
	Spinner,
	Alert,
	AlertIcon,
	AlertDescription,
	useBreakpointValue,
	Box
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import AdminStore from '../../store/adminStore';

import MobileDisplayLecture from './MobileDisplayLecture';
import DesktopDisplayLecture from './DesktopDisplayLecture';

const UsersLecture = () => {
	const { getAllPdf, pdfList, messageError, loading } = AdminStore();

	const [searchTerm, setSearchTerm] = useState('');
	const [selectedCategory, setSelectedCategory] = useState('all');
	const [selectedSubject, setSelectedSubject] = useState('all');

	// Responsive breakpoint
	const isMobile = useBreakpointValue({ base: true, lg: false });
	const cardSpacing = useBreakpointValue({ base: 3, md: 4 });

	useEffect(() => {
		getAllPdf();
		console.log('pdf List: ', pdfList)
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
			<VStack spacing={6} align="stretch" marginX={4} marginY={4}>
				
			{/* TODO REFACTOR SEARCH LECTURE */}

		

				{/* Content */}
				{filteredPdfs && filteredPdfs.length > 0 ? (
					isMobile ? (
						// Mobile Card View
						<VStack spacing={cardSpacing} align="stretch">
							{filteredPdfs.map((pdf) => (
								<MobileDisplayLecture key={pdf._id} pdf={pdf} />
							))}
						</VStack>
					) : (
						//desktop view component here
						<DesktopDisplayLecture filteredPdfs={filteredPdfs}/>
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
