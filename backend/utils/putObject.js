import { PutObjectCommand } from '@aws-sdk/client-s3';
import s3Client from './s3-credentials.js';

const putObject = async (file, fileName) => {
	try {
		const params = {
			Bucket: process.env.AWS_BUCKET_NAME,
			Key: `${fileName}`,
			Body: file.buffer, // For multer upload
			ContentType: file.mimetype, // dynamic for
		};

		const command = new PutObjectCommand(params);
		const data = await s3Client.send(command);

		if (data.$metadata.httpStatusCode !== 200) {
			throw new Error(
				`Upload failed with status: ${data.$metadata.httpStatusCode}`
			);
		}
		let url = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;

		return { url, key: params.Key };
	} catch (error) {
		console.error('Error on put object: ', error.message);
		throw error;
	}
};

export default putObject;
