import {
	Container,
	FormControl,
	VStack,
	Editable,
	EditableInput,
	EditablePreview,
	FormLabel,
	RadioGroup,
	Stack,
	Radio,
	Input,
	Select,
	HStack,
} from '@chakra-ui/react';

const AdminTests = () => {
	// TODO
	// 1. Test selection
	// 2. Auto numbering of test items
	// 3. Implement AutoSave hook Debounced Saving

	// const handleTestSelection = () => {

	// }

	return (
		<Container
			flexDirection={'column'}
			mb={'5'}
			maxW={'full'}
			p={5}
			borderColor={'gray.500'}
			borderRadius={'md'}
			bgColor={'whiteAlpha.50'}
		>
			<form>
				<VStack spacing="3">
					<FormControl>
						<Editable defaultValue="Quiz Title" borderBottom={'1px'}>
							<EditablePreview />
							<EditableInput />
						</Editable>
					</FormControl>

					<FormControl as={'fieldset'}>
						<FormLabel>Subject</FormLabel>
						<RadioGroup defaultValue="mesl">
							<Stack direction={'row'} spacing={4}>
								<Radio value="mesl">MESL</Radio>
								<Radio value="pipe">PIPE</Radio>
								<Radio value="mdsp">MDSP</Radio>
							</Stack>
						</RadioGroup>
					</FormControl>

					<FormControl as={'fieldset'}>
						<FormLabel>Test Category</FormLabel>
						<RadioGroup defaultValue="terms">
							<Stack
								direction={{ base: 'column', md: 'row' }}
								spacing={{ base: 2, md: 4 }}
							>
								<Radio value="terms">Terms</Radio>
								<Radio value="weekly-test">Weekly Exam</Radio>
								<Radio value="take-home-test">Take Home Exam</Radio>
								<Radio value="pre-board-exam">Pre-board Exam</Radio>
							</Stack>
						</RadioGroup>
					</FormControl>
				</VStack>
			</form>

			<br />
			<form>
				{/* Select Test Categories */}
				<HStack spacing={4}>
					{' '}
					{/* spacing is the gap */}
					<FormControl w={'150%'}>
						<Input border="none" borderBottom="1px" />
					</FormControl>
					<Select defaultValue="multiple-choice" bg="gray.100" color="black">
						<option style={{ color: 'black' }} value="multiple-choice">
							Multiple choice
						</option>
						<option style={{ color: 'black' }} value="short-answer">
							Short answer
						</option>
					</Select>
				</HStack>

				<FormControl as={'fieldset'}>
					{/* Multiple choice */}
					<RadioGroup defaultValue="mesl">
						<Stack direction={'column'} spacing={4}>
							<Radio value="mesl">MESL</Radio>
							<Radio value="pipe">PIPE</Radio>
							<Radio value="mdsp">MDSP</Radio>
						</Stack>
					</RadioGroup>
					{/* short-answer*/}
					<Input placeholder="Answer" />
				</FormControl>
			</form>
		</Container>
	);
};

export default AdminTests;
