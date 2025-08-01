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
import { useNavigate } from 'react-router-dom';
import { PdfFiles } from '../../store/adminStore';

const DesktopDisplayLecture = ({filteredPdfs} : {filteredPdfs: PdfFiles[]}) => {
    const navigate = useNavigate()

    const handleViewPdf = (pdfId: string) => {
		navigate(`/view-pdf/${pdfId}`);
	};

    return (
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
}

export default DesktopDisplayLecture;