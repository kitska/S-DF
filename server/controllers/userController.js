const User = require('../models/user');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcrypt');
const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
const Favourite = require('../models/favourite');
const Post = require('../models/post');
const { Op } = require('sequelize');
const randomPP = require('../services/randomPP');

exports.getAllUsers = async (req, res) => {
	try {
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.pageSize) || 10;
		const offset = (page - 1) * limit;

		const { login } = req.query;
		const filter = {};

		if (login) {
			filter.login = { [Op.like]: `%${login}%` };
		}

		const sortBy = req.query.sortBy || 'created_at';
		const sortOrder = req.query.sortOrder === 'asc' ? 'ASC' : 'DESC';

		const { rows: users, count: total } = await User.findAndCountAll({
			where: filter,
			attributes: ['id', 'login', 'email', 'full_name', 'rating', 'role', 'created_at', 'profile_picture'],
			limit: limit,
			offset: offset,
			order: [[sortBy, sortOrder]],
			distinct: true,
		});

		res.status(200).json({
			total,
			page,
			totalPages: Math.ceil(total / limit),
			users,
		});
	} catch (error) {
		console.error('Error getting users:', error);
		res.status(500).json({ message: 'Server error when getting users' });
	}
};

exports.getUserById = async (req, res) => {
	const { userId } = req.params;

	try {
		const user = await User.findByPk(userId, {
			attributes: ['id', 'login', 'email', 'full_name', 'rating', 'role', 'created_at', 'profile_picture'],
		});

		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}

		res.status(200).json(user);
	} catch (error) {
		console.error('Error getting user:', error);
		res.status(500).json({ message: 'Server error when getting user' });
	}
};

exports.createUser = async (req, res) => {
	const { login, password, email, role, full_name } = req.body;

	try {
		const existingUser = await User.findOne({ where: { login } });
		if (existingUser) {
			return res.status(400).json({ message: 'A user with this login already exists' });
		}

		const existingEmail = await User.findOne({ where: { email } });
		if (existingEmail) {
			return res.status(400).json({ message: 'A user with this email already exists' });
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const newUser = await User.create({
			login,
			password: hashedPassword,
			email,
			role,
			full_name,
			profile_picture: randomPP.getRandomProfilePicture(),
			email_confirmed: true,
		});

		res.status(201).json({ message: 'User successfully created', user: newUser });
	} catch (error) {
		console.error('Error creating user:', error);
		res.status(500).json({ message: 'Server error when creating user' });
	}
};

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'uploads/');
	},
	filename: (req, file, cb) => {
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
		cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
	},
});

const fileFilter = (req, file, cb) => {
	if (allowedMimeTypes.includes(file.mimetype)) {
		cb(null, true);
	} else {
		cb(new Error('Upload an image.'), false);
	}
};

const upload = multer({
	storage: storage,
	fileFilter: fileFilter,
	limits: { fileSize: 8 * 1024 * 1024 },
}).single('avatar');

exports.uploadAvatar = (req, res) => {
	upload(req, res, async err => {
		if (err) {
			return res.status(400).json({ message: 'Error loading avatar', error: err.message });
		}

		if (!req.file) {
			return res.status(400).json({ message: 'Please upload an image file' });
		}

		try {
			const userId = req.user.id;
			const user = await User.findByPk(userId);

			if (!user) {
				return res.status(404).json({ message: 'User not found' });
			}

			user.profile_picture = `/uploads/${req.file.filename}`;
			await user.save();

			res.status(200).json({ message: 'The avatar has been successfully uploaded', avatarUrl: user.profile_picture });
		} catch (error) {
			console.error('Error when saving avatar:', error);
			res.status(500).json({ message: 'Server error when loading avatar' });
		}
	});
};

exports.updateUser = async (req, res) => {
	const { userId } = req.params;
	const { login, full_name } = req.body;

	if (req.user.role !== 'admin' && req.user.id !== parseInt(userId, 10)) {
		return res.status(403).json({ message: 'You can`t update someone else`s profile' });
	}

	try {
		const user = await User.findByPk(userId);
		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}

		if (login) {
			const existingUser = await User.findOne({ where: { login } });
			if (existingUser && existingUser.id !== user.id) {
				return res.status(400).json({ message: 'A user with this login already exists' });
			}
			user.login = login;
		}

		user.full_name = full_name || user.full_name;

		await user.save();

		res.status(200).json({ message: 'Login and username successfully updated', user });
	} catch (error) {
		console.error('Error updating login and username:', error);
		res.status(500).json({ message: 'Server error when updating user data' });
	}
};

exports.deleteUser = async (req, res) => {
	const { userId } = req.params;

	try {
		const user = await User.findByPk(userId);
		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}

		if (req.user.role !== 'admin' && req.user.id !== user.id) {
			return res.status(403).json({ message: 'You cannot delete this user' });
		}

		await user.destroy();

		res.status(200).json({ message: `User with ID ${userId} was successfully deleted` });
	} catch (error) {
		console.error('Error when deleting user:', error);
		res.status(500).json({ message: 'Server error when deleting a user' });
	}
};

exports.getUserFavourites = async (req, res) => {
	try {
		const userId = req.user.id;

		if (!userId) {
			return res.status(400).json({ error: 'User not found' });
		}

		const favourites = await Favourite.findAll({
			where: { user_id: userId },
			include: [
				{
					model: Post,
					attributes: ['id', 'title', 'content', 'author_id'],
				},
			],
		});

		if (favourites && favourites.length > 0) {
			res.status(200).json(favourites);
		} else {
			res.status(404).json({ message: 'User has no favorite posts' });
		}
	} catch (error) {
		console.error('Error when retrieving featured posts:', error);
		res.status(500).json({ error: 'Error getting featured posts' });
	}
};
