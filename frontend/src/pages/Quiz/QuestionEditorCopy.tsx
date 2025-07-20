import {
	FormControl,
	VStack,
	Editable,
	EditableInput,
	EditablePreview,
	FormLabel,
	RadioGroup,
	Radio,
	Input,
	Select,
	HStack,
	Button,
	IconButton,
	NumberInput,
	NumberInputField,
	Badge,
	Card,
	CardBody,
	useColorModeValue,
} from '@chakra-ui/react';
import QuizStore, { QuestionData } from '../../store/quizStore';
import convertQuestionType from '../../utils/converQuestionType';
import { AddIcon, CloseIcon, DeleteIcon } from '@chakra-ui/icons';
import parseOptions from '../../utils/parserOptions';
import { QuestionOption } from '../../hooks/useQuestionMaker';
const QuestionEditorCopy = ({ question }: { question: QuestionData }) => {
	const {questions, removeQuestion, updateQuestion, quizProfile } = QuizStore();
	
	

	const borderColor = useColorModeValue('gray.200', 'gray.600');
	const cardBg = useColorModeValue('white', 'gray.800');

	const handleUpdateOptions = (
		questionId: number | string,
		optionId: number | string,
		updatedOption: string // the content
	) => {
		

		

		// const currentQuestion = question((q) => q._id === questionId);
		// if (!currentQuestion) {
		// 	console.log(`Question with ID ${questionId} does not exist`);
		// 	return null
		// }

		// if (currentQuestion.type !== 'multiple-choice') {
		// 	return console.log(
		// 		`Question with ID ${questionId} is not multiple-choice`
		// 	);
		// }

		// console.log(
		// 	`Question ID: ${questionId}, optionId: ${optionId}, updatedOption: ${updatedOption}`
		// )

		// // //For bulk answer paste
		// let formattedOptions: QuestionOption[];

		// if (updatedOption.match(/[\n\r]+/)) {
		// 	formattedOptions = parseOptions(updatedOption);
		// } else {
		// 	formattedOptions = currentQuestion.options.map((option) =>
		// 		option.id === optionId ? { ...option, text: updatedOption } : option
		// 	);
		// }

		// const updatedQuestion: QuestionData = {
		// 	...currentQuestion,
		// 	options: formattedOptions,
		// };
		updateQuestion(questionId, updatedQuestion);
	};

	const handleUpdateShortAnswer = (
		questionId: number | string,
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

	const handleQuestionType = (
		questionId: number,
		questionType: 'multiple-choice' | 'short-answer'
	) => {
		const currentQuestion = questions.find((q) => q.id === questionId);

		if (!currentQuestion) {
			return console.log(`Question with ID ${questionId} does not exist`);
		}

		const updatedQuestion = convertQuestionType(currentQuestion, questionType);
		updateQuestion(questionId, updatedQuestion);
	};

	const handleRemoveQuestion = (questionId: number) => {
		if (questions.length === 0) {
			return null;
		} else {
			removeQuestion(questionId);
		}
	};

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
			text: '',
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

	return (
		<Card  mb={4} bg={cardBg} borderColor={borderColor}>
			<CardBody>
				<VStack spacing={4} align="stretch">
					{/* Question Header */}
					<HStack justify="space-between">
						<Badge colorScheme="blue" rounded={5} px={3} py={1}>
							Question {questions.indexOf(question) + 1}
						</Badge>
						<HStack spacing={2}>
							<Select
								value={question.type}
								onChange={(e) =>
									handleQuestionType(question.id, e.target.value)
								}
								size="sm"
								maxW="200px"
							>
								<option value={'multiple-choice'}>Multiple Choice</option>
								<option value={'short-answer'}>Short Answer</option>
							</Select>
							<IconButton
								size="sm"
								background="red"
								onClick={() => handleRemoveQuestion(question.id)}
								icon={<DeleteIcon />}
								aria-label="Delete question"
							/>
						</HStack>
					</HStack>

					{/* Question Text */}
					<FormControl 
					>
						<FormLabel htmlFor={question._id || question.id.toString()} fontSize="sm" fontWeight="medium">
							Question Text
						</FormLabel>
						<Editable
							placeholder={'Enter a question'}
							key={question._id || question.id}
							id={question._id || question.id.toString()}
							value={question.questionText}
							onSubmit={(value) =>
								updateQuestion(question.id, {
									...question,
									questionText: value,
								})
							}
						>
							<EditablePreview
								p={3}
								w={'full'}
								borderRadius="md"
								border="2px"
								borderColor={borderColor}
								minH="40px"

							/>
							<EditableInput
								p={3}
								id={question._id || question.id.toString()}
								// key={question._id}
								onChange={(e) =>
									updateQuestion(question.id, {
										...question,
										questionText: e.target.value,
									})
								}
							/>
						</Editable>
					</FormControl>

					{/* Question Options */}
					{question.type === 'multiple-choice' ? (
						<FormControl>
							<HStack justify="space-between" mb={2}>
								<FormLabel as={'label'} fontSize="sm" fontWeight="medium" mb={0}>
									Answer Choices
								</FormLabel>
								<Button
									size="sm"
									leftIcon={<AddIcon />}
									onClick={() => handleAddOption(question.id)}
									colorScheme="green"
								>
									Add Option
								</Button>
							</HStack>

							<RadioGroup
								value={
									question.options
										.find((opt) => opt.isCorrect)
										?.id.toString() || ''
								}
								onChange={(value) =>
									handleCorrectOption(question.id, Number(value))
								}
							>
								<VStack spacing={2} align="stretch">
									{question.options?.map((choice, index) => {
										console.log('option id: ', choice.id)										
										console.log('option _id db: ', choice._id)										
										return ( 
										<HStack key={`${question.id}-${choice.id}`} spacing={2}>
											<Radio value={choice.id.toString()} colorScheme="green" />
											<Input
												id={ question._id + choice._id||choice.id.toString()}
												onChange={(e) =>
													handleUpdateOptions(
														question.id,
														choice.id,
														e.target.value
													)
												}
												value={choice.text}
												placeholder={`Option ${index + 1}`}
												size="sm"
												onPaste={(e) => {
													e.preventDefault();
													const pastedText = e.clipboardData.getData('text');
													handleUpdateOptions(
														question.id,
														choice.id,
														pastedText
													);
												}}
											/>
											<IconButton
												size="sm"
												colorScheme="red"
												variant="ghost"
												icon={<CloseIcon />}
												onClick={() =>
													handleRemoveChoices(question.id, choice.id)
												}
												aria-label="Remove option"
											/>
										</HStack>

										)

									}
									)}
								</VStack>
							</RadioGroup>
						</FormControl>
					) : (
						<FormControl>
							<FormLabel fontSize="sm" fontWeight="medium">
								Correct Answer
							</FormLabel>
							<Input
								// id={ question._id || Date.now.toString()}
								onChange={(e) =>
									handleUpdateShortAnswer(question._id ? question._id : question.id.toString() , e.target.value)
								}
								placeholder="Enter the correct answer"
								size="sm"
							/>
						</FormControl>
					)}

					{/* Points */}
					<FormControl maxW="100px">
						<FormLabel fontSize="sm" fontWeight="medium">
							Points
						</FormLabel>
						<NumberInput
							size="sm"
							defaultValue={question.points}
							min={1}
							onChange={(value) =>
  								updateQuestion(question._id, {
									...question,
									points: parseInt(value) || 1,
								})
							}
						>
							<NumberInputField />
						</NumberInput>
					</FormControl>
				</VStack>
			</CardBody>
		</Card>
	);
};

export default QuestionEditorCopy;
