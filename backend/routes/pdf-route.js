import express from 'express';
import multer from 'multer';
import {
	deletePdfById,
	downloadPdfById,
	editPdfTitleById,
	findPdfByTitle,
	getAllPdf,
	uploadPdf,
} from '../controllers/featuresController.js';

const pdfRoute = express.Router();

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

// handle pdf
pdfRoute.post('/pdf-lectures', upload.single('file'), uploadPdf);
pdfRoute.get('/pdf-lectures', getAllPdf);
pdfRoute.get('/pdf-lectures/search', findPdfByTitle);
pdfRoute.get('/pdf-lectures/:id', downloadPdfById);
pdfRoute.delete('/pdf-lectures/:id', deletePdfById);
pdfRoute.put('/pdf-lectures/:id', editPdfTitleById);

export default pdfRoute;
