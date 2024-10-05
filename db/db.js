require('dotenv').config();
const { Sequelize } = require('sequelize');

// Настройка подключения к базе данных
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: false,
});

// Функция для проверки подключения к базе данных
const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Подключение к базе данных успешно установлено');
    } catch (error) {
        console.error('Ошибка подключения к базе данных:', error);
    }
};

module.exports = { sequelize, connectDB };