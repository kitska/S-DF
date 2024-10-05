// authController.js

const bcrypt = require('bcrypt');
const User = require('../models/user'); // Убедитесь, что путь корректен
const crypto = require('crypto');
const nodemailer = require('nodemailer');

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


exports.login = (req, res) => {
    console.log('Вход пользователя');
    res.json({ message: 'Вход успешен' });
};

exports.logout = (req, res) => {
    console.log('Выход пользователя');
    res.json({ message: 'Выход успешен' });
};

exports.sendResetLink = (req, res) => {
    console.log('Отправка ссылки для сброса пароля');
    res.json({ message: 'Ссылка для сброса пароля отправлена' });
};

exports.confirmNewPassword = (req, res) => {
    console.log('Подтверждение нового пароля');
    res.json({ message: 'Пароль успешно изменен' });
};
