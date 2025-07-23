import {
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	TableContainer,
	Box,
	Badge,
} from '@chakra-ui/react';

type TableHeadTypes = string[]
const tableHeadContent: TableHeadTypes = ['Subject', 'Category', 'Items', 'PassingScore', 'TimeLimit']


const DisplayTableHead = ({listOfContent }: {listOfContent:TableHeadTypes}) => {
    
    return (
        <>
        {
           listOfContent.map((content) => {


               <Th
                  textAlign={'center'}
                  color="white"
                  fontSize="sm"
                  fontWeight="bold"
              >
              {content.toUpperCase()}
              </Th>

           })  
        }
        </> 
    )
}

const DesktopDisplay = ({filteredQuizzes, handlePlayQuiz}) => {
  return (
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
                        <DisplayTableHead listOfContent={tableHeadContent}/>
                    </Tr>
                </Thead>
                <Tbody>
                    {filteredQuizzes.filter(q => q.isPublished).map((quiz) => (
                        <Tr
                        
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
}

export default DesktopDisplay