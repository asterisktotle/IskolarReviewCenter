import useAuthStore from '../store/authStore.ts';

import { useLocation, useNavigate } from 'react-router-dom';

import {
	Box,
	Flex,
	Avatar,
	HStack,
	Text,
	IconButton,
	Button,
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
	MenuDivider,
	useDisclosure,
	Stack,
	Image,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';

const userLinks = [
	{ name: 'Dashboard', path: '/user-dashboard' },
	{ name: 'Lectures', path: '/user-lectures' },
	{ name: 'Tests', path: '/user-tests' },
];
const adminLinks = [
	{ name: 'Dashboard', path: '/admin-dashboard' },
	{ name: 'Lectures', path: '/admin-lectures' },
	{ name: 'Tests', path: '/admin-tests' },
];

const NavLink = ({ children }) => {
	const navigate = useNavigate();
	const location = useLocation();
	const isActive = location.pathname === children.path;

	const handleClick = (path) => {
		navigate(path);
		console.log('click btn: ', children.name);
	};

	return (
		<Box
			as="a"
			px={2}
			py={1}
			cursor={'pointer'}
			rounded={'md'}
			_hover={{
				textDecoration: 'none',
				borderBottom: '2px',
				borderBottomColor: 'white',
			}}
			onClick={() => handleClick(children.path)}
			borderBottom={'2px solid'}
			borderBottomColor={isActive ? 'white' : 'transparent'}
		>
			{children.name}
		</Box>
	);
};

export default function Simple() {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { logout, userData } = useAuthStore();
	const navigate = useNavigate();

	return (
		<>
			<Box px={4}>
				<Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
					<IconButton
						size={'md'}
						icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
						aria-label={'Open Menu'}
						display={{ md: 'none' }}
						onClick={isOpen ? onClose : onOpen}
					/>
					<HStack spacing={8} alignItems={'center'}>
						<Image
							src="../../public/iskolar.png"
							alt="iskolar logo"
							w={'10rem'}
							// display={{ sm: 'none' }}
							onClick={() => console.log('click home')}
						/>
						<HStack
							as={'nav'}
							spacing={5}
							display={{ base: 'none', md: 'flex' }}
						>
							{adminLinks.map((name, path) => (
								<NavLink key={path}>{name}</NavLink>
							))}
						</HStack>
					</HStack>
					<Flex alignItems={'center'}>
						<Menu>
							<MenuButton
								as={Button}
								rounded={'full'}
								variant={'link'}
								cursor={'pointer'}
								minW={0}
							>
								<Avatar
									size={'md'}
									name={userData?.name}
									backgroundColor={'grey'}
								/>
							</MenuButton>
							<MenuList padding={4} color={'black'} backgroundColor={'white'}>
								<Text fontWeight={'bold'}>{userData?.name}</Text>
								{userData?.isAdmin && (
									<Text fontSize={'sm'} color={'gray.500'}>
										Admin
									</Text>
								)}
								<MenuDivider />

								<MenuItem
									onClick={() => {
										if (!userData?.isAccountVerified) {
											return navigate('/email-verify');
										}
										navigate('/account-settings');
									}}
								>
									{!userData?.isAccountVerified ? 'Verify Account' : 'Account'}
								</MenuItem>

								<MenuItem>Setting</MenuItem>
								<MenuDivider />
								{/* <MenuItem onClick={logout}>Verify Account</MenuItem> */}
								<MenuItem onClick={logout}>Logout</MenuItem>
							</MenuList>
						</Menu>
					</Flex>
				</Flex>

				{isOpen ? (
					<Box
						p={4}
						display={{ md: 'none' }}
						position={'fixed'}
						backgroundColor={'white'}
						zIndex={10}
						color={'blue.800'}
						w={'10rem'}
						borderRadius={5}
					>
						<Stack as={'nav'} spacing={5}>
							{userData?.isAdmin
								? adminLinks.map((name, path) => (
										<NavLink key={path}>{name}</NavLink>
								  ))
								: userLinks.map((name, path) => (
										<NavLink key={path}>{name}</NavLink>
								  ))}
						</Stack>
					</Box>
				) : null}
			</Box>
		</>
	);
}
