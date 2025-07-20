import { useEffect } from 'react';
import AdminStore from '../../store/adminStore';
import {
	Container,
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	Text,
	Badge,
	Box,
	useBreakpointValue,
	Stack,
	Card,
	CardBody,
	Heading,
} from '@chakra-ui/react';

const AdminDashBoard = () => {
	const { getUsersList, usersList } = AdminStore();

	// Responsive breakpoint to switch between table and card view
	const isMobile = useBreakpointValue({ base: true, md: false });

	useEffect(() => {
		getUsersList();
	}, []);

	// Mobile card view component
	const MobileUserCard = ({ user }) => (
		<Card mb={3} border="2px" borderColor="gray.200">
			<CardBody>
				<Stack spacing={2}>
					<Box>
						<Text fontSize="sm" color="gray.200" fontWeight="medium">
							Name
						</Text>
						<Text fontWeight="semibold">{user.name}</Text>
					</Box>
					<Box>
						<Text fontSize="sm" color="gray.200" fontWeight="medium">
							Email
						</Text>
						<Text fontSize="sm" wordBreak="break-word">
							{user.email}
						</Text>
					</Box>
					<Box>
						<Text fontSize="sm" color="gray.200" fontWeight="medium" mb={1}>
							Status
						</Text>
						<Badge colorScheme={user.isAccountVerified ? 'green' : 'red'}>
							{user.isAccountVerified ? 'Verified' : 'Not Verified'}
						</Badge>
					</Box>
				</Stack>
			</CardBody>
		</Card>
	);

	return (
		<Container maxW={'full'} px={{ base: 4, md: 6 }} mt={4}>
			<Heading
				size={{ base: 'lg', md: 'xl' }}
				mb={{ base: 4, md: 6 }}
				textAlign={{ base: 'center', md: 'left' }}
			>
				Dashboard
			</Heading>

			{isMobile ? (
				// Mobile view - Card layout
				<Box>
					{usersList && usersList.length > 0 ? (
						usersList.map((user) => (
							<MobileUserCard key={user._id} user={user} />
						))
					) : (
						<Card>
							<CardBody>
								<Text textAlign="center" color="gray.500" py={4}>
									No users found
								</Text>
							</CardBody>
						</Card>
					)}
				</Box>
			) : (
				// Desktop view - Table layout
				<Box
					overflowX="auto"
					border="1px"
					borderColor="gray.200"
					borderRadius="md"
				>
					<Table variant="simple" minW="600px">
						<Thead bg="gray.50">
							<Tr>
								<Th fontSize="sm" fontWeight="semibold">
									Name
								</Th>
								<Th fontSize="sm" fontWeight="semibold">
									Email
								</Th>
								<Th fontSize="sm" fontWeight="semibold">
									Verified
								</Th>
							</Tr>
						</Thead>
						<Tbody>
							{usersList && usersList.length > 0 ? (
								usersList.map((user) => (
									<Tr key={user._id} _hover={{ bg: 'gray.600' }}>
										<Td fontWeight="medium">{user.name}</Td>
										<Td color="gray.200">{user.email}</Td>
										<Td>
											<Badge
												colorScheme={user.isAccountVerified ? 'green' : 'red'}
												variant="subtle"
											>
												{user.isAccountVerified ? 'Verified' : 'Not Verified'}
											</Badge>
										</Td>
									</Tr>
								))
							) : (
								<Tr>
									<Td colSpan={3} textAlign="center" py={8} color="gray.200">
										No users found
									</Td>
								</Tr>
							)}
						</Tbody>
					</Table>
				</Box>
			)}
		</Container>
	);
};

export default AdminDashBoard;
