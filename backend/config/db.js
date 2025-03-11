import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import { GridFSBucket } from 'mongodb';

let gridFSBucket;

const connectDB = async () => {
	try {
		mongoose.connection.on('connected', () => {
			console.log('MongoDB Connected');

			//initialize gridFS bucket after connection established
			if (!gridFSBucket) {
				gridFSBucket = new GridFSBucket(mongoose.connection.db, {
					bucketName: 'lectures',
				});
			}
			console.log('GridFS initialized for storage');
		});

		// await mongoose.connect(`${process.env.MONGODB_URI}/iskolar-app`);
		await mongoose.connect(process.env.URI);

		// Also initialize GridFS here to ensure it's ready
		// This handles the case where the connection is already established
		if (mongoose.connection.readyState === 1 && !gridFSBucket) {
			gridFSBucket = new GridFSBucket(mongoose.connection.db, {
				bucketName: 'lectures',
			});
			console.log(
				'GridFS initialized for storage immediately after connection'
			);
		}
	} catch (err) {
		console.error(`Error: ${err.message}`);
		process.exit(1); // process code 1 code means exit with failure, 0 means success
	}
};
export default connectDB;

export const getGridFSBucket = () => {
	if (!gridFSBucket) {
		throw new Error(
			'GridFS bucket is not initialized in database. Make sure database is connected'
		);
	}
	return gridFSBucket;
};
