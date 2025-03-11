import express from 'express';
import multer from 'multer';
import { uploadPdf } from '../controllers/featuresController.js';

const featuresRoute = express.Router();

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

featuresRoute.post('/pdf-lectures', upload.single('file'), uploadPdf);

export default featuresRoute;
