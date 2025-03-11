import { getGridFSBucket } from '../config/db.js';
import pdfModel from '../models/pdfSchema.js';

export const uploadPdf = async (req, res) => {
	try {
		if (!req.file) {
			return res
				.status(400)
				.json({ success: false, message: 'No file uploaded' });
		}

		const title = req.body.title || 'Untitled';
		const uniqueFilename = Date.now() + '-' + req.file.originalname;

		// Get GridFS bucket
		const pdfBucket = getGridFSBucket();

		// Promise-based approach to handle the upload
		const uploadFile = () => {
			return new Promise((resolve, reject) => {
				// Create upload stream to GridFS
				const uploadStream = pdfBucket.openUploadStream(uniqueFilename, {
					contentType: req.file.mimetype,
					metadata: { title },
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
			pdf: uniqueFilename,
			fileId: fileId,
		});
		res.json({
			success: true,
			message: 'PDF uploaded successfully',
			fileId: fileId,
			filename: uniqueFilename,
		});
	} catch (err) {
		return res.json({ success: false, message: err.message });
	}

	console.log(req.file);
};
