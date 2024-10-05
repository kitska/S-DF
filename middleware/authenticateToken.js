const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Предполагается, что токен передается в заголовке Authorization

    if (!token) {
        return res.status(401).json({ message: 'Токен не предоставлен' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Неверный токен' });
        }
        req.user = user; // Сохраняем информацию о пользователе в запросе
        next();
    });
};

module.exports = authenticateToken;
