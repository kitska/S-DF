require('dotenv').config();
const mysql = require('mysql2/promise');
const { sequelize } = require('./db');
const bcrypt = require('bcrypt');
const Post = require('../models/post');
const Category = require('../models/category');
const PostCategory = require('../models/post_category');
const Comment = require('../models/comment');
const User = require('../models/user');
const Like = require('../models/like');
const favorite = require('../models/favorite');
const { faker } = require('@faker-js/faker');
const randomPP = require('../services/randomPP');

const setAssociations = () => {
	Post.belongsToMany(Category, {
		through: PostCategory,
		foreignKey: 'post_id',
	});
	Category.belongsToMany(Post, {
		through: PostCategory,
		foreignKey: 'category_id',
	});

	User.belongsToMany(Post, { through: favorite, foreignKey: 'user_id' });
	Post.belongsToMany(User, { through: favorite, foreignKey: 'post_id' });

	Post.hasMany(Comment, { foreignKey: 'post_id' });
	Comment.belongsTo(Post, { foreignKey: 'post_id' });

	Post.hasMany(Like, { foreignKey: 'post_id' });
	Comment.hasMany(Like, { foreignKey: 'comment_id' });

	User.hasMany(Post, { foreignKey: 'author_id' });
	User.hasMany(Comment, { foreignKey: 'author_id' });
	User.hasMany(Like, { foreignKey: 'author_id' });
	Comment.belongsTo(Comment, { as: 'ParentComment', foreignKey: 'comment_id' });
	Comment.hasMany(Comment, { as: 'Replies', foreignKey: 'comment_id' });
};

const createDatabase = async () => {
	try {
		const connection = await mysql.createConnection({
			host: process.env.DB_HOST,
			user: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
		});

		const [rows] = await connection.query(`SHOW DATABASES LIKE '${process.env.DB_NAME}'`);
		if (rows.length === 0) {
			await connection.query(`CREATE DATABASE \`${process.env.DB_NAME}\``);
			console.log(`Database ${process.env.DB_NAME} created successfully`);
		} else {
			console.log(`Database ${process.env.DB_NAME} already exists`);
		}

		await connection.end();

		const tableExists = await sequelize.query(`
			SELECT table_name 
			FROM information_schema.tables 
			WHERE table_schema = '${process.env.DB_NAME}'
			LIMIT 1;
		`);

		if (tableExists[0].length === 0) {
			await sequelize.sync({ force: false });
			console.log('Tables successfully created based on models');

			await insertTestData();
			console.log('Test data has been successfully added to the tables');
		} else {
			console.log('Tables have already been created');
		}

		return sequelize;
	} catch (error) {
		console.error('Error when creating database or tables:', error);
		process.exit(1);
	}
};

const insertTestData = async () => {
	try {
		const adminUser = {
			login: 'admin',
			password: 'password1',
			full_name: 'Admin One',
			email: 'Admin@example.com',
			email_confirmed: true,
			role: 'admin',
		};

		await User.create(adminUser);

		const testUsers = [
			...Array.from({ length: 1000 }).map(() => ({
				login: faker.internet.username(),
				password: faker.internet.password(),
				full_name: faker.person.fullName(),
				email: faker.internet.email(),
				profile_picture: randomPP.getRandomProfilePicture(),
				rating: Math.floor(Math.random() * 400) - 200,
				email_confirmed: true,
			})),
		];

		const hashedUsers = await Promise.all(
			testUsers.map(async user => {
				const hashedPassword = await bcrypt.hash(user.password, 10);
				return { ...user, password: hashedPassword };
			})
		);

		await User.bulkCreate(hashedUsers, { ignoreDuplicates: true });

		const testCategories = Array.from({ length: 200 }).map(() => ({
			title: faker.word.noun(),
		}));

		await Category.bulkCreate(testCategories, { ignoreDuplicates: true });

		const testPosts = Array.from({ length: 100 }).map(() => ({
			title: faker.lorem.sentence(),
			content: faker.lorem.paragraphs(3),
			status: faker.helpers.arrayElement(['active', 'inactive']),
			author_id: faker.number.int({ min: 1, max: 1000 }),
		}));

		await Post.bulkCreate(testPosts, { ignoreDuplicates: true });

		const testCategoriesAll = await Category.findAll();
		const testPostsAll = await Post.findAll();

		for (const post of testPostsAll) {
			const categories = testCategoriesAll.sort(() => 0.5 - Math.random()).slice(0, 8);
			await post.addCategories(categories);
		}

		const testComments = Array.from({ length: 3000 }).map(() => ({
			content: faker.lorem.sentence(),
			post_id: faker.number.int({ min: 1, max: testPostsAll.length }),
			author_id: faker.number.int({ min: 1, max: 1000 }),
		}));

		const insertedComments = await Comment.bulkCreate(testComments, { ignoreDuplicates: true });

		const nestedComments = Array.from({ length: 3000 }).map(() => {
			const parentComment = insertedComments[Math.floor(Math.random() * insertedComments.length)];
			return {
				content: faker.lorem.sentence(),
				post_id: parentComment.post_id,
				author_id: faker.number.int({ min: 1, max: 1000 }),
				comment_id: parentComment.id,
			};
		});

		await Comment.bulkCreate(nestedComments, { ignoreDuplicates: true });

		const testLikes = Array.from({ length: 10000 }).map(() => ({
			post_id: faker.number.int({ min: 1, max: testPostsAll.length }),
			author_id: faker.number.int({ min: 1, max: 1000 }),
			type: faker.helpers.arrayElement(['like', 'dislike']),
		}));

		await Like.bulkCreate(testLikes, { ignoreDuplicates: true });

		const commentLikes = Array.from({ length: 10000 }).map(() => ({
			comment_id: faker.number.int({ min: 1, max: (insertedComments.length + nestedComments.length) }),
			author_id: faker.number.int({ min: 1, max: 1000 }),
			type: faker.helpers.arrayElement(['like', 'dislike']),
		}));

		await Like.bulkCreate(commentLikes, { ignoreDuplicates: true });

		const testFavorites = Array.from({ length: 5000 }).map(() => ({
			user_id: faker.number.int({ min: 1, max: 1000 }),
			post_id: faker.number.int({ min: 1, max: testPostsAll.length }),
		}));

		await favorite.bulkCreate(testFavorites, { ignoreDuplicates: true });

		console.log('Test data inserted successfully!');
	} catch (error) {
		console.error('Error adding test data:', error);
	}
};

module.exports = createDatabase;
