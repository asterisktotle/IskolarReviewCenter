import { getGridFSBucket } from '../config/db.js';
import pdfModel from '../models/pdfSchema.js';
import { Quiz, QuizAttempt } from '../models/quizSchema.js';

// PDF GET AND UPLOAD

export const uploadPdf = async (req, res) => {
	try {
		if (!req.file) {
			return res
				.status(400)
				.json({ success: false, message: 'No file uploaded' });
		}

		const title = req.body.title || 'Untitled';
		const subject = req.body.subject || 'mesl';
		const category = req.body.category || 'lecture';
		const uniqueFilename = Date.now() + '-' + req.file.originalname;

		// Get GridFS bucket
		const pdfBucket = getGridFSBucket();

		// Promise-based approach to handle the upload
		const uploadFile = () => {
			return new Promise((resolve, reject) => {
				// Create upload stream to GridFS
				const uploadStream = pdfBucket.openUploadStream(uniqueFilename, {
					contentType: req.file.mimetype,
					metadata: { subject, category, title },
				});

				const fileId = uploadStream.id;

				// Write buffer to the stream
				uploadStream.write(req.file.buffer);
				uploadStream.end();

				uploadStream.on('finish', () => {
					resolve(fileId);
				});

				uploadStream.on('error', (error) => {
					reject(error);
				});
			});
		};

		const fileId = await uploadFile();

		await pdfModel.create({
			title: title,
			subject: subject,
			category: category,
			pdf: uniqueFilename,
			fileId: fileId,
		});
		res.json({
			success: true,
			message: 'PDF uploaded successfully',
			fileId: fileId,
			filename: uniqueFilename,
			subject: subject,
			category: category,
		});
	} catch (err) {
		return res.json({ success: false, message: err.message });
	}
};

export const getAllPdf = async (req, res) => {
	try {
		const pdf = await pdfModel.find().sort({ uploadDate: -1 });
		return res.json({ success: true, data: pdf, count: pdf.length });
	} catch (err) {
		console.log('get Pdf error: ', err.message);
		return res.json({ success: false, message: err.message });
	}
};

export const findPdfByTitle = async (req, res) => {
	try {
		const searchTitle = req.query.title || '';
		const pdf = await pdfModel
			.find({ title: { $regex: searchTitle, $options: 'i' } })
			.sort({ uploadDate: -1 });

		return res.json({ success: true, data: pdf, count: pdf.length });
	} catch (err) {
		console.log('get findByCategory error: ', err.message);
		return res.json({ success: false, message: err.message });
	}
};

export const downloadPdfById = async (req, res) => {
	try {
		const id = req.params.id;

		// Find the PDF document by ID
		const pdf = await pdfModel.findById(id);

		if (!pdf) {
			return res.status(404).json({ success: false, message: 'PDF not found' });
		}

		// Get GridFS bucket
		const pdfBucket = getGridFSBucket();

		// Set content type and filename for download
		res.set('Content-Type', 'application/pdf');
		res.set('Content-Disposition', `inline; filename="${pdf.title}.pdf"`);

		// Stream the file from GridFS to the response
		const downloadStream = pdfBucket.openDownloadStream(pdf.fileId);

		downloadStream.on('error', (err) => {
			res
				.status(404)
				.json({ success: false, message: 'File not found in storage' });
		});

		// Pipe the file to the response
		downloadStream.pipe(res);
	} catch (err) {
		console.error('Error downloading PDF:', err);
		res.status(500).json({ success: false, message: err.message });
	}
};

export const deletePdfById = async (req, res) => {
	try {
		const id = req.params.id;

		// Find the PDF document by ID
		const pdf = await pdfModel.findById(id);

		if (!pdf) {
			return res.status(404).json({ success: false, message: 'PDF not found' });
		}

		// Get GridFS bucket
		const pdfBucket = getGridFSBucket();

		// Delete file from GridFS
		await pdfBucket.delete(pdf.fileId);

		// Delete the PDF document
		await pdfModel.findByIdAndDelete(id);

		res.json({
			success: true,
			message: 'PDF deleted successfully',
		});
	} catch (err) {
		console.error('Error deleting PDF:', err);
		res.status(500).json({ success: false, message: err.message });
	}
};

export const editPdfTitleById = async (req, res) => {
	try {
		const id = req.params.id;
		const { title, subject, category } = req.body;

		if (!title && !subject && !category) {
			return res.json({ success: false, message: 'No fields to update' });
		}

		const updatedFields = {};
		if (title) {
			updatedFields.title = title;
		}
		if (subject) {
			updatedFields.subject = subject;
		}
		if (category) {
			updatedFields.category = category;
		}

		const updatedPdf = await pdfModel.findByIdAndUpdate(id, updatedFields, {
			new: true,
		});

		if (!updatedPdf) {
			return res.status(404).json({ success: false, message: 'PDF not found' });
		}

		return res.json({
			success: true,
			message: 'PDF title updated successfully',
			data: updatedPdf,
		});
	} catch (err) {
		console.log('editPdf title api error: ', err.message);
		return res.json({ success: false, message: err.message });
	}
};

// QUIZ MAKER
export const createQuiz = async (req, res) => {
	const {
		title,
		subject,
		category,
		questions,
		totalPoints,
		passingScore,
		timeLimit,
	} = req.body;

	if ((!title || !subject || !questions, !category)) {
		return res.json({ success: false, message: 'Provide all the fields' });
	}

	if (questions.length < 1) {
		return res.json({
			success: false,
			message: 'At least one question is required',
		});
	}

	try {
		const quiz = new Quiz({
			title,
			subject,
			category,
			questions,
			totalPoints: totalPoints || 0,
			passingScore: passingScore || 70,
			timeLimit: timeLimit || 240, //minutes
		});

		await quiz.save();
		return res.json({
			success: true,
			message: 'Quiz created successfully',
			quizId: quiz._id,
		});
	} catch (err) {
		return res.json({ success: false, message: err.message });
	}
};

export const getAllQuizzes = async (req, res) => {
	try {
		const filter = {};

		if (req.query.subject) {
			filter.subject = req.query.subject;
		}

		if (req.query.category) {
			filter.category = req.query.category;
		}

		if (req.query.title) {
			filter.title = { $regex: req.query.search, $options: 'i' }; // case-insensitive
		}

		const quizzes = await Quiz.find(filter);

		return res.json({ success: true, data: quizzes });
	} catch (err) {
		return res.json({
			success: false,
			message: 'Failed to retrieve quizzes',
			error: err.message,
		});
	}
};

export const submitAndEvaluateQuiz = async (req, res) => {
	const { quizId, answers, userId } = req.body;
	if (!quizId || !answers) {
		return res.json({
			success: false,
			message: 'Provide the Quiz ID and answers',
		});
	}

	const quiz = await Quiz.findById(quizId);
	if (!quiz) {
		return res.json({ success: false, message: 'Quiz not found' });
	}

	let score = 0;

	for (let userAnswer of answers) {
		const question = quiz.questions.id(userAnswer.questionId);
		if (!question) continue; // skip question not found

		let isCorrect = false;
		let pointsEarned = 0;

		if (question.type === 'multiple-choice' || question.type === 'true-false') {
			// CONTINUE HERE EVALUATING THE ANSWER
		}
	}
};

export const getUserQuizHistory = async (req, res) => {
	try {
		const { userId, quizId, answers, score, percentageScore, passed } =
			req.body;

		if (!userId || !quizId || !answers) {
			return res.json({ success: false, message: 'Provide all the fields' });
		}

		const quizAttempt = new QuizAttempt({
			user: userId,
			quiz: quizId,
			answers,
			score,
			percentageScore,
			passed,
		});
	} catch (err) {
		return res.json({ success: false, message: err.message });
	}
};
