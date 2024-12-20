const Like = require('../models/like');
const Comment = require('../models/comment');
const User = require('../models/user');

exports.getCommentById = async (req, res) => {
	const commentId = req.params.comment_id;

	try {
		const comment = await Comment.findByPk(commentId);

		if (!comment) {
			return res.status(404).json({ message: 'Comment not found' });
		}

		res.status(200).json(comment);
	} catch (error) {
		console.error('Error receiving comment:', error);
		res.status(500).json({ message: 'Error receiving comment' });
	}
};

exports.getLikesForComment = async (req, res) => {
	try {
		const { comment_id } = req.params;
		const { type, author_id } = req.query;

		const comment = await Comment.findByPk(comment_id);
		if (!comment) return res.status(404).json({ message: 'Comment not found' });

		const totalLikes = await Like.count({
			where: { comment_id, ...(type && { type }) },
		});

		let userLikes = [];
		if (author_id) {
			userLikes = await Like.findAll({
				where: {
					comment_id,
					author_id,
					...(type && { type }),
				},
				attributes: ['publish_date', 'id', 'author_id', 'type'],
			});
		}

		res.json({
			comment_id,
			likeCount: totalLikes,
			userLikes,
		});
	} catch (error) {
		console.error('Error when getting number of likes for comment:', error);
		res.status(500).json({ message: 'Error getting number of likes for comment' });
	}
};

exports.likeComment = async (req, res) => {
	const { type } = req.body;

	const commentId = req.params.comment_id;
	const userId = req.user.id;

	try {
		if (!type || (type !== 'like' && type !== 'dislike')) {
			return res.status(400).json({ message: 'You must specify the correct type: like or dislike' });
		}

		const comment = await Comment.findByPk(commentId);
		if (!comment) {
			return res.status(404).json({ message: 'Comment not found' });
		}

		const existingLike = await Like.findOne({
			where: {
				comment_id: commentId,
				author_id: userId,
			},
		});

		if (existingLike) {
			if (existingLike.type === type) {
				return res.status(400).json({ message: `You have already put ${type === 'like' ? 'like' : 'dislike'} on this comment` });
			} else {
				return res.status(400).json({ message: 'You cannot like and dislike one comment at the same time' });
			}
		}

		const like = await Like.create({
			comment_id: commentId,
			author_id: userId,
			type: type,
		});

		const commentAuthor = await User.findByPk(comment.author_id);

		if (type === 'like') {
			commentAuthor.rating += 1;
			await commentAuthor.save();
			res.status(201).json({ message: `Comment with ID ${commentId} was liked`, like });
		} else if (type === 'dislike') {
			commentAuthor.rating -= 1;
			await commentAuthor.save();
			res.status(201).json({ message: `Comment with ID ${commentId} has been disliked`, like });
		}
	} catch (error) {
		console.error('Error when adding a like or dislike to a comment:', error);
		res.status(500).json({ message: 'Server error when processing a like or dislike' });
	}
};

exports.replyToComment = async (req, res) => {
	try {
		const { comment_id } = req.params;
		const { content } = req.body;
		const author_id = req.user.id;

		const parentComment = await Comment.findByPk(comment_id);
		if (!parentComment) {
			return res.status(404).json({ message: 'Parent comment not found' });
		}

		const reply = await Comment.create({
			content,
			post_id: parentComment.post_id,
			author_id,
			comment_id,
		});

		const replyWithUser = await Comment.findByPk(reply.id, {
			include: [
				{
					model: User,
					attributes: ['id', 'login', 'profile_picture'],
				},
			],
		});

		res.status(201).json(replyWithUser);
	} catch (error) {
		console.error('Error creating reply:', error);
		res.status(500).json({ message: 'Server error', error });
	}
};

exports.updateComment = async (req, res) => {
	const commentId = req.params.comment_id;
	const { content, status } = req.body;

	try {
		const comment = await Comment.findByPk(commentId, {
			include: [
				{
					model: User,
					attributes: ['id', 'login', 'profile_picture'],
				},
			],
		});

		if (!comment) {
			return res.status(404).json({ message: 'Comment not found' });
		}

		if (comment.author_id !== req.user.id && req.user.role !== 'admin') {
			return res.status(403).json({ message: 'You do not have permission to update this comment' });
		}

		if (content) {
			comment.content = content;
		}

		if (status) {
			comment.status = status;
		}

		await comment.save();

		res.status(200).json({ message: `Comment with ID ${commentId} updated`, comment });
	} catch (error) {
		console.error('Error updating comment:', error);
		res.status(500).json({ message: 'Error updating comment' });
	}
};

exports.deleteComment = async (req, res) => {
	const commentId = req.params.comment_id;

	try {
		const comment = await Comment.findByPk(commentId);

		if (!comment) {
			return res.status(404).json({ message: 'Comment not found' });
		}

		if (comment.author_id !== req.user.id && req.user.role !== 'admin') {
			return res.status(403).json({ message: 'You do not have permission to delete this comment' });
		}

		await comment.destroy();

		res.status(200).json({ message: `Comment with ID ${commentId} has been deleted` });
	} catch (error) {
		console.error('Error when deleting comment:', error);
		res.status(500).json({ message: 'Error when deleting comment' });
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
			return res.status(404).json({ message: 'Like not found' });
		}

		await like.destroy();

		res.status(200).json({ message: `Like for comment with ID ${commentId} removed` });
	} catch (error) {
		console.error('Error when deleting a like for a comment:', error);
		res.status(500).json({ message: 'Error when deleting a like' });
	}
};
