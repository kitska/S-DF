// Загрузка переменных окружения
require('dotenv').config();

// Импорт зависимостей
const express = require('express');
const multer = require('multer');
const path = require('path');
const { sequelize } = require('./db/db'); // Импорт sequelize из db.js

// Инициализация приложения Express
const app = express();

// Middleware для работы с JSON
app.use(express.json());

// Настройка multer для загрузки файлов
const upload = multer({
    dest: path.join(__dirname, process.env.UPLOAD_DIR),
});

// Статическая папка для файлов (например, аватаров)
app.use('/uploads', express.static(path.join(__dirname, process.env.UPLOAD_DIR)));

// Функция для инициализации базы данных и запуска сервера
const startServer = async () => {
    try {
        // Подключение и создание базы данных, если её нет
        await sequelize.sync();
        console.log('База данных успешно синхронизирована');

        // Запуск сервера
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            const url = `http://localhost:${PORT}`;
            console.log(`Сервер запущен на: ${url}`);
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
