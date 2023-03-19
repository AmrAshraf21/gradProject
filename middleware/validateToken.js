const jwt = require('jsonwebtoken');

const validateToken = (req, res, next) => {
	const authHeader = req.headers.token;
	if (!authHeader) return res.status(401).json({ message: 'You Are Not Authenticated!' });

	const token = authHeader.split(' ')[1];

	jwt.verify(token, process.env.SECRET_KEY_JWT, (err, user) => {
		if (err) return res.status(403).json({ message: 'Token is not valid!' });
		req.user = user;

		next();
	});
};

const verifyTokenAndAuthorization = (req, res, next) => {
	validateToken(req, res, () => {
		
		if (
			req.user.userId||
			req.user.role === 'user' ||
			req.user.role === 'admin' ||
			req.user.role === 'author'
		) {
			next();
		} else {
			return res.status(403).json({ message: 'You Are not allowed!' });
		}
	});
};
const verifyTokenAdmin = (req, res, next) => {
	validateToken(req, res, () => {
		if (req.user.role === 'admin') {
			next();
		} else {
			return res.status(403).json({ message: 'This is for admin only..' });
		}
	});
};

module.exports = {
	validateToken,
	verifyTokenAdmin,
	verifyTokenAndAuthorization,
};
