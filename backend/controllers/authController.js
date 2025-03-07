import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import transporter from '../config/nodemailer.js';

export const registerAccount = async (req, res) => {
	const { name, email, password } = req.body;

	if (!name || !email || !password) {
		return res.json({ success: false, message: 'All fields must be answered' });
	}

	try {
		const existingEmail = await userModel.findOne({ email });

		if (existingEmail) {
			return res.json({ success: false, message: 'Email is already used.' });
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		//create a new user model and save it to mongoDB
		const user = new userModel({ name, email, password: hashedPassword });
		await user.save();

		//create a  token and stored it to cookie
		const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
			expiresIn: '7d',
		});
		res.cookie('token', token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
			maxAge: 3600 * 24 * 7,
		});

		// Generate a greeting email
		const greetingEmail = {
			from: process.env.SENDER_EMAIL,
			to: email,
			subject: 'WELCOME ISKOLAR!',
			text: `You've successfully created an account! You can now start to journey as future Mechanical Engineer`,
		};

		await transporter.sendMail(greetingEmail);

		return res.json({ success: true, message: 'Account created' });
	} catch (err) {
		return res.json({ success: false, message: err.message });
	}
};

export const loginAccount = async (req, res) => {
	const { email, password } = req.body;

	if (!email || !password) {
		return res.json({
			success: false,
			message: 'email and password are required',
		});
	}

	try {
		const user = await userModel.findOne({ email });

		if (!user) {
			return res.json({ success: false, message: 'User did not exist' });
		}

		const passwordIsMatch = await bcrypt.compare(password, user.password);

		if (!passwordIsMatch) {
			return res.json({ success: false, message: 'Incorrect password' });
		}

		//create a token and store it to cookie
		const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
			expiresIn: '7d',
		});
		res.cookie('token', token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
			maxAge: 3600 * 24 * 7 * 1000,
		});

		return res.json({ success: true, message: 'Login successfully' });
	} catch (err) {
		return res.json({ success: false, message: err.message });
	}
};

export const logOutAccount = async (req, res) => {
	try {
		res.clearCookie('token', {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
			path: '/',
		});

		return res.json({ success: true, message: 'Logged out successfully' });
	} catch (err) {
		return res.json({ success: false, message: err.message });
	}
};

//sends an otp to email
export const sendOtp = async (req, res) => {
	try {
		const { userId } = req.body;
		const user = await userModel.findById(userId);
		if (user.isAccountVerified) {
			return res.json({
				success: false,
				message: 'account is already verified',
			});
		}
		const otp = String(100000 + Math.floor(Math.random() * 900000));
		user.verifyOtp = otp;
		user.verifyOtpExpireAt = new Date(Date.now() + 60 * 15 * 1000);

		await user.save();

		// Generate an otp email
		const otpEmail = {
			from: process.env.SENDER_EMAIL,
			to: user.email,
			subject: 'Iskolar Account Verification OTP',
			text: `Please don't share your OTP code. This OTP will expired at 15 minutes. Your OTP verification code is: ${otp}`,
		};
		await transporter.sendMail(otpEmail);

		return res.json({
			success: true,
			message: 'Verification OTP sent on email and will expire in 15 mins.',
		});
	} catch (err) {
		console.log('error here', err.message);
		res.json({ success: false, message: err.message });
	}
};
//verify otp from db and user
export const verifyOtp = async (req, res) => {
	const { userId, otp } = req.body;

	if (!userId || !otp) {
		return res.status(400).json({ success: false, message: 'Missing details' });
	}

	try {
		const user = await userModel.findById(userId);
		if (!user) {
			return res.json({
				success: false,
				message: 'User account does not exist.',
			});
		}

		if (user.isAccountVerified) {
			return res.json({
				success: false,
				message: 'Email is already verified',
			});
		}

		if (!user.verifyOtp || user.verifyOtp !== otp) {
			return res.json({ success: false, message: 'Invalid OTP' });
		}

		if (user.verifyOtpExpireAt < Date.now()) {
			return res.json({ success: false, message: 'OTP is already expired.' });
		}

		user.isAccountVerified = true;

		//reset state
		user.verifyOtp = null;
		user.verifyOtpExpireAt = null;
		await user.save();

		return res.json({ success: true, message: 'Account verified' });
	} catch (err) {
		console.log('verification otp failed: ', err.message);
		return res.json({ success: false, message: err.message });
	}
};

// Changing Password
export const resetPasswordRequestOTP = async (req, res) => {
	// const { userId } = req.body;
	const { email } = req.body;

	try {
		const user = await userModel.findOne({ email });

		if (!user) {
			return res.json({ success: false, message: 'User does not exist' });
		}
		if (user.resetOTP) {
			return res.json({ success: false, message: 'OTP is already sent' });
		}

		const otp = String(100000 + Math.floor(Math.random() * 900000));
		user.resetOtp = otp;
		user.resetOtpExpiresAt = new Date(Date.now() + 60 * 15 * 1000);

		await user.save();

		// Generate an otp email
		const otpEmail = {
			from: process.env.SENDER_EMAIL,
			to: user.email,
			subject: 'Iskolar Reset Password OTP',
			text: `Please don't share your OTP code. This OTP will expired at 15 minutes. Your OTP verification code is: ${otp}`,
		};
		await transporter.sendMail(otpEmail);

		return res.json({
			success: true,
			message: 'Reset OTP sent on email.',
		});
	} catch (err) {
		res.json({ success: false, message: err.message });
	}
};

export const verifyChangePassWithOtp = async (req, res) => {
	const { otp, password, email } = req.body;

	if (!otp || !password || !email) {
		return res.json({
			success: false,
			message: 'Please fill in your OTP and new password',
		});
	}

	try {
		const user = await userModel.findOne({ email });

		if (!user) {
			return res.json({ success: false, message: 'Account does not exist' });
		}

		if (!user.resetOtp || user.resetOtp !== otp) {
			return res.json({ success: false, message: 'Invalid OTP' });
		}

		if (user.resetOtpExpiresAt < Date.now()) {
			return res.json({ success: false, message: 'OTP is already expired.' });
		}

		const passwordIsMatch = await bcrypt.compare(password, user.password);

		if (passwordIsMatch) {
			return res.json({
				success: false,
				message: 'Please enter a new password',
			});
		}
		const newPassword = await bcrypt.hash(password, 10);

		user.password = newPassword;
		user.resetOtp = null;
		user.resetOtpExpiresAt = null;
		await user.save();

		return res.json({
			success: true,
			message: 'Password changed successfully ',
		});
	} catch (err) {
		res.json({ success: false, message: err.message });
	}
};

//check user authentication
export const isAuthenticated = async (req, res) => {
	try {
		res.json({ success: true });
	} catch (err) {
		res.status(500).json({ success: false, message: err.message });
	}
};
