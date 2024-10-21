const bcrypt = require('bcrypt');
const User = require('../models/user');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { Op } = require('sequelize');

exports.register = async (req, res) => {
	const { login, password, password_confirmation, email, full_name } = req.body;

	if (!login || !password || !password_confirmation || !email || !full_name) {
		return res.status(400).json({ message: 'Все поля обязательны для заполнения' });
	}

	if (password !== password_confirmation) {
		return res.status(400).json({ message: 'Пароли не совпадают' });
	}

	try {
		const existingUser = await User.findOne({ where: { email } });
		if (existingUser) {
			return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
		}

		const existingLogin = await User.findOne({ where: { login } });
		if (existingLogin) {
			return res.status(400).json({ message: 'Логин уже занят' });
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const emailToken = crypto.randomBytes(32).toString('hex');

		const newUser = await User.create({
			login,
			password: hashedPassword,
			full_name,
			email,
			email_confirmed: false,
			email_confirmation_token: emailToken,
		});

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
		const user = await User.findOne({ where: { email_confirmation_token: token } });
		if (!user) {
			return res.status(400).json({ message: 'Неверный или истекший токен' });
		}

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

	if ((!login && !email) || !password) {
		return res.status(400).json({ message: 'Все поля обязательны для заполнения' });
	}

	try {
		const user = await User.findOne({
			where: {
				email_confirmed: true,
				[Op.or]: [{ login: login }, { email: email }],
			},
		});

		if (!user) {
			return res.status(401).json({ message: 'Неверный логин или пароль, или email не подтвержден' });
		}

		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			return res.status(401).json({ message: 'Неверный логин или пароль' });
		}

		const token = jwt.sign({ id: user.id, login: user.login, email: user.email, role: user.role, rating: user.rating }, process.env.JWT_SECRET, { expiresIn: '1d' });

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

	if (!email) {
		return res.status(400).json({ message: 'Email обязателен для ввода' });
	}

	try {
		const user = await User.findOne({ where: { email } });

		if (!user) {
			return res.status(404).json({ message: 'Пользователь с таким email не найден' });
		}

		const resetToken = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

		const resetLink = `http://localhost:3000/api/auth/password-reset/${resetToken}`;

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

	if (newPassword !== passwordConfirmation) {
		return res.status(400).json({ message: 'Пароли не совпадают' });
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		const user = await User.findByPk(decoded.id);
		if (!user) {
			return res.status(404).json({ message: 'Пользователь не найден' });
		}

		const hashedPassword = await bcrypt.hash(newPassword, 10);
		user.password = hashedPassword;
		await user.save();

		res.status(200).json({ message: 'Пароль успешно обновлен' });
	} catch (error) {
		console.error('Ошибка сброса пароля:', error);
		res.status(500).json({ message: 'Ошибка сервера' });
	}
};
