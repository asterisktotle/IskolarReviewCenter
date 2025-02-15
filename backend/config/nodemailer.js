import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
	host: 'smtp-relay.brevo.com',
	port: 587,
	secure: false, // true for port 465, false for other ports
	auth: {
		user: '85c818001@smtp-brevo.com',
		pass: '42nfQIWObrXNZypm',
	},
});

export default transporter;
