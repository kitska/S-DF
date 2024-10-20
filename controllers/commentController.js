const Like = require('../models/like');
const Comment = require('../models/comment');
const Post = require('../models/post');

exports.getCommentById = async (req, res) => {
    const commentId = req.params.comment_id;

    try {
        const comment = await Comment.findByPk(commentId);

        if (!comment) {
            return res.status(404).json({ message: 'Комментарий не найден' });
        }

        res.status(200).json(comment);
    } catch (error) {
        console.error('Ошибка при получении комментария:', error);
        res.status(500).json({ message: 'Ошибка при получении комментария' });
    }
};

exports.getLikesForComment = async (req, res) => {
    const commentId = req.params.comment_id;

    try {
        const likeCount = await Like.count({
            where: {
                comment_id: commentId
            },
        });

        res.status(200).json({ commentId: commentId, likes: likeCount });
    } catch (error) {
        console.error('Ошибка при получении количества лайков:', error);
        res.status(500).json({ message: 'Ошибка при получении количества лайков' });
    }
};

exports.likeComment = async (req, res) => {
    const { type } = req.body;
    
    const commentId = req.params.comment_id;
    const userId = req.user.id;

    try {
        const comment = await Comment.findByPk(commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Комментарий не найден' });
        }

        const existingLike = await Like.findOne({
            where: {
                comment_id: commentId,
                author_id: userId,
            },
        });

        if (existingLike) {
            return res.status(400).json({ message: 'Вы уже лайкнули этот комментарий' });
        }

        const like = await Like.create({
            comment_id: commentId,
            author_id: userId,
            type: type,
        });

        res.status(201).json({ message: `Комментарий с ID ${commentId} был лайкнут`, like });
    } catch (error) {
        console.error('Ошибка при добавлении лайка к комментарию:', error);
        res.status(500).json({ message: 'Ошибка при добавлении лайка к комментарию' });
    }
};

exports.updateComment = async (req, res) => {
    const commentId = req.params.comment_id;
    const { content, status } = req.body;

    try {
        const comment = await Comment.findByPk(commentId);

        if (!comment) {
            return res.status(404).json({ message: 'Комментарий не найден' });
        }

        if (comment.author_id !== req.user.id) {
            return res.status(403).json({ message: 'У вас нет прав для обновления этого комментария' });
        }

        if (content) {
            comment.content = content;
        }

        if (status) {
            comment.status = status;
        }

        await comment.save();

        res.status(200).json({ message: `Комментарий с ID ${commentId} обновлен`, comment });
    } catch (error) {
        console.error('Ошибка при обновлении комментария:', error);
        res.status(500).json({ message: 'Ошибка при обновлении комментария' });
    }
};

exports.deleteComment = async (req, res) => {
    const commentId = req.params.comment_id;

    try {
        const comment = await Comment.findByPk(commentId);

        if (!comment) {
            return res.status(404).json({ message: 'Комментарий не найден' });
        }

        if (comment.author_id !== req.user.id) {
            return res.status(403).json({ message: 'У вас нет прав для удаления этого комментария' });
        }

        await comment.destroy();

        res.status(200).json({ message: `Комментарий с ID ${commentId} удален` });
    } catch (error) {
        console.error('Ошибка при удалении комментария:', error);
        res.status(500).json({ message: 'Ошибка при удалении комментария' });
    }
};

exports.deleteLike = async (req, res) => {
    const commentId = req.params.comment_id;
    const userId = req.user.id;

    try {
        const like = await Like.findOne({
            where: {
                comment_id: commentId,
                author_id: userId,
            },
        });

        if (!like) {
            return res.status(404).json({ message: 'Лайк не найден' });
        }

        await like.destroy();

        res.status(200).json({ message: `Лайк для комментария с ID ${commentId} удален` });
    } catch (error) {
        console.error('Ошибка при удалении лайка для комментария:', error);
        res.status(500).json({ message: 'Ошибка при удалении лайка' });
    }
};