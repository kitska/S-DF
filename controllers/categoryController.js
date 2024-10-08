// categoryController.js
const Category = require('../models/category');

exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.findAll(); // Извлекаем все категории из базы данных
        if (categories.length === 0) {
            return res.status(404).json({ message: 'Категории не найдены' });
        }
        res.status(200).json({ categories });
    } catch (error) {
        console.error('Ошибка при получении категорий:', error);
        res.status(500).json({ message: 'Ошибка сервера при получении категорий' });
    }
};


exports.getCategoryById = async (req, res) => {
    const { categoryId } = req.params;

    try {
        const category = await Category.findByPk(categoryId); // Поиск категории по ID
        if (!category) {
            return res.status(404).json({ message: `Категория с ID ${categoryId} не найдена` });
        }
        res.status(200).json({ category });
    } catch (error) {
        console.error(`Ошибка при получении категории с ID ${categoryId}:`, error);
        res.status(500).json({ message: 'Ошибка сервера при получении категории' });
    }
};

exports.getPostsForCategory = (req, res) => {
    console.log(`Получение постов для категории с ID ${req.params.categoryId}`);
    res.json({ message: `Посты для категории с ID ${req.params.categoryId}` });
};

exports.createCategory = async (req, res) => {
    const { title } = req.body;

    try {
        // Проверка рейтинга пользователя или роли администратора
        const user = req.user; // Информация о пользователе берется из middleware аутентификации

        if (user.role !== 'admin' && user.rating < 50) {
            return res.status(403).json({ message: 'Недостаточно рейтинга. Для создания категории необходимо иметь минимум 50 рейтинга.' });
        }

        // Проверка наличия параметра title
        if (!title) {
            return res.status(400).json({ message: 'Поле title обязательно для заполнения' });
        }

        // Проверка, существует ли категория с таким же названием
        const existingCategory = await Category.findOne({ where: { title } });
        if (existingCategory) {
            return res.status(400).json({ message: 'Категория с таким названием уже существует' });
        }

        // Создание новой категории
        const newCategory = await Category.create({ title });

        res.status(201).json({ message: 'Категория успешно создана', category: newCategory });
    } catch (error) {
        console.error('Ошибка при создании категории:', error);
        res.status(500).json({ message: 'Ошибка сервера при создании категории' });
    }
};

exports.updateCategory = async (req, res) => {
    const { categoryId } = req.params;
    const { title } = req.body;

    // Проверка, является ли пользователь администратором
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Доступ запрещен. Только администраторы могут обновлять категории.' });
    }

    try {
        const category = await Category.findByPk(categoryId); // Поиск категории по ID

        if (!category) {
            return res.status(404).json({ message: `Категория с ID ${categoryId} не найдена` });
        }

        // Обновляем поле title
        category.title = title || category.title;
        await category.save(); // Сохраняем изменения

        res.status(200).json({ message: `Категория с ID ${categoryId} успешно обновлена`, category });
    } catch (error) {
        console.error(`Ошибка при обновлении категории с ID ${categoryId}:`, error);
        res.status(500).json({ message: 'Ошибка сервера при обновлении категории' });
    }
};


exports.deleteCategory = async (req, res) => {
    const { categoryId } = req.params;

    // Проверка, является ли пользователь администратором
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Доступ запрещен. Только администраторы могут удалять категории.' });
    }

    try {
        const category = await Category.findByPk(categoryId); // Поиск категории по ID

        if (!category) {
            return res.status(404).json({ message: `Категория с ID ${categoryId} не найдена` });
        }

        await category.destroy(); // Удаление категории

        res.status(200).json({ message: `Категория с ID ${categoryId} успешно удалена` });
    } catch (error) {
        console.error(`Ошибка при удалении категории с ID ${categoryId}:`, error);
        res.status(500).json({ message: 'Ошибка сервера при удалении категории' });
    }
};

