import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';

const app = express();
dotenv.config();
const port = process.env.PORT || 3001;
connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true }));

app.listen(port, () =>
	console.log(
		`Server started at http://localhost:${port} ${process.env.JWT_SECRET} this`
	)
);

app.get('/', (req, res) => res.send('<h1>Hello </h1>'));
