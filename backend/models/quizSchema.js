import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
	questionText: {
		type: String,
		required: true,
	},
	type: {
		type: String,
		enum: ['multiple-choice', 'short-answer'],
		required: true,
	},
	points: {
		type: Number,
		default: 1,
	},

	options: [
		{
			id: Number,
			text: String,
			isCorrect: Boolean,
		},
	],

	correctAnswer: {
		type: String,
	},
});
// Validate fields that is populated
QuestionSchema.pre('save', function (next) {
	if (this.type === 'multiple-choice') {
		if (!Array.isArray(this.options) || this.options.length === 0) {
			return next(new Error('Multiple-choice must have options'));
		}

		const correctOption = this.options.filter(
			(option) => option.isCorrect
		).length;

		if (correctOption === 0) {
			return next(new Error('Question must have correct answer'));
		}

		this.correctAnswer = undefined;
	}
	if (this.type === 'short-answer') {
		this.options = undefined;
		if (!this.correctAnswer || this.correctAnswer.trim() === '') {
			return next(new Error('Short-answer must have a correctAnswer.'));
		}
	}
	next();
});

const QuizSchema = new Schema(
	{
		title: {
			type: String,
			required: true,
		},
		subject: {
			type: String,
			enum: ['mesl', 'mdsp', 'pipe'],
			required: true,
		},
		category: {
			type: String,
			enum: ['terms', 'weekly-test', 'take-home-test', 'pre-board-exam'],
		},
		questions: [QuestionSchema],
		totalPoints: {
			type: Number,
			default: 0,
		},
		passingScore: {
			type: Number,
			default: 50,
		},
		timeLimit: {
			type: Number,
			default: 0, // in minutes
		},
		isPublished: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

QuizSchema.pre('save', function (next) {
	this.totalPoints = this.questions.reduce(
		(sum, questions) => sum + questions.points,
		0
	);
	next();
});

const QuizAttemptSchema = new Schema({
	quiz: {
		type: Schema.Types.ObjectId,
		ref: 'Quiz',
		required: true,
	},
	quizTitle: {
		type: String,
		required: true,
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: 'user',
		required: true,
	},
	startedAt: {
		type: Date,
		default: Date.now,
	},
	completedAt: {
		type: Date,
	},
	answers: [
		{
			questionId: {
				type: Schema.Types.ObjectId,
				required: true,
			},
			
			selectedOption: {
				type: Schema.Types.ObjectId,
				ref: 'Question.options', // reference to the options in QuestionSchema
			}, // for multiple-choice or true/false
			textAnswer: String, // for short-answer
			isCorrect: Boolean,
			pointsEarned: Number,
		},
	],
	currentScore: {
		type: Number,
		required: true,
	},
	scores: {
		type: [Number],	
		default: [],
	},
	currentPercentageScore: {
		type: Number,

	},
	percentageScores: {
		type: [Number],
		default: [],
	},
	passed: {
		type: Boolean,
	},
	attemptNumber: {
		type: Number,
		default: 1,
	},
	 attemptDates: {
        type: [Date],
        default: [] 
    },
	
});

const Quiz = mongoose.model('Quiz', QuizSchema);
const QuizAttempt = mongoose.model('QuizAttempt', QuizAttemptSchema);

export { Quiz, QuizAttempt };
