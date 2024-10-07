// userController.js
const User = require('../models/user');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcrypt');

exports.getAllUsers = async (req, res) => {
    try {
        // Получаем всех пользователей из базы данных
        const users = await User.findAll({
            attributes: ['id', 'login', 'email', 'full_name', 'rating', 'role', 'created_at'], // Выбираем только нужные поля
        });

        // Возвращаем список пользователей
        res.status(200).json(users);
    } catch (error) {
        console.error('Ошибка при получении пользователей:', error);
        res.status(500).json({ message: 'Ошибка сервера при получении пользователей' });
    }
};


exports.getUserById = async (req, res) => {
    const { userId } = req.params; // Извлекаем userId из параметров запроса

    try {
        // Поиск пользователя по ID
        const user = await User.findByPk(userId, {
            attributes: ['id', 'login', 'email', 'full_name', 'rating', 'role', 'created_at'], // Выбираем нужные поля
        });

        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        // Возвращаем данные пользователя
        res.status(200).json(user);
    } catch (error) {
        console.error('Ошибка при получении пользователя:', error);
        res.status(500).json({ message: 'Ошибка сервера при получении пользователя' });
    }
};

exports.createUser = async (req, res) => {
    const { login, password, email, role, full_name } = req.body; // Добавлено поле full_name

    try {
        // Проверка на существование пользователя с таким логином или email
        const existingUser = await User.findOne({ where: { login } });
        if (existingUser) {
            return res.status(400).json({ message: 'Пользователь с таким логином уже существует' });
        }

        const existingEmail = await User.findOne({ where: { email } });
        if (existingEmail) {
            return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
        }

        // Хеширование пароля
        const hashedPassword = await bcrypt.hash(password, 10);

        // Создание нового пользователя с подтвержденным email
        const newUser = await User.create({
            login,
            password: hashedPassword,
            email,
            role, // Поле роли передается из запроса (например, 'user' или 'admin')
            full_name, // Поле имени передается из запроса
            email_confirmed: true, // Устанавливаем подтвержденную почту
        });

        res.status(201).json({ message: 'Пользователь успешно создан', user: newUser });
    } catch (error) {
        console.error('Ошибка при создании пользователя:', error);
        res.status(500).json({ message: 'Ошибка сервера при создании пользователя' });
    }
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Папка, куда будут загружаться аватары
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`); // Уникальное имя файла
    }
});

const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];

const fileFilter = (req, file, cb) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Загрузите изображение.'), false);
    }
};


// Инициализация загрузчика
const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 8 * 1024 * 1024 }
}).single('avatar'); // Поле 'avatar' должно содержать файл


exports.uploadAvatar = (req, res) => {
    // Используем multer для обработки загрузки
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: 'Ошибка при загрузке аватара', error: err.message });
        }

        // Если файл не был загружен
        if (!req.file) {
            return res.status(400).json({ message: 'Пожалуйста, загрузите файл изображения.' });
        }

        try {
            // Найдите пользователя по ID, полученному из токена или параметров
            const userId = req.user.id; // Предполагается, что пользователь уже аутентифицирован и его ID хранится в req.user3
            const user = await User.findByPk(userId);

            if (!user) {
                return res.status(404).json({ message: 'Пользователь не найден.' });
            }

            // Обновляем аватар пользователя
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

    // Проверка: может обновлять только владелец профиля
    if (req.user.id !== parseInt(userId, 10)) {
        return res.status(403).json({ message: 'Вы не можете обновить чужой профиль' });
    }

    try {
        // Поиск пользователя по ID
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        // Обновление только логина и имени
        if (login) {
            const existingUser = await User.findOne({ where: { login } });
            if (existingUser && existingUser.id !== user.id) {
                return res.status(400).json({ message: 'Пользователь с таким логином уже существует' });
            }
            user.login = login;
        }

        user.full_name = full_name || user.full_name;

        // Сохранение обновленных данных
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
        // Поиск пользователя по ID
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        // Проверка: может удалять либо администратор, либо владелец аккаунта
        if (req.user.role !== 'admin' && req.user.id !== user.id) {
            return res.status(403).json({ message: 'Вы не можете удалить этого пользователя' });
        }

        // Удаление пользователя
        await user.destroy();

        res.status(200).json({ message: `Пользователь с ID ${userId} успешно удален` });
    } catch (error) {
        console.error('Ошибка при удалении пользователя:', error);
        res.status(500).json({ message: 'Ошибка сервера при удалении пользователя' });
    }
};

