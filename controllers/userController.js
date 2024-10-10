const User = require('../models/user');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcrypt');
const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'login', 'email', 'full_name', 'rating', 'role', 'created_at'],
        });

        res.status(200).json(users);
    } catch (error) {
        console.error('Ошибка при получении пользователей:', error);
        res.status(500).json({ message: 'Ошибка сервера при получении пользователей' });
    }
};

exports.getUserById = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findByPk(userId, {
            attributes: ['id', 'login', 'email', 'full_name', 'rating', 'role', 'created_at'],
        });

        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Ошибка при получении пользователя:', error);
        res.status(500).json({ message: 'Ошибка сервера при получении пользователя' });
    }
};

exports.createUser = async (req, res) => {
    const { login, password, email, role, full_name } = req.body;

    try {
        const existingUser = await User.findOne({ where: { login } });
        if (existingUser) {
            return res.status(400).json({ message: 'Пользователь с таким логином уже существует' });
        }

        const existingEmail = await User.findOne({ where: { email } });
        if (existingEmail) {
            return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            login,
            password: hashedPassword,
            email,
            role,
            full_name,
            email_confirmed: true,
        });

        res.status(201).json({ message: 'Пользователь успешно создан', user: newUser });
    } catch (error) {
        console.error('Ошибка при создании пользователя:', error);
        res.status(500).json({ message: 'Ошибка сервера при создании пользователя' });
    }
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

const fileFilter = (req, file, cb) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Загрузите изображение.'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 8 * 1024 * 1024 }
}).single('avatar');

exports.uploadAvatar = (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: 'Ошибка при загрузке аватара', error: err.message });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'Пожалуйста, загрузите файл изображения.' });
        }

        try {
            const userId = req.user.id;
            const user = await User.findByPk(userId);

            if (!user) {
                return res.status(404).json({ message: 'Пользователь не найден.' });
            }

            user.profile_picture = `/uploads/${req.file.filename}`;
            await user.save();

            res.status(200).json({ message: 'Аватар успешно загружен.', avatarUrl: user.profile_picture });
        } catch (error) {
            console.error('Ошибка при сохранении аватара:', error);
            res.status(500).json({ message: 'Ошибка сервера при загрузке аватара.' });
        }
    });
};

exports.updateUser = async (req, res) => {
    const { userId } = req.params;
    const { login, full_name } = req.body;

    if (req.user.role !== 'admin' && req.user.id !== parseInt(userId, 10)) {
        return res.status(403).json({ message: 'Вы не можете обновить чужой профиль' });
    }

    try {
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        if (login) {
            const existingUser = await User.findOne({ where: { login } });
            if (existingUser && existingUser.id !== user.id) {
                return res.status(400).json({ message: 'Пользователь с таким логином уже существует' });
            }
            user.login = login;
        }

        user.full_name = full_name || user.full_name;

        await user.save();

        res.status(200).json({ message: 'Логин и имя пользователя успешно обновлены', user });
    } catch (error) {
        console.error('Ошибка при обновлении логина и имени пользователя:', error);
        res.status(500).json({ message: 'Ошибка сервера при обновлении данных пользователя' });
    }
};

exports.deleteUser = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        if (req.user.role !== 'admin' && req.user.id !== user.id) {
            return res.status(403).json({ message: 'Вы не можете удалить этого пользователя' });
        }

        await user.destroy();

        res.status(200).json({ message: `Пользователь с ID ${userId} успешно удален` });
    } catch (error) {
        console.error('Ошибка при удалении пользователя:', error);
        res.status(500).json({ message: 'Ошибка сервера при удалении пользователя' });
    }
};

