// authController.js

const bcrypt = require('bcrypt');
const User = require('../models/user'); // Убедитесь, что путь корректен
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { Op } = require('sequelize');

exports.register = async (req, res) => {
    const { login, password, password_confirmation, email, full_name } = req.body; // Добавлено поле full_name

    if (!login || !password || !password_confirmation || !email || !full_name) { // Проверка на наличие full_name
        return res.status(400).json({ message: 'Все поля обязательны для заполнения' });
    }

    if (password !== password_confirmation) {
        return res.status(400).json({ message: 'Пароли не совпадают' });
    }

    try {
        // Проверяем, существует ли пользователь с таким email или логином
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
        }

        const existingLogin = await User.findOne({ where: { login } });
        if (existingLogin) {
            return res.status(400).json({ message: 'Логин уже занят' });
        }

        // Хешируем пароль
        const hashedPassword = await bcrypt.hash(password, 10);

        // Генерируем токен для подтверждения email
        const emailToken = crypto.randomBytes(32).toString('hex');

        // Создаем нового пользователя с неподтвержденным email
        const newUser = await User.create({
            login,
            password: hashedPassword,
            full_name, // Передаем значение full_name в модель
            email,
            email_confirmed: false,
            email_confirmation_token: emailToken,
        });

        // Отправляем email с токеном подтверждения
        const confirmationLink = `http://localhost:3000/api/auth/confirm-email/${emailToken}`;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Подтверждение email',
            text: `Перейдите по ссылке для подтверждения email: ${confirmationLink}`,
        };

        await transporter.sendMail(mailOptions);

        res.status(201).json({ message: 'Регистрация успешна. Проверьте вашу почту для подтверждения email' });
    } catch (error) {
        console.error('Ошибка регистрации:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

exports.confirmEmail = async (req, res) => {
    const { token } = req.params;

    try {
        // Находим пользователя по токену
        const user = await User.findOne({ where: { email_confirmation_token: token } });
        if (!user) {
            return res.status(400).json({ message: 'Неверный или истекший токен' });
        }

        // Обновляем статус подтверждения email
        user.email_confirmed = true;
        user.email_confirmation_token = null;
        await user.save();

        res.json({ message: 'Email успешно подтвержден' });
    } catch (error) {
        console.error('Ошибка подтверждения email:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};


exports.login = async (req, res) => {
    const { login, email, password } = req.body;

    // Проверка на наличие обязательных параметров
    if (!login && !email || !password) {
        return res.status(400).json({ message: 'Все поля обязательны для заполнения' });
    }

    try {
        // Поиск пользователя по логину или email
        const user = await User.findOne({
            where: {
                email_confirmed: true, // Проверка на подтвержденный email
                [Op.or]: [
                    { login: login },  // Ищем по логину
                    { email: email }   // Или по email
                ]
            }
        });

        if (!user) {
            return res.status(401).json({ message: 'Неверный логин или пароль, или email не подтвержден' });
        }

        // Сравнение введенного пароля с хранимым
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Неверный логин или пароль' });
        }

        // Генерация JWT токена
        const token = jwt.sign(
            { id: user.id, login: user.login, email: user.email }, // payload
            process.env.JWT_SECRET, // Секретный ключ для подписи
            { expiresIn: '1d' } // Время действия токена
        );

        res.status(200).json({ message: 'Вход выполнен успешно', token });
    } catch (error) {
        console.error('Ошибка входа:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};


exports.logout = (req, res) => {
    res.status(200).json({ message: 'Вышел, харош' });
};

exports.sendResetLink = async (req, res) => {
    const { email } = req.body;

    // Проверка на наличие email
    if (!email) {
        return res.status(400).json({ message: 'Email обязателен для ввода' });
    }

    try {
        // Поиск пользователя по email
        const user = await User.findOne({ where: { email } });

        // Если пользователь не найден
        if (!user) {
            return res.status(404).json({ message: 'Пользователь с таким email не найден' });
        }

        // Генерация JWT токена для сброса пароля с коротким сроком действия (например, 1 час)
        const resetToken = jwt.sign(
            { id: user.id, email: user.email }, // payload токена
            process.env.JWT_SECRET, // Секретный ключ для подписи
            { expiresIn: '1h' } // Время действия токена
        );

        // Ссылка для сброса пароля
        const resetLink = `http://localhost:3000/api/auth/password-reset/${resetToken}`;

        // Настройка для отправки email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Сброс пароля',
            text: `Перейдите по следующей ссылке для сброса пароля: ${resetLink}`,
        };

        // Отправляем письмо с токеном для сброса пароля
        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Ссылка для сброса пароля отправлена' });
    } catch (error) {
        console.error('Ошибка отправки ссылки для сброса пароля:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

exports.confirmNewPassword = async (req, res) => {
    const { token } = req.params;
    const { newPassword, passwordConfirmation } = req.body;

    // Проверка на совпадение паролей
    if (newPassword !== passwordConfirmation) {
        return res.status(400).json({ message: 'Пароли не совпадают' });
    }

    try {
        // Валидация токена
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Поиск пользователя по id из токена
        const user = await User.findByPk(decoded.id);
        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        // Хеширование нового пароля и сохранение
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: 'Пароль успешно обновлен' });
    } catch (error) {
        console.error('Ошибка сброса пароля:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};
