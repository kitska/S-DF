const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];

	if (!token) {
		return res.status(401).json({ message: 'Token not provided' });
	}

	jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
		if (err) {
			return res.status(403).json({ message: 'Invalid token' });
		}
		req.user = user;
		next();
	});
};

const isAdmin = (req, res, next) => {
	if (req.user?.role !== 'admin') {
		return res.status(403).json({ error: 'Administrator rights are required' });
	}
	next();
};

module.exports = {
	authenticateToken,
	isAdmin,
};
