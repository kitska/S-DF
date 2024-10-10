const Category = require('../models/category');
const Post = require('../models/post');
const PostCategory = require('../models/post_category');

exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.findAll();
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
    const { category_id } = req.params;

    try {
        const category = await Category.findByPk(category_id);
        if (!category) {
            return res.status(404).json({ message: `Категория с ID ${category_id} не найдена` });
        }
        res.status(200).json({ category });
    } catch (error) {
        console.error(`Ошибка при получении категории с ID ${category_id}:`, error);
        res.status(500).json({ message: 'Ошибка сервера при получении категории' });
    }
};

exports.getPostsForCategory = async (req, res) => {
    const { category_id } = req.params;

    try {
        const category = await Category.findByPk(category_id, {
            include: [
                {
                    model: Post,
                    attributes: ['id', 'title', 'content', 'publish_date'],
                    through: { attributes: [] },
                },
            ],
        });

        if (!category || category.Posts.length === 0) {
            return res.status(404).json({ message: `В категории с ID ${category_id} нет постов` });
        }

        res.status(200).json({
            message: `Посты для категории с ID ${category_id}`,
            posts: category.Posts,
        });
    } catch (error) {
        console.error(`Ошибка при получении постов для категории с ID ${category_id}:`, error);
        res.status(500).json({ message: 'Ошибка сервера при получении постов для категории' });
    }
};

exports.createCategory = async (req, res) => {
    const { title } = req.body;

    try {
        const user = req.user;

        if (user.role !== 'admin' && user.rating < 50) {
            return res.status(403).json({ message: 'Недостаточно рейтинга. Для создания категории необходимо иметь минимум 50 рейтинга.' });
        }

        if (!title) {
            return res.status(400).json({ message: 'Поле title обязательно для заполнения' });
        }

        const existingCategory = await Category.findOne({ where: { title } });
        if (existingCategory) {
            return res.status(400).json({ message: 'Категория с таким названием уже существует' });
        }

        const newCategory = await Category.create({ title });

        res.status(201).json({ message: 'Категория успешно создана', category: newCategory });
    } catch (error) {
        console.error('Ошибка при создании категории:', error);
        res.status(500).json({ message: 'Ошибка сервера при создании категории' });
    }
};

exports.updateCategory = async (req, res) => {
    const { category_id } = req.params;
    const { title } = req.body;

    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Доступ запрещен. Только администраторы могут обновлять категории.' });
    }

    try {
        const category = await Category.findByPk(category_id);

        if (!category) {
            return res.status(404).json({ message: `Категория с ID ${category_id} не найдена` });
        }

        category.title = title || category.title;
        await category.save();

        res.status(200).json({ message: `Категория с ID ${category_id} успешно обновлена`, category });
    } catch (error) {
        console.error(`Ошибка при обновлении категории с ID ${category_id}:`, error);
        res.status(500).json({ message: 'Ошибка сервера при обновлении категории' });
    }
};

exports.deleteCategory = async (req, res) => {
    const { category_id } = req.params;

    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Доступ запрещен. Только администраторы могут удалять категории.' });
    }

    try {
        const category = await Category.findByPk(category_id);

        if (!category) {
            return res.status(404).json({ message: `Категория с ID ${category_id} не найдена` });
        }

        await category.destroy();

        res.status(200).json({ message: `Категория с ID ${category_id} успешно удалена` });
    } catch (error) {
        console.error(`Ошибка при удалении категории с ID ${category_id}:`, error);
        res.status(500).json({ message: 'Ошибка сервера при удалении категории' });
    }
};

