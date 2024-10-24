const Post = require('../models/post');
const Category = require('../models/category');
const PostCategory = require('../models/post_category');
const Comment = require('../models/comment');
const User = require('../models/user');
const Like = require('../models/like');
const Favourite = require('../models/favourite');
const { Op } = require('sequelize');

exports.getAllPosts = async (req, res) => {
	try {
		const page = parseInt(req.query.page) || 1;
		const pageSize = parseInt(req.query.pageSize) || 10;

		const offset = (page - 1) * pageSize;
		const limit = pageSize;

		const { title, author_id } = req.query;
		const filter = {};

		if (title) {
			filter.title = { [Op.like]: `%${title}%` };
		}
		if (author_id) {
			filter.author_id = author_id;
		}

		const sortBy = req.query.sortBy || 'publish_date';
		const sortOrder = req.query.sortOrder === 'asc' ? 'ASC' : 'DESC';

		const { count, rows: posts } = await Post.findAndCountAll({
			where: filter,
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
			order: [[sortBy, sortOrder]],
			distinct: true,
		});

		if (posts.length === 0) {
			return res.status(404).json({ message: 'No posts found' });
		}

		const totalPages = Math.ceil(count / pageSize);

		res.status(200).json({
			message: 'List of all posts',
			currentPage: page,
			totalPages,
			totalPosts: count,
			postsPerPage: pageSize,
			posts,
		});
	} catch (error) {
		console.error('Error when receiving posts:', error);
		res.status(500).json({ message: 'Server error when receiving posts' });
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
			return res.status(404).json({ message: `Post with ID ${post_id} not found` });
		}

		res.status(200).json({
			message: `Post with ID ${post_id}`,
			post,
		});
	} catch (error) {
		console.error(`Error when retrieving post with ID ${post_id}:`, error);
		res.status(500).json({ message: 'Server error when receiving post' });
	}
};

exports.getCommentsForPost = async (req, res) => {
	const { post_id } = req.params;

	try {
		const post = await Post.findByPk(post_id);
		if (!post) {
			return res.status(404).json({ message: `Post with ID ${post_id} not found` });
		}

		const comments = await Comment.findAll({
			where: { post_id },
			attributes: ['id', 'author_id', 'content', 'publish_date'],
			order: [['publish_date', 'DESC']],
		});

		if (comments.length === 0) {
			return res.status(404).json({ message: `There are no comments for post with ID ${post_id}` });
		}

		res.status(200).json({
			message: `Comments for post with ID ${post_id}`,
			comments,
		});
	} catch (error) {
		console.error(`Error getting comments for post with ID ${post_id}:`, error);
		res.status(500).json({ message: 'Server error when receiving comments' });
	}
};

exports.createComment = async (req, res) => {
	const { post_id } = req.params;
	const { content } = req.body;
	const user_id = req.user.id;

	if (!content || content.trim() === '') {
		return res.status(400).json({ message: 'The "content" field cannot be empty' });
	}

	try {
		const post = await Post.findByPk(post_id);
		if (!post) {
			return res.status(404).json({ message: `Post with ID ${post_id} not found` });
		}

		const newComment = await Comment.create({
			post_id,
			author_id: user_id,
			content,
		});

		res.status(201).json({
			message: `A comment has been created for post with ID ${post_id}`,
			comment: newComment,
		});
	} catch (error) {
		console.error(`Error when creating a comment for a post with ID ${post_id}:`, error);
		res.status(500).json({ message: 'Server error when creating a comment' });
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
			return res.status(404).json({ message: `Post with ID ${post_id} not found` });
		}

		res.status(200).json({
			message: `Categories for post with ID ${post_id}`,
			categories: post.Categories,
		});
	} catch (error) {
		console.error(`Error getting categories for post with ID ${post_id}:`, error);
		res.status(500).json({ message: 'Server error when getting categories for a post' });
	}
};

exports.getLikesForPost = async (req, res) => {
	try {
		const postId = req.params.post_id;

		const post = await Post.findByPk(postId);
		if (!post) {
			return res.status(404).json({ message: 'Post not found' });
		}

		const likeCount = await Like.count({
			where: { post_id: postId },
		});

		res.json({ postId, likeCount });
	} catch (error) {
		console.error(`Error when getting likes for a post with ID ${postId}:`, error);
		res.status(500).json({ message: 'Server error when receiving likes' });
	}
};

exports.createPost = async (req, res) => {
	const { title, content, categories } = req.body;

	try {
		if (!title || !content || !categories || !Array.isArray(categories)) {
			return res.status(400).json({ message: 'Title, content and categories are required' });
		}

		const newPost = await Post.create({
			title,
			content,
			author_id: req.user.id,
		});

		if (categories.length > 0) {
			const categoryPromises = categories.map(async category_id => {
				const category = await Category.findByPk(category_id);
				if (!category) {
					throw new Error(`Category with ID ${category_id} not found`);
				}

				await PostCategory.create({
					post_id: newPost.id,
					category_id: category_id,
				});
			});

			await Promise.all(categoryPromises);
		}

		res.status(201).json({ message: 'Post successfully created', post: newPost });
	} catch (error) {
		console.error('Error creating post:', error);
		res.status(500).json({ message: 'Server error when creating a post' });
	}
};

exports.likePost = async (req, res) => {
	const { type } = req.body;

	try {
		const postId = req.params.post_id;
		const userId = req.user.id;

		if (!type || (type !== 'like' && type !== 'dislike')) {
			return res.status(400).json({ message: 'You must specify the correct type: like or dislike' });
		}

		const post = await Post.findByPk(postId);
		if (!post) {
			return res.status(404).json({ message: 'Post not found' });
		}

		const existingLike = await Like.findOne({
			where: { post_id: postId, author_id: userId, comment_id: null },
		});

		if (existingLike) {
			if (existingLike.type === type) {
				return res.json({ message: `Have you already put ${type === 'like' ? 'like' : 'dislike'} on this post` });
			} else {
				return res.status(400).json({ message: 'You can`t like and dislike at the same time' });
			}
		}

		await Like.create({
			post_id: postId,
			author_id: userId,
			type: type,
		});

		const postAuthor = await User.findByPk(post.author_id);

		if (type === 'like') {
			postAuthor.rating += 1;
			await postAuthor.save();
			return res.json({ message: `Post with ID ${postId} was liked` });
		} else if (type === 'dislike') {
			postAuthor.rating -= 1;
			await postAuthor.save();
			return res.json({ message: `Post with ID ${postId} was disliked` });
		}
	} catch (error) {
		console.error(`Error when processing likes or dislikes for a post with ID ${req.params.post_id}:`, error);
		res.status(500).json({ message: 'Server error when processing a like or dislike' });
	}
};

exports.updatePost = async (req, res) => {
	const postId = req.params.post_id;
	const { title, content, categories, status } = req.body;

	try {
		const post = await Post.findByPk(postId);

		if (!post) {
			return res.status(404).json({ message: 'Post not found' });
		}

		if (post.author_id !== req.user.id) {
			return res.status(403).json({ message: 'You do not have permission to update this post' });
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

		res.json({ message: `Post with ID ${postId} updated`, post });
	} catch (error) {
		console.error('Error updating post:', error);
		res.status(500).json({ message: 'Error updating post' });
	}
};

exports.deletePost = async (req, res) => {
	try {
		const postId = req.params.post_id;

		const post = await Post.findByPk(postId);
		if (!post) {
			return res.status(404).json({ message: 'Post not found' });
		}

		await post.destroy();

		res.json({ message: `Post with ID ${postId} has been deleted` });
	} catch (error) {
		console.error(`Error when deleting post with ID ${postId}:`, error);
		res.status(500).json({ message: 'Server error when deleting a post' });
	}
};

exports.deleteLike = async (req, res) => {
	try {
		const postId = req.params.post_id;
		const userId = req.user.id;

		const post = await Post.findByPk(postId);
		if (!post) {
			return res.status(404).json({ message: 'Post not found' });
		}

		const existingLike = await Like.findOne({
			where: { post_id: postId, author_id: userId, comment_id: null },
		});

		if (!existingLike) {
			return res.status(404).json({ message: 'Like not found' });
		}

		await existingLike.destroy();
		return res.json({ message: `The like for post with ID ${postId} has been removed` });
	} catch (error) {
		console.error(`Error when deleting a like for a post with ID ${postId}:`, error);
		res.status(500).json({ message: 'Server error when deleting a like' });
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
			res.status(201).json({ message: 'Post added to favorites' });
		} else {
			res.status(200).json({ message: 'Post already favorited' });
		}
	} catch (error) {
		res.status(500).json({ error: 'Error when adding a post to favorites' });
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
			res.status(200).json({ message: 'Post removed from favorites' });
		} else {
			res.status(404).json({ message: 'Post not found in favorites' });
		}
	} catch (error) {
		res.status(500).json({ error: 'Error when deleting a post from favorites' });
	}
};
