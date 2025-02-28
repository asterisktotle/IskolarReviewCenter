import {
	isAuthenticated,
	loginAccount,
	logOutAccount,
	registerAccount,
	resetPasswordOtp,
	sendOtp,
	verifyChangePassWithOtp,
	verifyOtp,
} from '../controllers/authController.js';
import { userAuth } from '../middleware/userAuth.js';
import express from 'express';

const authRouter = express.Router();

authRouter.post('/register', registerAccount);
authRouter.post('/login', loginAccount);
authRouter.post('/logout', logOutAccount);
//verify account
authRouter.post('/send-otp', userAuth, sendOtp);
authRouter.post('/verify-otp', userAuth, verifyOtp);
//reset password
authRouter.post('/reset-pass-otp', resetPasswordOtp);
authRouter.post('/verify-reset-pass', verifyChangePassWithOtp);
//check user if authenticated
authRouter.get('/is-auth', userAuth, isAuthenticated);

export default authRouter;
