const bcrypt = require('bcrypt');
const User = require('../models/user');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { Op } = require('sequelize');

exports.register = async (req, res) => {
	const { login, password, password_confirmation, email, full_name } = req.body;

	if (!login || !password || !password_confirmation || !email || !full_name) {
		return res.status(400).json({ message: 'All fields are required' });
	}

	if (password !== password_confirmation) {
		return res.status(400).json({ message: 'Passwords don`t match' });
	}

	try {
		const existingUser = await User.findOne({ where: { email } });
		if (existingUser) {
			return res.status(400).json({ message: 'A user with this email already exists' });
		}

		const existingLogin = await User.findOne({ where: { login } });
		if (existingLogin) {
			return res.status(400).json({ message: 'Login is already taken' });
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
			subject: 'Confirmation email',
			text: `Follow the link to confirm your email: ${confirmationLink}`,
		};

		await transporter.sendMail(mailOptions);

		res.status(201).json({ message: 'Registration successful. Check your email to confirm your email' });
	} catch (error) {
		console.error('Registration error:', error);
		res.status(500).json({ message: 'Server error' });
	}
};

exports.confirmEmail = async (req, res) => {
	const { token } = req.params;

	try {
		const user = await User.findOne({ where: { email_confirmation_token: token } });
		if (!user) {
			return res.status(400).json({ message: 'Invalid or expired token' });
		}

		user.email_confirmed = true;
		user.email_confirmation_token = null;
		await user.save();

		res.status(200).json({ message: 'Email successfully confirmed' });
	} catch (error) {
		console.error('Email confirmation error:', error);
		res.status(500).json({ message: 'Server error' });
	}
};

exports.login = async (req, res) => {
	const { login, email, password } = req.body;

	if ((!login && !email) || !password) {
		return res.status(400).json({ message: 'All fields are required' });
	}

	try {
		const user = await User.findOne({
			where: {
				email_confirmed: true,
				[Op.or]: [{ login: login }, { email: email }],
			},
		});

		if (!user) {
			return res.status(401).json({ message: 'Invalid login or password, or email not confirmed' });
		}

		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			return res.status(401).json({ message: 'Invalid login or password' });
		}

		const token = jwt.sign({ id: user.id, login: user.login, email: user.email, role: user.role, rating: user.rating }, process.env.JWT_SECRET, { expiresIn: '1d' });

		res.status(200).json({ message: 'Login successful', token });
	} catch (error) {
		console.error('Ошибка входа:', error);
		res.status(500).json({ message: 'Server error' });
	}
};

exports.logout = (req, res) => {
	res.status(200).json({ message: 'Came out, good chel' });
};

exports.sendResetLink = async (req, res) => {
	const { email } = req.body;

	if (!email) {
		return res.status(400).json({ message: 'Email is required' });
	}

	try {
		const user = await User.findOne({ where: { email } });

		if (!user) {
			return res.status(404).json({ message: 'User with this email was not found' });
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
			subject: 'Password reset',
			text: `Follow the following link to reset your password: ${resetLink}`,
		};

		await transporter.sendMail(mailOptions);

		res.status(200).json({ message: 'Password reset link sent' });
	} catch (error) {
		console.error('Error sending password reset link:', error);
		res.status(500).json({ message: 'Server error' });
	}
};

exports.confirmNewPassword = async (req, res) => {
	const { token } = req.params;
	const { newPassword, passwordConfirmation } = req.body;

	if (newPassword !== passwordConfirmation) {
		return res.status(400).json({ message: 'Passwords don`t match' });
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		const user = await User.findByPk(decoded.id);
		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}

		const hashedPassword = await bcrypt.hash(newPassword, 10);
		user.password = hashedPassword;
		await user.save();

		res.status(200).json({ message: 'Password updated successfully' });
	} catch (error) {
		console.error('Password reset error:', error);
		res.status(500).json({ message: 'Server error' });
	}
};
