const jwt = require('jsonwebtoken');

// Миддлвар для аутентификации токена
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Извлекаем токен из заголовка Authorization

    if (!token) {
        return res.status(401).json({ message: 'Токен не предоставлен' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Неверный токен' });
        }
        req.user = user; // Сохраняем информацию о пользователе в объекте запроса
        next(); // Переход к следующему миддлвару или маршруту
    });
};

// Миддлвар для проверки прав администратора
const isAdmin = (req, res, next) => {
    if (req.user?.role !== 'admin') { // Проверяем, что роль пользователя администратор
        return res.status(403).json({ error: 'Необходимы права администратора.' });
    }
    next(); // Переход к следующему миддлвару или маршруту
};

// Экспортируем миддлвары
module.exports = {
    authenticateToken,
    isAdmin,
};