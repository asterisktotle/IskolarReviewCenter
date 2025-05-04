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
import { useEffect, useState } from 'react';
import useQuestionMaker from '../../hooks/useQuestionMaker';
import { QuestionData } from '../../hooks/useQuestionMaker';

const AdminTests = () => {
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
				{ id: 1, text: 'Option 1', isCorrect: true },
				{ id: 2, text: 'Option 2', isCorrect: false },
			],
			correctAnswer: '', //for short-answer
			points: 1,
		},
	]);

	const QuestionFormat = (question: QuestionData) => {
		return (
			<form key={question.id}>
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
							onChange={(e) => handleQuestionType(question.id, e.target.value)}
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
					{question.type === 'multiple-choice' && (
						<RadioGroup>
							<Stack direction={'column'} spacing={4}>
								{question.options?.map((choice, index) => (
									<Flex key={index} alignItems={'center'}>
										<Radio
											value={choice.text}
											isChecked={choice.isCorrect}
											onChange={() =>
												handleCorrectOption(question.id, choice.id)
											}
										/>

										<Input
											value={choice.text}
											onChange={(e) => {
												handleUpdateOptions(
													question.id,
													choice.id,
													e.target.value
												);
												console.log(e.target.value);
											}}
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
											onClick={() =>
												handleRemoveChoices(question.id, choice.id)
											}
										/>
									</Flex>
								))}
								<IconButton
									size="sm"
									ml={'auto'}
									icon={<AddIcon />}
									aria-label="Add Option"
									onClick={() => handleAddOption(question.id)}
								/>
							</Stack>
						</RadioGroup>
					)}
					{question.type === 'short-answer' && <Input placeholder="Answer" />}
				</FormControl>
			</form>
		);
	};

	const { addQuestion, questions, removeQuestion, updateQuestion } =
		useQuestionMaker();

	const handleChangeQuizProfile = (field, value) => {
		setQuizProfile({
			...quizProfile,
			[field]: value,
		});
	};
	//START AT THIS AND REPLACE setForm - updating the option or short answer
	const handleUpdateOptions = (
		questionId: number,
		optionId: number,
		updatedOption: string
	) => {
		const currentQuestion = questions.find((q) => q.id === questionId);
		if (!currentQuestion) {
			return console.log(`Question with ID ${questionId} does not exist`);
		}

		if (currentQuestion.type !== 'multiple-choice') {
			return console.log(
				`Question with ID ${questionId} is not multiple-choice`
			);
		}

		const updatedChoices = currentQuestion.options.map((option) => {
			if (option.id === optionId) {
				return {
					...option,
					text: updatedOption,
				};
			}
			return option;
		});

		const updatedQuestion: QuestionData = {
			...currentQuestion,
			options: [...updatedChoices],
		};
		updateQuestion(questionId, updatedQuestion);
	};

	// TODO
	// 1. Refactor removequestion, addnewoption
	// 2. the default quiz form question type does not update its short answer and multiplechoice
	// this is because it uses the question array from custom hook
	//  and default quiz id does not exist on the custom hook
	// DONE, DON NOT TOUCH
	const handleQuestionType = (
		questionId: number,
		questionType: 'multiple-choice' | 'short-answer'
	) => {
		const currentQuestion = questions.find((q) => q.id === questionId);

		if (!currentQuestion) {
			return console.log(`Question with ID ${questionId} does not exist`);
		}

		const baseQuestion = {
			id: currentQuestion.id,
			questionText: currentQuestion.questionText,
			points: currentQuestion.points,
		};

		const updatedQuestion: QuestionData =
			questionType === 'multiple-choice'
				? {
						...baseQuestion,
						type: 'multiple-choice',
						options: [{ id: 1, text: 'Option 1', isCorrect: true }],
				  }
				: {
						...baseQuestion,
						type: 'short-answer',
						correctAnswer: '',
				  };

		updateQuestion(questionId, updatedQuestion);
	};

	// DONE
	const handleAddQuestionButton = () => {
		const baseQuestion: QuestionData = {
			id: Date.now(),
			questionText: 'Untitled question',
			type: 'multiple-choice', // or 'short-answer'
			options: [{ text: `Option 1`, isCorrect: true, id: 1 }], // required if type is 'multiple-choice'
			points: 1,
		};

		addQuestion(baseQuestion);
	};

	// DONE
	const handleAddOption = (questionId: number) => {
		const currentQuestion = questions.find((q) => q.id === questionId);
		if (!currentQuestion) {
			return console.log(`Question with ID ${questionId} does not exist`);
		}
		if (currentQuestion.type !== 'multiple-choice') {
			return console.log(
				`Question with ID ${questionId} is not multiple-choice`
			);
		}

		const optionLength = currentQuestion.options.length;

		const newOption = {
			id: optionLength + 1,
			text: `Option ${optionLength + 1}`,
			isCorrect: false,
		};

		const updatedQuestion: QuestionData = {
			...currentQuestion,
			options: [...currentQuestion.options, newOption],
		};

		updateQuestion(questionId, updatedQuestion);
	};

	// const handleOptionChange = (index, value) => {
	// 	const textOption = value;

	// }
	// UPDATE THIS, USE OPTIONS FROM ARRAY QUESTIONCONTENT
	const handleRemoveChoices = (questionId: number, optionId: number) => {
		const updatedQuestion = questions.find((q) => q.id === questionId);
		if (!updatedQuestion) {
			return console.log(`Question with ID ${questionId} does not exist`);
		}

		if (updatedQuestion.type !== 'multiple-choice') {
			return console.log(
				`Question with ID ${questionId} is not multiple-choice`
			);
		}

		const newOptions = updatedQuestion.options.filter((q) => q.id !== optionId);

		const question = {
			...updatedQuestion,
			options: [...newOptions],
		};

		updateQuestion(questionId, question);
	};

	const handleCorrectOption = (questionId: number, optionId: number) => {
		const updatedOption = questionContent.map((quest) => {
			if (quest.id === questionId) {
				return {
					...quest,
					options: quest.options.map((option) => {
						if (option.id === optionId) {
							return { ...option, isCorrect: true };
						} else
							return {
								...option,
								isCorrect: false,
							};
					}),
				};
			}
			return quest;
		});
		setQuestionContent(updatedOption);
	};

	useEffect(() => {
		const correctAnswer = questions.map((quest) => {
			return console.log('choices: ', quest.options);
		});

		console.log(correctAnswer);
		// console.log(questionContent)
	}, [questions]);
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

			{questions && questions.length > 0
				? questions.map((question) => QuestionFormat(question))
				: QuestionFormat(questionContent[0])}
		</Container>
	);
};

export default AdminTests;
