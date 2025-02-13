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

		const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
			expiresIn: '7d',
		});
		res.cookie('token', token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
			maxAge: 3600 * 7,
		});
	} catch (err) {
		res.json({ success: false, message: err.message });
	}
};
