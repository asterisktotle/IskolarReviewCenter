import {
	loginAccount,
	logOutAccount,
	registerAccount,
	sendOtp,
	verifyOtp,
} from '../controllers/authController.js';
import { userAuth } from '../middleware/userAuth.js';
import express from 'express';

const authRouter = express.Router();

authRouter.post('/register', registerAccount);
authRouter.post('/login', loginAccount);
authRouter.post('/logout', logOutAccount);
authRouter.post('/send-otp', userAuth, sendOtp);
authRouter.post('/verify-otp', userAuth, verifyOtp);

export default authRouter;
