// postController.js
const Post = require('../models/post');
const Category = require('../models/category');
const PostCategory = require('../models/post_category');

exports.getAllPosts = (req, res) => {
    console.log('Получение всех постов');
    res.json({ message: 'Список всех постов' });
};

exports.getPostById = (req, res) => {
    console.log(`Получение поста с ID ${req.params.post_id}`);
    res.json({ message: `Пост с ID ${req.params.post_id}` });
};

exports.getCommentsForPost = (req, res) => {
    console.log(`Получение комментариев для поста с ID ${req.params.post_id}`);
    res.json({ message: `Комментарии для поста с ID ${req.params.post_id}` });
};

exports.createComment = (req, res) => {
    console.log(`Создание комментария для поста с ID ${req.params.post_id}`);
    res.json({ message: `Комментарий для поста с ID ${req.params.post_id} создан` });
};

exports.getCategoriesForPost = (req, res) => {
    console.log(`Получение категорий для поста с ID ${req.params.post_id}`);
    res.json({ message: `Категории для поста с ID ${req.params.post_id}` });
};

exports.getLikesForPost = (req, res) => {
    console.log(`Получение лайков для поста с ID ${req.params.post_id}`);
    res.json({ message: `Лайки для поста с ID ${req.params.post_id}` });
};

exports.createPost = async (req, res) => {
    const { title, content, categories } = req.body;

    try {
        // Проверяем, что все необходимые параметры присутствуют
        if (!title || !content || !categories || !Array.isArray(categories)) {
            return res.status(400).json({ message: 'Необходимо указать заголовок, содержимое и категории' });
        }

        // Создаем новый пост
        const newPost = await Post.create({
            title,
            content,
            author_id: req.user.id, // Предполагается, что пользователь авторизован и его ID доступен в req.user
        });

        // Привязка поста к категориям
        if (categories.length > 0) {
            const categoryPromises = categories.map(async (category_id) => {
                // Проверяем существование категории
                const category = await Category.findByPk(category_id);
                if (!category) {
                    throw new Error(`Категория с ID ${category_id} не найдена`);
                }

                // Создаем связь в PostCategory
                await PostCategory.create({
                    post_id: newPost.id,
                    category_id: category_id,
                });
            });

            // Ждем завершения всех асинхронных операций привязки
            await Promise.all(categoryPromises);
        }

        res.status(201).json({ message: 'Пост успешно создан', post: newPost });
    } catch (error) {
        console.error('Ошибка при создании поста:', error);
        res.status(500).json({ message: 'Ошибка сервера при создании поста' });
    }
};

exports.likePost = (req, res) => {
    console.log(`Лайк для поста с ID ${req.params.post_id}`);
    res.json({ message: `Пост с ID ${req.params.post_id} был лайкнут` });
};

exports.updatePost = (req, res) => {
    console.log(`Обновление поста с ID ${req.params.post_id}`);
    res.json({ message: `Пост с ID ${req.params.post_id} обновлен` });
};

exports.deletePost = (req, res) => {
    console.log(`Удаление поста с ID ${req.params.post_id}`);
    res.json({ message: `Пост с ID ${req.params.post_id} удален` });
};

exports.deleteLike = (req, res) => {
    console.log(`Удаление лайка для поста с ID ${req.params.post_id}`);
    res.json({ message: `Лайк для поста с ID ${req.params.post_id} удален` });
};
