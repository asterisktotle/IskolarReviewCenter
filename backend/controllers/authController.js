import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel';

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

		return res.json({ success: true });
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

		if (user) {
			return res.json({ success: false, message: 'User did not exist' });
		}

		const emailAndPasswordIsMatch = await bcrypt.compare(
			password,
			user.password
		);

		if (emailAndPasswordIsMatch) {
			return res.json({ success: false, message: 'Invalid password' });
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

		return res.json({ success: true });
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
