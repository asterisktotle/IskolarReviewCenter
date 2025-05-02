import {
	Container,
	FormControl,
	VStack,
	Editable,
	EditableInput,
	EditablePreview,
	EditableTextarea,
	FormLabel,
	RadioGroup,
	Stack,
	Radio,
	Input,
	Select,
	HStack,
	Button,
	Flex,
	IconButton,
	NumberInput,
	NumberInputField,
	typography,
} from '@chakra-ui/react';
import { AddIcon, CloseIcon, DeleteIcon } from '@chakra-ui/icons';
import { useState } from 'react';
import useQuestionMaker from '../../hooks/useQuestionMaker';
import { QuestionData } from '../../hooks/useQuestionMaker';

const AdminTests = () => {
	const [testType, setTestType] = useState('multiple-choice');

	const [quizProfile, setQuizProfile] = useState({
		title: 'Quiz Title',
		subject: 'mesl',
		category: 'terms',
		timeLimit: 0,
		passingScore: 0,
		totalPoints: 0,
	});

	const [questionContent, setQuestionContent] = useState([
		{
			id: 0,
			questionText: 'Untitled question',
			type: 'multiple-choice',
			options: [
				{ id: 1, text: 'hypotenuse', isCorrect: true },
				{ id: 2, text: 'centroid', isCorrect: false },
				{ id: 3, text: 'vertex', isCorrect: false },
				{ id: 4, text: 'height', isCorrect: false },
			],
			correctAnswer: '', //for short-answer
			points: 1,
		},
	]);

	// REMOVE THIS AND USE THE OPTIONS FROM QUESTIONCONTENT
	// const [options, setOptions] = useState([
	// 	{ text: 'hypotenuse', isCorrect: true },
	// 	{ text: 'centroid', isCorrect: false },
	// 	{ text: 'vertex', isCorrect: false },
	// 	{ text: 'height', isCorrect: false },
	// ]);

	// REMOVE THIS AND USE THE HANDLEQUESTIONCONTENT
	// const [formData, setFormData] = useState<QuestionData>({
	// 	type: 'multiple-choice',
	// 	questionText: 'What is the longest side of the triangle',
	// 	options: options,
	// 	correctAnswer: '',
	// 	points: 1,
	// });
	const { addQuestion, questions, removeQuestion } = useQuestionMaker();

	const handleChangeQuizProfile = (field, value) => {
		setQuizProfile({
			...quizProfile,
			[field]: value,
		});
	};
	//START AT THIS AND REPLACE setForm - updating the option or short answer
	const handleUpdateOptions = (questionId, optionId, updatedOption) => {
		const content = questionContent.map((quest) => {
			if (quest.id === questionId) {
				if (quest.type === 'multiple-choice') {
					return {
						...quest,
						options: quest.options.map((option) => {
							if (option.id === optionId) {
								return { ...option, text: updatedOption };
							}
							return option;
						}),
					};
				}
				if (quest.type === 'short-answer') {
					return {
						...quest,
						correctAnswer: updatedOption,
					};
				}
			}
			return quest;
		});

		setQuestionContent(content);
	};

	// DONE, DON NOT TOUCH
	const handleQuestionType = (questionId, type) => {
		const updatedQuestionType = questionContent.map((quest) => {
			if (quest.id === questionId) {
				return {
					...quest,
					type,
				};
			}
			return quest;
		});
		setQuestionContent(updatedQuestionType);
	};

	// DONE
	const handleAddQuestionButton = (e) => {
		e.preventDefault();

		const baseQuestion: QuestionData = {
			id: Date.now(),
			questionText: 'Untitled question',
			type: 'multiple-choice', // or 'short-answer'
			options: [{ text: `Option 1`, isCorrect: true }], // required if type is 'multiple-choice'
			points: 1,
		};

		addQuestion(baseQuestion);
	};

	// UPDATE THIS TO SIMILAR TO HANDLEADDQUESTION BUTTON
	const handleAddOption = () => {
		// setOptions([...options, { text: 'Option 1', isCorrect: false }]);
	};

	// const handleOptionChange = (index, value) => {
	// 	const textOption = value;

	// }
	// UPDATE THIS, USE OPTIONS FROM ARRAY QUESTIONCONTENT
	const handleRemoveChoices = (questionId, optionId) => {
		const updatedOptions = [...options];
		updatedOptions.splice(index, 1);
		setOptions(updatedOptions);
	};

	const handleCorrectOption = (index) => {
		const updatedOption = options.map((option, i) => ({
			...option,
			isCorrect: i === index,
		}));
		setOptions(updatedOption);
	};

	const handleTextChange = (index, optionText) => {
		const updatedOption = [...options];
		updatedOption[index].text = optionText;
		setOptions(updatedOption);
	};

	// const handleShortAnswer = (index, shortAns) => {
	// 	setFormData();
	// };

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
						<Editable
							defaultValue={quizProfile.title}
							borderBottom={'1px'}
							w={'full'}
							onChange={(value) => handleChangeQuizProfile('title', value)}
						>
							<EditablePreview />
							<EditableInput />
						</Editable>
					</FormControl>

					<FormControl as={'fieldset'}>
						<FormLabel>Subject</FormLabel>
						<RadioGroup
							onChange={(value) => handleChangeQuizProfile('subject', value)}
							defaultValue="mesl"
						>
							<Stack direction={'row'} spacing={4}>
								<Radio value="mesl">MESL</Radio>
								<Radio value="pipe">PIPE</Radio>
								<Radio value="mdsp">MDSP</Radio>
							</Stack>
						</RadioGroup>
					</FormControl>

					<FormControl as={'fieldset'}>
						<FormLabel>Test Category</FormLabel>
						<RadioGroup
							defaultValue="terms"
							onChange={(value) => handleChangeQuizProfile('category', value)}
						>
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
					<FormControl as={'fieldset'}>
						<FormLabel>Time Limit (minutes)</FormLabel>
						<NumberInput
							onChange={(value) => handleChangeQuizProfile('timeLimit', value)}
						>
							<NumberInputField
								placeholder="0"
								defaultValue={0}
								w={'fit-content'}
							/>
						</NumberInput>
					</FormControl>
					<Button>Publish</Button>
				</VStack>
			</form>

			<br />

			{questionContent &&
				questionContent.length > 0 &&
				questionContent.map((question) => (
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
									onChange={(e) =>
										handleQuestionType(question.id, e.target.value)
									}
									bg="gray.100"
									color="black"
								>
									{/* THIS ONE IS HARDCODED */}
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
								w={{ base: 'auto', md: '5rem' }}
							/>
							<Button
								onClick={handleAddQuestionButton}
								leftIcon={<AddIcon />}
								iconSpacing={'-0.5'}
								w={{ base: 'auto', md: '5rem' }}
							/>
						</HStack>

						<FormControl as={'fieldset'}>
							{/* Multiple choice */}
							{testType === 'multiple-choice' && (
								<RadioGroup>
									<Stack direction={'column'} spacing={4}>
										{question.options.map((choice, index) => (
											<Flex key={index} alignItems={'center'}>
												<Radio
													// w={'full'}
													value={choice.text}
													isChecked={choice.isCorrect}
													onChange={() => handleCorrectOption(index)}
												/>

												<Input
													value={choice.text}
													// onChange={(e) =>
													// 	handleTextChange(index, e.target.value)
													// }
													onChange={(e) =>
														handleUpdateOptions(
															question.id,
															choice.id,
															e.target.value
														)
													}
													placeholder="Enter option text"
													mr={2}
													borderColor={'transparent'}
													outline={'none'}
													_focus={{
														borderBottom: '2px solid',
														outline: 'none,',
														boxShadow: 'none',
														border: 'none',
														borderColor: 'blue.500',
													}}
													_hover={{
														outline: 'none,',
														boxShadow: 'none',
														border: 'none',
														borderBottom: '2px solid',
														borderColor: 'blue.500',
													}}
												/>
												<IconButton
													size="sm"
													ml={2}
													icon={<CloseIcon />}
													aria-label="Remove option"
													onClick={() => handleRemoveChoices(choice.id)}
												/>
											</Flex>
										))}
										<IconButton
											size="sm"
											ml={'auto'}
											icon={<AddIcon />}
											aria-label="Add Option"
											onClick={handleAddOption}
										/>
									</Stack>
								</RadioGroup>
							)}
							{testType === 'short-answer' && <Input placeholder="Answer" />}
						</FormControl>
					</form>
				))}

			{/* FIXED FORM */}
			{/* <form
				style={{
					backgroundColor: '#0C638D',
					padding: '1rem',
					borderRadius: '0.5rem',
				}}
			>
			
				<Stack spacing={1} direction={{ base: 'column', md: 'row' }}>
				
					<FormControl w={{ base: '100%', md: '150%' }}>
						<Editable defaultValue="Untitled question">
							<EditablePreview />
							<EditableTextarea
								resize="none" // disables manual resizing
								overflow="hidden"
								onInput={(e) => {
									e.target.style.height = 'auto';
									e.target.style.height = e.target.scrollHeight + 'px';
								}}
							/>
						</Editable>
					</FormControl>

					<HStack spacing={1} w="100%">
						<FormControl>
							<Select
								onChange={(e) => setTestType(e.target.value)}
								bg="gray.100"
								color="black"
								w={'auto'}
							>
								<option value="multiple-choice" style={{ color: 'black' }}>
									Multiple choice
								</option>
								<option value="short-answer" style={{ color: 'black' }}>
									Short answer
								</option>
							</Select>
						</FormControl>

						<Button
							w={{ base: 'auto', md: '5rem' }}
							leftIcon={<DeleteIcon />}
							iconSpacing="-0.5"
						/>
						<Button
							w={{ base: 'auto', md: '5rem' }}
							onClick={handleAddQuestionButton}
							leftIcon={<AddIcon />}
							iconSpacing="-0.5"
						/>
					</HStack>
				</Stack>

	

				<FormControl as={'fieldset'}>
			
					{testType === 'multiple-choice' && (
						<RadioGroup defaultValue={options[0].text}>
							<Stack pt={4} direction={'column'} spacing={1}>
								{options.map((choice, index) => (
									<Flex key={index} alignItems={'center'}>
										<Radio
											// w={'full'}
											value={choice.text}
											isChecked={choice.isCorrect}
											onChange={() => handleCorrectOption(index)}
										/>

										<Input
											value={choice.text}
											onChange={(e) => handleTextChange(index, e.target.value)}
											// onChange={(e) => handleUpdateOptions( , index, e.target.value)}
											placeholder="Enter option text"
											mr={2}
											borderColor={'transparent'}
											outline={'none'}
											_focus={{
												borderBottom: '2px solid',
												outline: 'none,',
												boxShadow: 'none',
												border: 'none',
												borderColor: 'blue.500',
											}}
											_hover={{
												outline: 'none,',
												boxShadow: 'none',
												border: 'none',
												borderBottom: '2px solid',
												borderColor: 'blue.500',
											}}
										/>
										<IconButton
											size="sm"
											ml={2}
											icon={<CloseIcon />}
											aria-label="Remove option"
											onClick={() => handleRemoveChoices(index)}
										/>
									</Flex>
								))}
								<IconButton
									size="sm"
									ml={'auto'}
									icon={<AddIcon />}
									aria-label="Add Option"
									onClick={handleAddOption}
								/>
							</Stack>
						</RadioGroup>
					)}
					{testType === 'short-answer' && <Input placeholder="Answer" />}
				</FormControl>
			</form> */}
		</Container>
	);
};

export default AdminTests;
