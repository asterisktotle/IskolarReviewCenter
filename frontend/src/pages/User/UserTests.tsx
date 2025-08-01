import {
	Text,
	Container,
	VStack,
	Box,
	Spinner,
	useBreakpointValue,
} from '@chakra-ui/react';
import { useMemo, useState } from 'react';
import QuizStore from '../../store/quizStore';
import { MdOutlineClass } from 'react-icons/md';
import FilterQuiz from '../../utils/filteredQuiz';
import DesktopDisplay from '../Quiz/UserPlayQuiz/DesktopDisplay';
import SearchComponent from '../Quiz/UserPlayQuiz/SearchComponent';
import { useQuery } from '@tanstack/react-query';
import { QuizProfile } from '../../types/QuizTypes';
import MobileDisplayTest from '../Quiz/UserPlayQuiz/MobileDisplayTest';

const UsersTest = () => {
	//RESPONSIBILITY
	// It display list of quiz
	// It can search quizzes
	// It can play and navigate to the test mode page
	const { fetchQuizParams } = QuizStore();

	const [filters, setFilters] = useState<{
		searchTerm: string;
		selectedCategory:
			| 'all'
			| 'terms'
			| 'weekly-test'
			| 'take-home-test'
			| 'pre-board-exam';
		selectedSubject: 'all' | 'mesl' | 'mdsp' | 'pipe';
	}>({
		searchTerm: '',
		selectedCategory: 'all',
		selectedSubject: 'all',
	});

	const handleFiltersChange = (newFilters: Partial<typeof filters>) => {
		setFilters((prev) => ({ ...prev, ...newFilters }));
	};

	const {
		data: quizzesFetch = [] as QuizProfile[],
		isLoading,
		error,
	} = useQuery({
		queryKey: ['quizzes'],
		queryFn: () => fetchQuizParams(),
		staleTime: 5 * 60 * 1000, //5 minutes refresh
		gcTime: 10 * 60 * 1000, // 10 minutes to keep in cache
		refetchOnWindowFocus: false, // don't refresh on tab switch
		refetchOnMount: false, // don't refresh if data exist
		retry: 2, // retry failed request 2 times
		retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
	});

	// Memoize expensive filtering operation
	const filteredQuizzes = useMemo(() => {
		if (!quizzesFetch) {
			console.log('quizzes fetch is undefined: ', quizzesFetch);
			return [];
		}

		return FilterQuiz({ quizzesFetch, filters });
	}, [quizzesFetch, filters]);

	// Memoize categories and subject to prevent recalculation
	const { categories, subjects } = useMemo(() => {
		const categ = [
			...new Set(filteredQuizzes?.map((quiz) => quiz.category) || []),
		];
		const subj = [
			...new Set(filteredQuizzes?.map((quiz) => quiz.subject) || []),
		];
		return { categories: categ, subjects: subj };
	}, [filteredQuizzes]);

	// Responsive breakpoint
	const isMobile = useBreakpointValue({ base: true, lg: false });
	const cardSpacing = useBreakpointValue({ base: 3, md: 4 });

	if (isLoading) {
		return (
			<Container maxW="full" centerContent py={10}>
				<VStack spacing={4}>
					<Spinner size="xl" color="purple.500" thickness="4px" />
					<Text color="gray.300">Loading your quizzes..</Text>
				</VStack>
			</Container>
		);
	}

	if (error) {
		return (
			<Container maxW="full" centerContent py={10}>
				<Text color="red.400">Error loading quizzes: {error.message}</Text>
			</Container>
		);
	}

	return (
		<Container maxW="full" p={0}>
			<VStack spacing={6} align={'stretch'} marginX={4} marginY={4}>
				{/* Search and Filters */}
				<SearchComponent
					categories={categories}
					subjects={subjects}
					filters={filters}
					onFiltersChange={handleFiltersChange}
				/>

				{/* Content */}
				{filteredQuizzes && filteredQuizzes.length > 0 ? (
					isMobile ? (
						//  Mobile Card View
						<VStack spacing={cardSpacing} align="stretch" >
							{filteredQuizzes
								.filter((q) => q.isPublished)
								.map((quiz) => (
									<MobileDisplayTest key={quiz._id} quiz={quiz} />
								))}
						</VStack>
					) : (
						// Desktop Table View
						<DesktopDisplay filteredQuizzes={filteredQuizzes} />
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
								{filters.searchTerm ||
								filters.selectedCategory !== 'all' ||
								filters.selectedSubject !== 'all'
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
