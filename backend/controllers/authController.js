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
		res.json({ success: false, message: err.message });
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
			maxAge: 3600 * 24 * 7,
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
		});

		res.json({ success: true, message: 'Logged out successfully' });
	} catch (err) {
		res.json({ success: false, message: err.message });
	}
};

//sends an otp to email
export const sendOtp = async (req, res) => {
	try {
		const { userId } = req.body;
		const user = await userModel.findById(userId);
		if (user.isAccountVerified) {
			res.json({ success: false, message: 'account is already verified' });
		}
		const otp = String(100000 + Math.floor(Math.random() * 900000));
		user.verifyOtp = otp;
		user.verifyOtpExpireAt = Date.now() + 3600 * 24 * 1000;

		await user.save();

		// Generate an otp email
		const otpEmail = {
			from: process.env.SENDER_EMAIL,
			to: user.email,
			subject: 'Iskolar Account Verification OTP',
			text: `Please don't share your OTP code. This OTP will expired on 24 hrs. Your OTP verification code is: ${otp}`,
		};
		await transporter.sendMail(otpEmail);

		res.json({ success: true, message: 'Verification OTP sent on email.' });
	} catch (err) {
		console.log('error here', err.message);
		res.json({ success: false, message: err.message });
	}
};
//verify otp from db and user
export const verifyOtp = async (req, res) => {
	const { userId, otp } = req.body;

	if (!userId || !otp) {
		return res.json({ success: false, message: 'Missing details' });
	}

	try {
		const user = await userModel.findById(userId);
		if (!user) {
			return res.status(404).json({
				success: false,
				message: 'This user account does not exist.',
			});
		}

		if (user.verifyOtp === '' || user.verifyOtp !== otp) {
			return res.json({ success: false, message: 'Invalid OTP' });
		}

		if (user.verifyOtpExpiresAt < Date.now()) {
			return res.json({ success: false, message: 'OTP is already expired.' });
		}

		user.isAccountVerified = true;

		//reset state
		user.verifyOtp = '';
		user.verifyOtpExpireAt = 0;
		await user.save();

		return res.json({ success: true, message: 'Account verified' });
	} catch (err) {
		console.log('verification otp failed: ', err.message);
		return res.json({ success: false, message: err.message });
	}
};
