// models/pdfSchema.js (Make sure it looks like this)
import mongoose from 'mongoose';

const pdfSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	pdf: {
		type: String,
		required: true,
	},
	fileId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
	},
	uploadDate: {
		type: Date,
		default: Date.now,
	},
});

const pdfModel = mongoose.model('Pdf', pdfSchema);
export default pdfModel;
