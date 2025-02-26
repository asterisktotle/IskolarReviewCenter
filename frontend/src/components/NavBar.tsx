import {
	Box,
	Button,
	Circle,
	Avatar,
	AvatarBadge,
	List,
	ListItem,
	UnorderedList,
} from '@chakra-ui/react';
import {
	Popover,
	PopoverTrigger,
	PopoverContent,
	PopoverHeader,
	PopoverBody,
	PopoverFooter,
	PopoverArrow,
	PopoverCloseButton,
	PopoverAnchor,
	Portal,
	Image,
} from '@chakra-ui/react';
import useAuthStore from '../store/store';
import { useNavigate } from 'react-router-dom';

const NavBar = ({ login }: { login: boolean }) => {
	const navigate = useNavigate();
	const { logout, userData } = useAuthStore();

	return (
		<div className="flex justify-between pt-4 ">
			<Image
				src="../../public/iskolar.png"
				width={'150px'}
				objectFit="contain"
				alt="iskolar logo"
				onClick={() => navigate('/')}
			/>
			<Popover trigger="hover">
				<PopoverTrigger>
					{/* <Circle bg={'white'} size={'47px'} color={'black'}>
						{userData.name ? userData?.name[0] : 'Guest'}
					</Circle> */}
					<Avatar
						name={userData?.name ? userData?.name[0] : 'Guest'}
						bg="red.500"

						// INSERT PROFILE PICTURE HERE
						// src="https://bit.ly/broken-link"
					>
						{userData?.isAccountVerified && (
							<AvatarBadge boxSize="1.2em" bg="yellow.300" />
						)}
					</Avatar>
				</PopoverTrigger>
				<Portal>
					<PopoverContent w={'120px'} bg={'transparent'} alignItems={'center'}>
						<PopoverArrow />

						{/* <PopoverCloseButton /> */}
						<PopoverBody
							flex={1}
							display={'flex'}
							flexDirection={'column'}
							gap={2}
						>
							{/* <div className="flex flex-col"> */}
							<Button w={'100px'} onClick={logout} colorScheme="blue">
								Account
							</Button>
							<Button w={'100px'} onClick={logout} colorScheme="blue">
								Sign Out
							</Button>

							{userData?.isAccountVerified && (
								<Button
									w={'100px'}
									onClick={() => navigate('/email-verify')}
									colorScheme="yellow"
								>
									Verify Email
								</Button>
							)}

							{/* </div> */}
						</PopoverBody>
					</PopoverContent>
				</Portal>
			</Popover>
		</div>
	);
};

export default NavBar;
