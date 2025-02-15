import jwt from 'jsonwebtoken';

export const userAuth = async (req, res, next) => {
	const { token } = req.cookies;

	if (!token) {
		return res
			.status(401)
			.json({ success: false, message: 'Unauthorized login.' });
	}

	try {
		const tokenDecoded = jwt.verify(token, process.env.JWT_SECRET);

		if (tokenDecoded.id) {
			req.body.userId = tokenDecoded.id;
		} else {
			return res.status(403).json({
				success: false,
				message: 'Unauthorized login.',
			});
		}
		next();
	} catch (err) {
		console.log('middleware: ', err.message);
		res.json({ success: false, message: err.message });
	}
};
