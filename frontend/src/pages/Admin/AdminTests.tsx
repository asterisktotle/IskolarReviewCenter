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
	Flex,
	IconButton,
	NumberInput,
	NumberInputField,
} from '@chakra-ui/react';
import { AddIcon, CloseIcon, DeleteIcon } from '@chakra-ui/icons';
import { useEffect, useState } from 'react';
import useQuestionMaker, { QuestionOption } from '../../hooks/useQuestionMaker';
import { QuestionData } from '../../hooks/useQuestionMaker';

const AdminTests = () => {
	const {
		addQuestion,
		questions,
		removeQuestion,
		updateQuestion,
		quizProfile,
		setQuizProfile,
	} = useQuestionMaker();

	//DONE
	const handleChangeQuizProfile = (field: string, value: string) => {
		setQuizProfile({
			...quizProfile,
			[field]: value,
		});
	};
	// Parse the input text into separate options
	const parseOptions = (text: string) => {
		if (!text.trim()) return [];

		const line = text.split('\n').filter((line) => line.trim() !== '');

		const options: QuestionOption[] = line.map((option, index) => {
			return {
				id: index + 1,
				text: option.trim(),
				isCorrect: false,
			};
		});

		console.log('parsed options: ', options);
		return options;
	};
	//DONE
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

		let formattedOptions: QuestionOption[];

		if (updatedOption.match(/[\n\r]+/)) {
			formattedOptions = parseOptions(updatedOption);
			console.log('it detects line break: ', formattedOptions);
		} else {
			console.log('it doesnt detect line break: ', formattedOptions);
			formattedOptions = currentQuestion.options.map((option) =>
				option.id === optionId ? { ...option, text: updatedOption } : option
			);
		}

		const updatedQuestion: QuestionData = {
			...currentQuestion,
			options: formattedOptions,
		};
		updateQuestion(questionId, updatedQuestion);
	};

	//DONE
	const handleUpdateShortAnswer = (
		questionId: number,
		shortAnswerValue: string
	) => {
		const currentQuestion = questions.find((q) => q.id === questionId);

		if (!currentQuestion) {
			return console.log(`Question with ID ${questionId} does not exist`);
		}

		if (currentQuestion.type !== 'short-answer') {
			return console.log(`Question with ID ${questionId} is not short-answer`);
		}

		const updatedQuestion = {
			...currentQuestion,
			correctAnswer: shortAnswerValue,
		};

		updateQuestion(questionId, updatedQuestion);
	};
	//DONE
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

	const handleRemoveQuestion = (questionId: number) => {
		if (questions.length === 0) {
			return null;
		} else {
			removeQuestion(questionId);
		}
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

		const newOptions = updatedQuestion.options.filter(
			(option) => option.id !== optionId
		);

		const question = {
			...updatedQuestion,
			options: [...newOptions],
		};

		updateQuestion(questionId, question);
	};

	const handleCorrectOption = (questionId: number, optionId: number) => {
		const currentQuestion = questions.find((q) => q.id === questionId);

		if (!currentQuestion) {
			return console.log(`Question with ID ${questionId} does not exist`);
		}
		if (currentQuestion.type !== 'multiple-choice') {
			return console.log(
				`Question with ID ${questionId} is not multiple-choice`
			);
		}

		const correctOption = currentQuestion.options.map((option) => {
			if (option.id === optionId) {
				return {
					...option,
					isCorrect: true,
				};
			} else
				return {
					...option,
					isCorrect: false,
				};
		});

		const updatedQuestion: QuestionData = {
			...currentQuestion,
			options: [...correctOption],
		};
		updateQuestion(questionId, updatedQuestion);
	};

	// Creates default quiz form
	useEffect(() => {
		if (questions.length === 0) {
			const defaultQuizForm: QuestionData = {
				id: Date.now(),
				questionText: 'Untitled question',
				type: 'multiple-choice',
				options: [
					{ id: 1, text: 'Option 1', isCorrect: true },
					{ id: 2, text: 'Option 2', isCorrect: false },
				],
				points: 1,
			};

			addQuestion(defaultQuizForm);
		}
	}, []);

	// DEBUGGER, REMOVE THIS BEFORE SHIPPING
	useEffect(() => {
		questions.map((quest) => {
			console.log('correct answer', quest.correctAnswer);
			console.log('options', quest.options);
		});
	}, [questions]);
	const QuestionFormat = (question: QuestionData) => {
		return (
			<form key={question.id} style={{ marginBottom: '20px', width: '100%' }}>
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
						onClick={() => handleRemoveQuestion(question.id)}
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
											value={choice.id.toString()}
											isChecked={choice.isCorrect}
											onChange={() =>
												handleCorrectOption(question.id, choice.id)
											}
										/>

										<Input
											value={choice.text}
											onChange={(e) =>
												handleUpdateOptions(
													question.id,
													choice.id,
													e.target.value
												)
											}
											onPaste={(e) => {
												// Prevent default to stop the normal paste behavior
												e.preventDefault();

												// Get pasted text from clipboard
												const pastedText = e.clipboardData.getData('text');

												// Check if pasted text contains line breaks
												if (pastedText.match(/[\n\r]+/)) {
													// Handle multi-line paste
													handleUpdateOptions(
														question.id,
														choice.id,
														pastedText
													);
												} else {
													// Normal single-line paste, update just this field
													handleUpdateOptions(
														question.id,
														choice.id,
														pastedText
													);
												}
											}}
											placeholder="Enter option text"
											mr={2}
											// ...rest of your styling props
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
					{question.type === 'short-answer' && (
						<Input
							onChange={(e) => {
								handleUpdateShortAnswer(question.id, e.target.value);
							}}
							placeholder="Answer"
						/>
					)}
				</FormControl>
			</form>
		);
	};
	return (
		<Container
			flexDirection={'column'}
			mb={'5'}
			maxW={'full'}
			p={5}
			borderColor={'gray.500'}
			borderRadius={'md'}
			bgColor={'whiteAlpha.50'}
			minH={'100vh'} // Add minimum height to ensure background extends
			pb={'10'}
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
			{questions.length === 0 && (
				<Button
					onClick={handleAddQuestionButton}
					leftIcon={<AddIcon />}
					iconSpacing="2"
					px={{ base: 4, md: 6 }}
					minW={{ base: 'auto', md: '8rem' }}
					size="md"
				>
					Add Question
				</Button>
			)}

			<VStack spacing={4} width="100%" align="stretch" pb={8}>
				{questions.map((q) => QuestionFormat(q))}
			</VStack>
		</Container>
	);
};

export default AdminTests;
