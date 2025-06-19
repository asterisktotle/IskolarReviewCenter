import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import s3Client from './s3-credentials.js';
import pdfModel from '../models/pdfSchema.js';

const deleteObject = async (key) => {
	try {
		const params = {
			Bucket: process.env.AWS_BUCKET_NAME,
			Key: key,
		};

		const command = new DeleteObjectCommand(params);
		const data = await s3Client.send(command);

		if (data.$metadata.httpStatusCode !== 204) {
			return { status: 400, data };
		}

		return {
			status: 204,
		};
	} catch (err) {
		console.error(err.message);
		throw err;
	}
};

export default deleteObject;
