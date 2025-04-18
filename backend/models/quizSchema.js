import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
	type: {
		type: String,
		enum: ['multiple-choice', 'true-false', 'fill-in-the-blank'],
		required: true,
	},
	options: [
		{
			text: String,
			isCorrect: Boolean,
		},
	],

	//for fill-in-the-blank
	correctAnswer: {
		type: String,
	},
	points: {
		type: Number,
		default: 1,
	},
});

const QuizSchema = new Schema({
	title: {
		type: String,
		required: true,
	},
	subject: {
		type: String,
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
		default: 70,
	},
	timeLimit: {
		type: Number,
		default: 240, // in minutes
	},
	createdDate: { timestamps: true },
});

const QuizAttemptSchema = new Schema({
	quiz: {
		type: Schema.Types.ObjectId,
		ref: 'Quiz',
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
			questionText: String, // optional: store the actual question for record-keeping
			selectedOptions: [String], // for multiple-choice or true/false
			textAnswer: String, // for fill-in-the-blank
			isCorrect: Boolean,
			pointsEarned: Number,
		},
	],
	score: {
		type: Number,
	},
	percentageScore: {
		type: Number,
	},
	passed: {
		type: Boolean,
	},
});

const Quiz = mongoose.model('Quiz', QuizSchema);
const QuizAttempt = mongoose.model('QuizAttempt', QuizAttemptSchema);

export { Quiz, QuizAttempt };
