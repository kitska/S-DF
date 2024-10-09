// postController.js
const Post = require('../models/post');
const Category = require('../models/category');
const PostCategory = require('../models/post_category');
const Comment = require('../models/comment')
const User = require('../models/user');
const Like = require('../models/like');

exports.getAllPosts = async (req, res) => {
    try {
        // Извлекаем параметры для пагинации
        const page = parseInt(req.query.page) || 1; // Текущая страница, по умолчанию 1
        const pageSize = parseInt(req.query.pageSize) || 10; // Размер страницы, по умолчанию 10 постов

        const offset = (page - 1) * pageSize; // Смещение для базы данных
        const limit = pageSize; // Лимит постов на страницу

        // Получаем посты с пагинацией, включая информацию об авторе и категориях
        const { count, rows: posts } = await Post.findAndCountAll({
            offset,
            limit,
            include: [
                {
                    model: User,
                    attributes: ['id', 'full_name', 'login'],
                },
                {
                    model: Category,
                    attributes: ['id', 'title'],
                    through: { attributes: [] }, // Исключаем поля промежуточной таблицы
                },
            ],
        });

        // Если постов нет, возвращаем 404
        if (posts.length === 0) {
            return res.status(404).json({ message: 'Посты не найдены' });
        }

        // Рассчитываем общее количество страниц
        const totalPages = Math.ceil(count / pageSize);

        // Возвращаем результат с метаданными для пагинации
        res.status(200).json({
            message: 'Список всех постов',
            currentPage: page,
            totalPages,
            totalPosts: count,
            postsPerPage: pageSize,
            posts,
        });
    } catch (error) {
        console.error('Ошибка при получении постов:', error);
        res.status(500).json({ message: 'Ошибка сервера при получении постов' });
    }
};

exports.getPostById = async (req, res) => {
    const { post_id } = req.params;

    try {
        // Поиск поста по ID, включая автора и категории
        const post = await Post.findByPk(post_id, {
            include: [
                {
                    model: User,
                    attributes: ['id', 'full_name', 'login'],
                },
                {
                    model: Category,
                    attributes: ['id', 'title'], // Информация о категориях
                    through: { attributes: [] }, // Исключаем промежуточные данные
                },
            ],
        });

        // Если пост не найден, возвращаем 404
        if (!post) {
            return res.status(404).json({ message: `Пост с ID ${post_id} не найден` });
        }

        // Возвращаем найденный пост
        res.status(200).json({
            message: `Пост с ID ${post_id}`,
            post,
        });
    } catch (error) {
        console.error(`Ошибка при получении поста с ID ${post_id}:`, error);
        res.status(500).json({ message: 'Ошибка сервера при получении поста' });
    }
};

exports.getCommentsForPost = async (req, res) => {
    const { post_id } = req.params;

    try {
        // Проверяем, существует ли пост с данным ID
        const post = await Post.findByPk(post_id);
        if (!post) {
            return res.status(404).json({ message: `Пост с ID ${post_id} не найден` });
        }

        // Получаем комментарии для поста
        const comments = await Comment.findAll({
            where: { post_id },
            attributes: ['id', 'author_id', 'content', 'publish_date'], // Указываем поля, которые нужно вернуть
            order: [['publish_date', 'DESC']], // Сортировка комментариев по дате
        });

        if (comments.length === 0) {
            return res.status(404).json({ message: `Для поста с ID ${post_id} нет комментариев` });
        }

        res.status(200).json({
            message: `Комментарии для поста с ID ${post_id}`,
            comments,
        });
    } catch (error) {
        console.error(`Ошибка при получении комментариев для поста с ID ${post_id}:`, error);
        res.status(500).json({ message: 'Ошибка сервера при получении комментариев' });
    }
};

exports.createComment = async (req, res) => {
    const { post_id } = req.params;
    const { content } = req.body;
    const user_id = req.user.id; // Предполагаем, что ID пользователя извлекается из токена аутентификации

    // Проверка на наличие контента
    if (!content || content.trim() === '') {
        return res.status(400).json({ message: 'Поле "content" не может быть пустым' });
    }

    try {
        // Проверяем, существует ли пост с данным ID
        const post = await Post.findByPk(post_id);
        if (!post) {
            return res.status(404).json({ message: `Пост с ID ${post_id} не найден` });
        }

        // Создание комментария
        const newComment = await Comment.create({
            post_id,
            author_id: user_id,
            content,
        });

        res.status(201).json({
            message: `Комментарий для поста с ID ${post_id} создан`,
            comment: newComment,
        });
    } catch (error) {
        console.error(`Ошибка при создании комментария для поста с ID ${post_id}:`, error);
        res.status(500).json({ message: 'Ошибка сервера при создании комментария' });
    }
};

exports.getCategoriesForPost = async (req, res) => {
    const { post_id } = req.params;

    try {
        // Поиск поста по ID и получение связанных категорий
        const post = await Post.findByPk(post_id, {
            include: [
                {
                    model: Category,
                    attributes: ['id', 'title', 'description'], // Поля категории
                    through: { attributes: [] }, // Исключаем промежуточные данные из таблицы PostCategory
                },
            ],
        });

        // Если пост не найден, возвращаем 404
        if (!post) {
            return res.status(404).json({ message: `Пост с ID ${post_id} не найден` });
        }

        // Возвращаем связанные категории
        res.status(200).json({
            message: `Категории для поста с ID ${post_id}`,
            categories: post.Categories, // Массив категорий
        });
    } catch (error) {
        console.error(`Ошибка при получении категорий для поста с ID ${post_id}:`, error);
        res.status(500).json({ message: 'Ошибка сервера при получении категорий для поста' });
    }
};

exports.getLikesForPost = async (req, res) => {
    try {
        const postId = req.params.post_id;

        // Проверяем, существует ли пост
        const post = await Post.findByPk(postId);
        if (!post) {
            return res.status(404).json({ message: 'Пост не найден' });
        }

        // Получаем количество лайков для указанного поста
        const likeCount = await Like.count({
            where: { post_id: postId }
        });

        // Возвращаем количество лайков
        res.json({ postId, likeCount });
    } catch (error) {
        console.error(`Ошибка при получении лайков для поста с ID ${postId}:`, error);
        res.status(500).json({ message: 'Ошибка сервера при получении лайков' });
    }
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

exports.likePost = async (req, res) => {
    const { type } = req.body;

    try {
        const postId = req.params.post_id;
        const userId = req.user.id; // предполагается, что пользователь аутентифицирован

        if (!type) {
            return res.status(400).json({ message: 'Необходимо указать тип' });
        }

        // Найдем пост по ID
        const post = await Post.findByPk(postId);
        if (!post) {
            return res.status(404).json({ message: 'Пост не найден' });
        }

        // Проверяем, лайкнул ли уже пользователь этот пост
        const existingLike = await Like.findOne({
            where: { post_id: postId, author_id: userId, comment_id: null }
        });

        if (existingLike) {
            return res.json({ message: `Лайк для поста с ID ${postId} уже есть` });
        } else {
            // Создаем новый лайк для поста
            await Like.create({
                post_id: postId,
                author_id: userId,
                type: type
            });

            return res.json({ message: `Пост с ID ${postId} был лайкнут` });
        }
    } catch (error) {
        console.error(`Ошибка при обработке лайка для поста с ID ${req.params.post_id}:`, error);
        res.status(500).json({ message: 'Ошибка сервера при лайке поста' });
    }
};

exports.updatePost = (req, res) => {
    console.log(`Обновление поста с ID ${req.params.post_id}`);
    res.json({ message: `Пост с ID ${req.params.post_id} обновлен` });
};

exports.deletePost = async (req, res) => {
    try {
        const postId = req.params.post_id;

        // Проверяем, существует ли пост
        const post = await Post.findByPk(postId);
        if (!post) {
            return res.status(404).json({ message: 'Пост не найден' });
        }

        // Удаление поста
        await post.destroy();
        
        res.json({ message: `Пост с ID ${postId} удален` });
    } catch (error) {
        console.error(`Ошибка при удалении поста с ID ${postId}:`, error);
        res.status(500).json({ message: 'Ошибка сервера при удалении поста' });
    }
};

exports.deleteLike = async (req, res) => {
    try {
        const postId = req.params.post_id;
        const userId = req.user.id; // Предполагается, что пользователь аутентифицирован

        // Найдем пост по ID, чтобы убедиться, что он существует
        const post = await Post.findByPk(postId);
        if (!post) {
            return res.status(404).json({ message: 'Пост не найден' });
        }

        // Найдем существующий лайк для данного поста и пользователя
        const existingLike = await Like.findOne({
            where: { post_id: postId, author_id: userId, comment_id: null }
        });

        if (!existingLike) {
            return res.status(404).json({ message: 'Лайк не найден' });
        }

        // Удаляем лайк
        await existingLike.destroy();
        return res.json({ message: `Лайк для поста с ID ${postId} был удален` });
    } catch (error) {
        console.error(`Ошибка при удалении лайка для поста с ID ${postId}:`, error);
        res.status(500).json({ message: 'Ошибка сервера при удалении лайка' });
    }
};
