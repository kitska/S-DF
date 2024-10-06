// userController.js
const User = require('../models/user');
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


exports.uploadAvatar = (req, res) => {
    console.log('Загрузка аватара');
    res.json({ message: 'Аватар загружен' });
};

exports.updateUser = (req, res) => {
    console.log(`Обновление данных пользователя с ID ${req.params.userId}`);
    res.json({ message: `Данные пользователя с ID ${req.params.userId} обновлены` });
};

exports.deleteUser = (req, res) => {
    console.log(`Удаление пользователя с ID ${req.params.userId}`);
    res.json({ message: `Пользователь с ID ${req.params.userId} удален` });
};
