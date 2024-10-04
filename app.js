require('dotenv').config();
const express = require('express');
const { sequelize } = require('./db/db'); // Импорт sequelize из db.js

// Импорт роутеров
const authRouter = require('./routes/auth');
const userRouter = require('./routes/users');
const postRouter = require('./routes/posts');
const categoryRouter = require('./routes/categories');
const commentRouter = require('./routes/comments');

// Инициализация приложения Express
const app = express();
app.use(express.json());

// Подключение роутеров
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/posts', postRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/comments', commentRouter);

// Функция для инициализации базы данных и запуска сервера
const startServer = async () => {
    try {
        await sequelize.sync();
        console.log('База данных успешно синхронизирована');

        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Сервер запущен на: http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Ошибка при запуске сервера или синхронизации базы данных:', error);
    }
};

// Вызов функции старта сервера
startServer();

// 404 Error Handling
app.use((req, res, next) => {
    res.status(404).json({ message: 'Ресурс не найден' });
});
