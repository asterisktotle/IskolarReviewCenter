import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import authRouter from './routes/auth-route.js';
import userRouter from './routes/user-route.js';
import featuresRoute from './routes/features-route.js';
// multer -------------------

// const storage = multer.diskStorage({
// 	destination: function (req, file, cb) {
// 		cb(null, './files');
// 	},
// 	filename: function (req, file, cb) {
// 		const uniqueSuffix = Date.now();
// 		cb(null, uniqueSuffix + file.originalname);
// 	},
// });

// const upload = multer({ storage: storage });

// ---------------

const app = express();
const port = process.env.PORT || 3001;
connectDB();

// //multer
// app.post('/upload-files', upload.single('file'), async (req, res) => {
// 	console.log(req.file);
// });

const allowedOrigins = ['http://localhost:5173'];

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: allowedOrigins, credentials: true }));

app.listen(port, () =>
	console.log(`Server started at http://localhost:${port} `)
);

//end point
app.get('/', (req, res) => res.send('<h1>API IS WORKING</h1>'));
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/pdf', featuresRoute);
