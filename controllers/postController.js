const Post = require('../models/post');
const Category = require('../models/category');
const PostCategory = require('../models/post_category');
const Comment = require('../models/comment');
const User = require('../models/user');
const Like = require('../models/like');
const Favourite = require('../models/favourite');

exports.getAllPosts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;

        const offset = (page - 1) * pageSize;
        const limit = pageSize;

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
                    through: { attributes: [] },
                },
            ],
        });

        if (posts.length === 0) {
            return res.status(404).json({ message: 'Посты не найдены' });
        }

        const totalPages = Math.ceil(count / pageSize);

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
        const post = await Post.findByPk(post_id, {
            include: [
                {
                    model: User,
                    attributes: ['id', 'full_name', 'login'],
                },
                {
                    model: Category,
                    attributes: ['id', 'title'],
                    through: { attributes: [] },
                },
            ],
        });

        if (!post) {
            return res.status(404).json({ message: `Пост с ID ${post_id} не найден` });
        }

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
        const post = await Post.findByPk(post_id);
        if (!post) {
            return res.status(404).json({ message: `Пост с ID ${post_id} не найден` });
        }

        const comments = await Comment.findAll({
            where: { post_id },
            attributes: ['id', 'author_id', 'content', 'publish_date'],
            order: [['publish_date', 'DESC']],
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
    const user_id = req.user.id;

    if (!content || content.trim() === '') {
        return res.status(400).json({ message: 'Поле "content" не может быть пустым' });
    }

    try {
        const post = await Post.findByPk(post_id);
        if (!post) {
            return res.status(404).json({ message: `Пост с ID ${post_id} не найден` });
        }

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
        const post = await Post.findByPk(post_id, {
            include: [
                {
                    model: Category,
                    attributes: ['id', 'title', 'description'],
                    through: { attributes: [] },
                },
            ],
        });

        if (!post) {
            return res.status(404).json({ message: `Пост с ID ${post_id} не найден` });
        }

        res.status(200).json({
            message: `Категории для поста с ID ${post_id}`,
            categories: post.Categories,
        });
    } catch (error) {
        console.error(`Ошибка при получении категорий для поста с ID ${post_id}:`, error);
        res.status(500).json({ message: 'Ошибка сервера при получении категорий для поста' });
    }
};

exports.getLikesForPost = async (req, res) => {
    try {
        const postId = req.params.post_id;

        const post = await Post.findByPk(postId);
        if (!post) {
            return res.status(404).json({ message: 'Пост не найден' });
        }

        const likeCount = await Like.count({
            where: { post_id: postId }
        });

        res.json({ postId, likeCount });
    } catch (error) {
        console.error(`Ошибка при получении лайков для поста с ID ${postId}:`, error);
        res.status(500).json({ message: 'Ошибка сервера при получении лайков' });
    }
};

exports.createPost = async (req, res) => {
    const { title, content, categories } = req.body;

    try {
        if (!title || !content || !categories || !Array.isArray(categories)) {
            return res.status(400).json({ message: 'Необходимо указать заголовок, содержимое и категории' });
        }

        const newPost = await Post.create({
            title,
            content,
            author_id: req.user.id,
        });

        if (categories.length > 0) {
            const categoryPromises = categories.map(async (category_id) => {
                const category = await Category.findByPk(category_id);
                if (!category) {
                    throw new Error(`Категория с ID ${category_id} не найдена`);
                }

                await PostCategory.create({
                    post_id: newPost.id,
                    category_id: category_id,
                });
            });

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
        const userId = req.user.id;

        if (!type) {
            return res.status(400).json({ message: 'Необходимо указать тип' });
        }

        const post = await Post.findByPk(postId);
        if (!post) {
            return res.status(404).json({ message: 'Пост не найден' });
        }

        const existingLike = await Like.findOne({
            where: { post_id: postId, author_id: userId, comment_id: null }
        });

        if (existingLike) {
            return res.json({ message: `Лайк для поста с ID ${postId} уже есть` });
        } else {
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

exports.updatePost = async (req, res) => {
    const postId = req.params.post_id;
    const { title, content, categories, status } = req.body;

    try {
        const post = await Post.findByPk(postId);

        if (!post) {
            return res.status(404).json({ message: 'Пост не найден' });
        }

        if (post.author_id !== req.user.id) {
            return res.status(403).json({ message: 'У вас нет прав для обновления этого поста' });
        }

        if (title) post.title = title;
        if (content) post.content = content;
        if (status) post.status = status;

        await post.save();

        if (categories) {
            await PostCategory.destroy({ where: { post_id: postId } });

            const categoryIds = Array.isArray(categories) ? categories : [categories];

            const postCategoryData = categoryIds.map(categoryId => ({
                post_id: postId,
                category_id: categoryId,
            }));

            await PostCategory.bulkCreate(postCategoryData);
        }

        res.json({ message: `Пост с ID ${postId} обновлен`, post });
    } catch (error) {
        console.error('Ошибка при обновлении поста:', error);
        res.status(500).json({ message: 'Ошибка при обновлении поста' });
    }
};

exports.deletePost = async (req, res) => {
    try {
        const postId = req.params.post_id;

        const post = await Post.findByPk(postId);
        if (!post) {
            return res.status(404).json({ message: 'Пост не найден' });
        }

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
        const userId = req.user.id;

        const post = await Post.findByPk(postId);
        if (!post) {
            return res.status(404).json({ message: 'Пост не найден' });
        }

        const existingLike = await Like.findOne({
            where: { post_id: postId, author_id: userId, comment_id: null }
        });

        if (!existingLike) {
            return res.status(404).json({ message: 'Лайк не найден' });
        }

        await existingLike.destroy();
        return res.json({ message: `Лайк для поста с ID ${postId} был удален` });
    } catch (error) {
        console.error(`Ошибка при удалении лайка для поста с ID ${postId}:`, error);
        res.status(500).json({ message: 'Ошибка сервера при удалении лайка' });
    }
};

exports.addPostToFavourites = async (req, res) => {
    try {
        const userId = req.user.id;
        const { post_id } = req.params;

        const [favourite, created] = await Favourite.findOrCreate({
            where: { user_id: userId, post_id },
        });

        if (created) {
            res.status(201).json({ message: 'Пост добавлен в избранное' });
        } else {
            res.status(200).json({ message: 'Пост уже в избранном' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при добавлении поста в избранное' });
    }
};

exports.removePostFromFavourites = async (req, res) => {
    try {
        const userId = req.user.id;
        const { post_id } = req.params;

        const result = await Favourite.destroy({
            where: { user_id: userId, post_id },
        });

        if (result) {
            res.status(200).json({ message: 'Пост удален из избранного' });
        } else {
            res.status(404).json({ message: 'Пост не найден в избранном' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при удалении поста из избранного' });
    }
};