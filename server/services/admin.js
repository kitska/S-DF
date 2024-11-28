const AdminJS = require('adminjs');
const AdminJSExpress = require('@adminjs/express');
const AdminJSequalize = require('@adminjs/sequelize');
const Post = require('../models/post');
const Category = require('../models/category');
const PostCategory = require('../models/post_category');
const Comment = require('../models/comment');
const User = require('../models/user');
const Like = require('../models/like');
const favorite = require('../models/favorite');
const bcrypt = require('bcrypt');

const authenticate = async (email, password) => {
	const user = await User.findOne({
		where: { email, role: 'admin' },
	});

	if (!user) {
		return null;
	}

	const validPassword = await bcrypt.compare(password, user.password);

	if (!validPassword) {
		return null;
	}

	return Promise.resolve({ email, password });
};

AdminJS.registerAdapter({
	Resource: AdminJSequalize.Resource,
	Database: AdminJSequalize.Database,
});

const makeRelationships = async req => {
	if (req.record.params) {
		const { id } = req.record.params;
		let uniqueCategories = new Set();
		let uniqueFavorites = new Set();

		for (const key in req.record.params) {
			if (key.startsWith('categories.')) {
				const CategoryId = req.record.params[key];
				uniqueCategories.add(CategoryId);
			}
		}

		for (const key in req.record.params) {
			if (key.startsWith('favorites.')) {
				const UserId = req.record.params[key];
				uniqueFavorites.add(UserId);
			}
		}

		try {
			const categories = await Category.findAll({
				where: { id: Array.from(uniqueCategories) },
			});

			const post = await Post.findByPk(id);
			if (post) {
				await post.setCategories(categories);
			}

			const favorites = await favorite.findAll({
				where: { user_id: Array.from(uniqueFavorites) },
			});

			if (favorites.length > 0) {
				await post.addFavorites(favorites);
			}
		} catch (err) {
			console.error('Error when setting categories or favorites:', err);
		}
	}

	return req;
};

const locale = {
	translations: {
		labels: {},
		messages: {
			loginWelcome: 'Welcome to the administration page. Enter your administrator login information.',
		},
	},
};

const admin = new AdminJS({
	resources: [
		{
			resource: User,
			options: {
				listProperties: [
					'id',
					'login',
					'password',
					'full_name',
					'email',
					'profile_picture',
					'rating',
					'role',
					'email_confirmed',
				],
				filterProperties: [
					'id',
					'login',
					'password',
					'full_name',
					'email',
					'profile_picture',
					'rating',
					'role',
					'email_confirmed',
				],
				editProperties: [
					'id',
					'login',
					'password',
					'full_name',
					'email',
					'profile_picture',
					'rating',
					'role',
					'email_confirmed',
				],
				showProperties: [
					'id',
					'login',
					'password',
					'full_name',
					'email',
					'profile_picture',
					'rating',
					'role',
					'email_confirmed',
				],
			},
		},
		{
			resource: Post,
			options: {
				listProperties: [
					'id',
					'title',
					'author_id',
					'status',
					'publish_date',
				],
				filterProperties: ['id', 'title', 'author_id', 'status'],
				editProperties: ['title', 'author_id', 'status', 'content'],
				showProperties: [
					'id',
					'title',
					'author_id',
					'status',
					'content',
					'publish_date',
				],
				after: {
					edit: makeRelationships,
					new: makeRelationships,
				},
			},
		},
		{
			resource: Category,
			options: {
				listProperties: ['id', 'title', 'description'],
				filterProperties: ['id', 'title'],
				editProperties: ['title', 'description'],
				showProperties: ['id', 'title', 'description'],
			},
		},
		{
			resource: Comment,
			options: {
				listProperties: [
					'id',
					'post_id',
					'author_id',
					'content',
					'publish_date',
				],
				filterProperties: ['id', 'post_id', 'author_id'],
				editProperties: ['post_id', 'author_id', 'content'],
				showProperties: [
					'id',
					'post_id',
					'author_id',
					'content',
					'publish_date',
				],
			},
		},
		{
			resource: Like,
			options: {
				listProperties: [
					'id',
					'post_id',
					'comment_id',
					'author_id',
					'type',
					'publish_date',
				],
				filterProperties: [
					'id',
					'post_id',
					'comment_id',
					'author_id',
					'type',
				],
				editProperties: ['post_id', 'comment_id', 'author_id', 'type'],
				showProperties: [
					'id',
					'post_id',
					'comment_id',
					'author_id',
					'type',
					'publish_date',
				],
			},
		},
		{
			resource: PostCategory,
			options: {
				listProperties: ['post_id', 'category_id'],
				filterProperties: ['post_id', 'category_id'],
				editProperties: ['post_id', 'category_id'],
				showProperties: ['post_id', 'category_id'],
			},
		},
		{
			resource: favorite,
			options: {
				listProperties: ['id', 'user_id', 'post_id'],
				filterProperties: ['id', 'user_id', 'post_id'],
				editProperties: ['user_id', 'post_id'],
				showProperties: ['id', 'user_id', 'post_id'],
				after: {
					edit: makeRelationships,
					new: makeRelationships,
				},
			},
		},
	],
	locale,
	branding: {
		companyName: 'Mythical Production',
	},
});

const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
	admin,
	{
		authenticate,
		cookieName: 'adminjs',
		cookiePassword: 'sessionsecret',
	},
	null,
	{
		resave: true,
		saveUninitialized: true,
	}
);

module.exports = adminRouter;
