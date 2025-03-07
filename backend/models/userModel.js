import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
	name: { type: String, required: true },
	email: {
		type: String,
		required: true,
		unique: true,
		lowercase: true,
		trim: true,
	},
	password: { type: String, required: true, trim: true },

	//otp verification
	verifyOtp: { type: String, default: null },
	verifyOtpExpireAt: { type: Date, default: null },
	isAccountVerified: { type: Boolean, default: false },

	//reset otp
	resetOtp: { type: String, default: null },
	resetOtpExpiresAt: { type: Date, default: null },

	//admin
	isAdmin: { type: Boolean, default: false },
});

const userModel = mongoose.models.user || mongoose.model('user', userSchema);

export default userModel;
