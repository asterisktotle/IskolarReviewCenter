import {
    Text,
    Box,
    Card,
    CardBody,
    Stack,
    Badge,
    Flex,
    HStack,
} from '@chakra-ui/react';
import { PdfFiles } from '../../store/adminStore';
import { useNavigate } from 'react-router-dom';

// Mobile Card Component
const MobileDisplayLecture = ({ pdf }: {pdf: PdfFiles}) => {
    const navigate = useNavigate()
    
    const handleViewPdf = (pdfId: string) => {
	    navigate(`/view-pdf/${pdfId}`);
	};

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
                    <Text onClick={() => handleViewPdf(pdf._id)} fontSize="sm" color="purple.300">
                        Tap to view →
                    </Text>
                </Flex>
            </Stack>
        </CardBody>
    </Card>
    )
}

export default MobileDisplayLecture;

