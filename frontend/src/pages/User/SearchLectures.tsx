import {
	Input,
	VStack,
	Box,
	Stack,
	InputGroup,
	InputLeftElement,
	Select,
} from '@chakra-ui/react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

// refactor the this component by using search term
interface SearchLectureProps {
	categories: string[];
	subjects: string[];
	filters: {
		searchTerm: string;
		selectedCategory:
			| 'all'
			| 'terms'
			| 'weekly-test'
			| 'take-home-test'
			| 'pre-board-exam';
		selectedSubject: 'all' | 'mesl' | 'mdsp' | 'pipe';
	};
	onFiltersChange: (filters: Partial<SearchComponentProps['filters']>) => void;
}

const SearchLectures = ({
    pdfList,
    isMobile,
    setS

    }) => {

    	// Get unique categories and subjects for filters
	const categories = [...new Set(pdfList?.map((pdf) => pdf.category) || [])];
	const subjects = [...new Set(pdfList?.map((pdf) => pdf.subject) || [])];

  
    return (
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
  )
}

export default SearchLectures