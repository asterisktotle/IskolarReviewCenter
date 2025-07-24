import {
	Heading,
	Text,
	VStack,
	SimpleGrid,
	TabPanel,
	Center,
	Spinner,
	Icon,
} from '@chakra-ui/react';
import {
	MdBook,
} from 'react-icons/md';

import { useMemo } from 'react';
import QuizCard from '../pages/Quiz/QuizCard';

import { QuizProfile, SubjectTypes } from '../types/QuizTypes';


type SubjectTabTypes = {
	isLoading: boolean;
	quizzesFetch: QuizProfile[];
	subject: SubjectTypes;
}

export const SubjectQuizTab = ({ isLoading, quizzesFetch, subject } : SubjectTabTypes) => {
	// Responsibilities:
	// It fetches and display all quizzes based on subject

	const quizzesFetched = useMemo(
		() => quizzesFetch.filter((quiz) => quiz.subject === subject),
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
							No {subject.toUpperCase()} Quizzes
						</Heading>
						<Text color="gray.400" textAlign="center" maxW="300px">
							There are currently no quizzes available for the{' '}
							{subject.toUpperCase()} subject. New quizzes will appear here when
							they're published.
						</Text>
					</VStack>
				</Center>
			)}
		</TabPanel>
	);
};


