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
} from '@chakra-ui/react';

const AdminDashBoard = () => {
	const { getUsersList, usersList } = AdminStore();

	useEffect(() => {
		getUsersList();
	}, []);

	return (
		<Container maxW={'full'} mt={4}>
			<Text fontSize="2xl" fontWeight="bold" mb={4}>
				DashBoard
			</Text>

			<Table
				variant="simple"
				width="full"
				border="1px"
				borderColor="gray.200"
				borderRadius="md"
			>
				<Thead bg="gray.50">
					<Tr>
						<Th>Name</Th>
						<Th>Email</Th>
						<Th>Verified</Th>
					</Tr>
				</Thead>
				<Tbody>
					{usersList && usersList.length > 0 ? (
						usersList.map((user) => (
							<Tr key={user._id}>
								<Td>{user.name}</Td>
								<Td>{user.email}</Td>
								<Td>
									<Badge colorScheme={user.isAccountVerified ? 'green' : 'red'}>
										{user.isAccountVerified ? 'Verified' : 'Not Verified'}
									</Badge>
								</Td>
							</Tr>
						))
					) : (
						<Tr>
							<Td colSpan={3} textAlign="center" py={4}>
								No users found
							</Td>
						</Tr>
					)}
				</Tbody>
			</Table>
		</Container>
	);
};

export default AdminDashBoard;
