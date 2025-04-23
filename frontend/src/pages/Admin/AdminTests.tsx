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
	Button,
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import { useState } from 'react';
import useQuestionMaker from '../../hooks/useQuestionMaker';
import { QuestionData } from '../../hooks/useQuestionMaker';

const AdminTests = () => {
	const [testType, setTestType] = useState('multiple-choice');

	const [options, setOptions] = useState([
		{ text: 'hypotenuse', isCorrect: true },
		{ text: 'centroid', isCorrect: false },
		{ text: 'vertex', isCorrect: false },
		{ text: 'height', isCorrect: false },
	]);
	const [formData, setFormData] = useState<QuestionData>({
		type: 'multiple-choice',
		questionText: 'What is the longest side of the triangle',
		options: options,
		correctAnswer: '',
		points: 1,
	});
	const { addQuestion, questions, removeQuestion } = useQuestionMaker();

	const handleAddQuestionButton = (e) => {
		e.preventDefault();
		const questionData = {
			...formData,
		};
		addQuestion(questionData);
	};

	// const handleDeletQuestionButton;

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

			{questions &&
				questions.length > 0 &&
				questions.map((question) => (
					<form>
						{/* Select Test Categories */}
						<HStack spacing={1}>
							{' '}
							{/* spacing is the gap */}
							<FormControl w={'150%'}>
								<Input border="none" borderBottom="1px" />
							</FormControl>
							<FormControl>
								<Select
									value={question.type}
									onChange={(e) => setTestType(e.target.value)}
									bg="gray.100"
									color="black"
								>
									<option style={{ color: 'black' }} value={'multiple-choice'}>
										Multiple choices
									</option>
									<option style={{ color: 'black' }} value={'short-answer'}>
										Short answer
									</option>
								</Select>
							</FormControl>
							{/* <AddIcon /> */}
							<Button
								onClick={() => removeQuestion(question.id)}
								leftIcon={<DeleteIcon />}
								iconSpacing={'-0.5'}
							/>
							<Button
								onClick={handleAddQuestionButton}
								leftIcon={<AddIcon />}
								iconSpacing={'-0.5'}
								// defaultValue="multiple-choice"
							/>
						</HStack>

						<FormControl as={'fieldset'}>
							{/* Multiple choice */}
							{testType === 'multiple-choice' && (
								<RadioGroup>
									<Stack direction={'column'} spacing={4}>
										{question.options?.map((option) => (
											<Radio value={option.text}>{option.text}</Radio>
										))}
									</Stack>
								</RadioGroup>
							)}
							{testType === 'short-answer' && <Input placeholder="Answer" />}
						</FormControl>
					</form>
				))}

			<form>
				{/* Select Test Categories */}
				<HStack spacing={1}>
					{' '}
					{/* spacing is the gap */}
					<FormControl w={'150%'}>
						<Input border="none" borderBottom="1px" />
					</FormControl>
					<FormControl>
						<Select
							onChange={(e) => setTestType(e.target.value)}
							bg="gray.100"
							color="black"
						>
							<option value="multiple-choice" style={{ color: 'black' }}>
								Multiple choice
							</option>
							<option value="short-answer" style={{ color: 'black' }}>
								Short answer
							</option>
						</Select>
					</FormControl>
					{/* <AddIcon /> */}
					<Button leftIcon={<DeleteIcon />} iconSpacing={'-0.5'} />
					<Button
						onClick={handleAddQuestionButton}
						leftIcon={<AddIcon />}
						iconSpacing={'-0.5'}
						// defaultValue="multiple-choice"
					/>
				</HStack>

				{/* {handleCreateQuestion} */}

				<FormControl as={'fieldset'}>
					{/* Multiple choice */}
					{testType === 'multiple-choice' && (
						<RadioGroup defaultValue="mesl">
							<Stack direction={'column'} spacing={4}>
								<Radio value="mesl">MESL</Radio>
								<Radio value="pipe">PIPE</Radio>
								<Radio value="mdsp">MDSP</Radio>
							</Stack>
						</RadioGroup>
					)}
					{testType === 'short-answer' && <Input placeholder="Answer" />}
				</FormControl>
			</form>
		</Container>
	);
};

export default AdminTests;
