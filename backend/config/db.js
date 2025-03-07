import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const URI = process.env.URI;

const connectDB = async () => {
	try {
		mongoose.connection.on('connected', () => console.log('MongoDB Connected'));

		// await mongoose.connect(`${process.env.MONGODB_URI}/iskolar-app`);
		await mongoose.connect(process.env.URI);
	} catch (err) {
		console.error(`Error: ${err.message}`);
		process.exit(1); // process code 1 code means exit with failure, 0 means success
	}
};
export default connectDB;
