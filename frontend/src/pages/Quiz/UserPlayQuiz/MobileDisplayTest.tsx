import {
	Text,
	Box,
	Card,
	CardBody,
	Stack,
	Badge,
	HStack,
	Button,
	Icon,
} from '@chakra-ui/react';
import {
	MdCheck,
	MdHourglassBottom,
	MdHourglassDisabled,
	MdOutlineChecklist,
} from 'react-icons/md';

import { useNavigate } from 'react-router-dom';
import { QuizProfile } from '../../../types/QuizTypes';

const MobileDisplayTest = ({quiz}: {quiz:QuizProfile}) => {

    const navigate = useNavigate()

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
                            <Button fontSize="sm" onClick={() => navigate(`/user-tests/play/${quiz._id}`)}>	
                                Tap to Play →
                            </Button>
                            
                    </Stack>
                </CardBody>
            </Card>
        );
  
}

export default MobileDisplayTest