// import { Button, Avatar, AvatarBadge } from '@chakra-ui/react';
// import {
// 	Popover,
// 	PopoverTrigger,
// 	PopoverContent,
// 	PopoverBody,
// 	PopoverArrow,
// 	Portal,
// 	Image,
// 	Box,
// 	Flex,
// } from '@chakra-ui/react';
import useAuthStore from '../store/authStore.ts';

import { useState } from 'react';
import {
	Image,
	Avatar,
	AvatarBadge,
	Box,
	Flex,
	IconButton,
	Drawer,
	DrawerOverlay,
	DrawerContent,
	DrawerCloseButton,
	DrawerBody,
	Button,
} from '@chakra-ui/react';
import { FiMenu } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const NavBar = () => {
	const navigate = useNavigate();
	const [isOpen, setIsOpen] = useState(false);
	const toggleSidebar = () => setIsOpen(!isOpen);
	const { logout, userData } = useAuthStore();

	return (
		<div className="flex justify-between pt-4 ">
			<>
				{/* Sidebar Toggle Button */}
				<IconButton
					aria-label="icon"
					icon={<FiMenu />}
					onClick={toggleSidebar}
					position="fixed"
					top="20px"
					left="20px"
					zIndex={10}
					colorScheme="blue"
				/>

				{/* Sidebar Drawer */}
				<Drawer isOpen={isOpen} placement="left" onClose={toggleSidebar}>
					<DrawerOverlay />
					<DrawerContent bg="gray.800" color="white">
						<DrawerCloseButton mt={2} color="white" />

						<DrawerBody mt={10}>
							<Flex flexDirection="column" gap={4}>
								<Button
									onClick={() => navigate('/dashboard')}
									colorScheme="blue"
								>
									Dashboard
								</Button>
								<Button
									onClick={() => navigate('/account-settings')}
									colorScheme="blue"
								>
									Account Settings
								</Button>
								<Button onClick={() => navigate('/quiz')} colorScheme="blue">
									Quizzes
								</Button>
								<Button
									onClick={() => navigate('/lectures')}
									colorScheme="blue"
								>
									Lectures
								</Button>
								<Button onClick={logout} colorScheme="red">
									Logout
								</Button>
							</Flex>
						</DrawerBody>
					</DrawerContent>
				</Drawer>
			</>
		</div>
	);
};

export default NavBar;
