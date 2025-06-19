// PDF GET AND UPLOAD

import pdfModel from '../models/pdfSchema.js';
import deleteObject from '../utils/deleteObject.js';
import putObject from '../utils/putObject.js';

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
		const uniqueFilename = 'pdf/' + Date.now() + '-' + req.file.originalname;

		const { url, key } = await putObject(req.file, uniqueFilename); //upload to s3

		//save to database
		await pdfModel.create({
			title: title,
			subject: subject,
			category: category,
			pdf: uniqueFilename,
			s3Url: url,
		});
		res.json({
			success: true,
			message: 'PDF uploaded successfully',
			s3uRL: url,
			key: key,
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
		// const pdfBucket = getGridFSBucket();

		// Set content type and filename for download
		res.set('Content-Type', 'application/pdf');
		res.set('Content-Disposition', `inline; filename="${pdf.title}.pdf"`);

		// Stream the file from GridFS to the response
		// const downloadStream = pdfBucket.openDownloadStream(pdf.fileId);

		// downloadStream.on('error', (err) => {
		// 	res
		// 		.status(404)
		// 		.json({ success: false, message: 'File not found in storage' });
		// });

		// Pipe the file to the response
		// downloadStream.pipe(res);
	} catch (err) {
		console.error('Error downloading PDF:', err);
		res.status(500).json({ success: false, message: err.message });
	}
};

export const deletePdfById = async (req, res) => {
	try {
		const { id } = req.params;

		// Find the PDF document by ID
		const pdf = await pdfModel.findById(id);

		if (!pdf) {
			return res.status(404).json({ success: false, message: 'PDF not found' });
		}

		const data = await deleteObject(pdf.pdf);

		if (data.status !== 204) {
			return res.status(400).json({
				success: false,
				message: 'File did not delete',
			});
		}

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
