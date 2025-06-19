import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import authRouter from './routes/auth-route.js';
import userRouter from './routes/user-route.js';
import pdfRoute from './routes/pdf-route.js';
import quizRouter from './routes/quiz-route.js';
const app = express();
const port = process.env.PORT || 3001;
connectDB();

// const s3 = new AWS.S3();
// s3.putObject*=({

// })

// console.log('local key: ', process.env.AWS_BUCKET_NAME);

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
app.use('/api/pdf', pdfRoute);
app.use('/api/quiz', quizRouter);
