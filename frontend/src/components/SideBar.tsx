import {
	Avatar,
	Divider,
	Flex,
	Heading,
	IconButton,
	Text,
} from '@chakra-ui/react';

const SideBarNav = () => {
	return (
		<Flex
			pos={'sticky'}
			left={5}
			h={'95vh'}
			marginTop={'2.5vh'}
			mb={4}
			bg={'whiteAlpha.100'}
		>
			<Flex>
				<IconButton
					aria-label="icon"
					background={'none'}
					mt={5}
					_hover={{ background: 'none' }}
					// icon={<FiMenu />}
				/>
			</Flex>

			<Divider />

			<Flex mt={4} align={'center'}>
				<Avatar size={'md'} />
				<Flex flexDir={'column'} ml={'4'}>
					<Heading as={'h3'} size={'lg'}>
						{' '}
						John Doe
					</Heading>
					<Text color={'whiteAlpha.700'}> Admin</Text>
				</Flex>
			</Flex>
		</Flex>
	);
};

export default SideBarNav;
