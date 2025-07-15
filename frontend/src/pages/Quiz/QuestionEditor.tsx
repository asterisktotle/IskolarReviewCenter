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
	Icon,
	IconButton,
	NumberInput,
	NumberInputField,
	Tabs,
	TabList,
	TabPanels,
	Tab,
	TabPanel,
	Box,
	Text,
	Divider,
	Badge,
	Card,
	CardHeader,
	CardBody,
	Heading,
	useColorModeValue,
	useToast,

} from '@chakra-ui/react';
import { QuestionOption } from '../../hooks/useQuestionMaker';
import parseOptions from '../../utils/parserOptions';
import QuizStore, { QuestionData } from '../../store/quizStore';
import convertQuestionType from '../../utils/converQuestionType';
import { AddIcon, CloseIcon, DeleteIcon } from '@chakra-ui/icons';
const QuestionEditor = ({question} : {question: QuestionData}) => {
    const {
		
		questions,
		removeQuestion,
		updateQuestion,
	} = QuizStore();

	const borderColor = useColorModeValue('gray.200', 'gray.600');
    const cardBg = useColorModeValue('white', 'gray.800');
    

    
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
        } else {
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
        <Card key={question.id} mb={4} bg={cardBg} borderColor={borderColor}>
            <CardBody>
                <VStack spacing={4} align="stretch">
                    {/* Question Header */}
                    <HStack justify="space-between">
                        <Badge colorScheme="blue" px={2} py={1}>
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
                                colorScheme="red"
                                onClick={() => handleRemoveQuestion(question.id)}
                                icon={<DeleteIcon />}
                                aria-label="Delete question"
                            />
                        </HStack>
                    </HStack>

                    {/* Question Text */}
                    <FormControl>
                        <FormLabel fontSize="sm" fontWeight="medium">
                            Question Text
                        </FormLabel>
                        <Editable
                            placeholder={'Enter a question'}								
                            onSubmit={(value) =>
                                updateQuestion(question.id, {
                                    ...question,
                                    questionText: value,
                                })
                            }
                        >
                            <EditablePreview
                                p={3}
                                borderRadius="md"
                                border="1px"
                                borderColor={borderColor}
                                minH="40px"
                                _hover={{ bg: 'gray.50' }}
                            />
                            <EditableInput p={3} />
                        </Editable>
                    </FormControl>

                    {/* Question Options */}
                    {question.type === 'multiple-choice' ? (
                        <FormControl>
                            <HStack justify="space-between" mb={2}>
                                <FormLabel fontSize="sm" fontWeight="medium" mb={0}>
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
                                    {question.options?.map((choice, index) => (
                                        <HStack key={choice.id} spacing={2}>
                                            <Radio
                                                value={choice.id.toString()}
                                                colorScheme="green"
                                            />
                                            <Input
                                
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
                                    ))}
                                </VStack>
                            </RadioGroup>
                        </FormControl>
                    ) : (
                        <FormControl>
                            <FormLabel fontSize="sm" fontWeight="medium">
                                Correct Answer
                            </FormLabel>
                            <Input
                                onChange={(e) =>
                                    handleUpdateShortAnswer(question.id, e.target.value)
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

export default QuestionEditor;