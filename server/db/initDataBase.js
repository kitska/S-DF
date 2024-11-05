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
const Favourite = require('../models/favourite');
const { faker } = require('@faker-js/faker');

const setAssociations = () => {
	Post.belongsToMany(Category, {
		through: PostCategory,
		foreignKey: 'post_id',
	});
	Category.belongsToMany(Post, {
		through: PostCategory,
		foreignKey: 'category_id',
	});

	User.belongsToMany(Post, { through: Favourite, foreignKey: 'user_id' });
	Post.belongsToMany(User, { through: Favourite, foreignKey: 'post_id' });

	Post.hasMany(Comment, { foreignKey: 'post_id' });
	Comment.belongsTo(Post, { foreignKey: 'post_id' });

	Post.hasMany(Like, { foreignKey: 'post_id' });
	Comment.hasMany(Like, { foreignKey: 'comment_id' });

	User.hasMany(Post, { foreignKey: 'author_id' });
	User.hasMany(Comment, { foreignKey: 'author_id' });
	User.hasMany(Like, { foreignKey: 'author_id' });
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
			setAssociations();

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
		// Создание тестовых пользователей
		const testUsers = [
			{
				login: 'admin',
				password: 'password1',
				full_name: 'Admin One',
				email: 'Admin@example.com',
				email_confirmed: true,
				role: 'admin',
			},
			...Array.from({ length: 1000 }).map(() => ({
				login: faker.internet.username(),
				password: faker.internet.password(),
				full_name: faker.person.fullName(),
				email: faker.internet.email(),
				rating: Math.floor(Math.random() * 400) - 200,
				email_confirmed: true,
			})),
		];

		// Хеширование паролей и вставка пользователей
		const hashedUsers = await Promise.all(
			testUsers.map(async user => {
				const hashedPassword = await bcrypt.hash(user.password, 10);
				return { ...user, password: hashedPassword };
			})
		);

		await User.bulkCreate(hashedUsers, { ignoreDuplicates: true });

		// Создание тестовых категорий
		const testCategories = Array.from({ length: 200 }).map(() => ({
			title: faker.commerce.department(),
			description: faker.lorem.sentence(),
		}));

		await Category.bulkCreate(testCategories, { ignoreDuplicates: true });

		// Создание тестовых постов
		const testPosts = Array.from({ length: 5000 }).map(() => ({
			title: faker.lorem.sentence(),
			content: faker.lorem.paragraphs(3),
			author_id: faker.number.int({ min: 1, max: 1000 }), // Увеличиваем диапазон авторов
		}));

		await Post.bulkCreate(testPosts, { ignoreDuplicates: true });

		// Получение всех категорий и постов
		const testCategoriesAll = await Category.findAll();
		const testPostsAll = await Post.findAll();

		// Добавление категорий к постам
		for (const post of testPostsAll) {
			const categories = testCategoriesAll.sort(() => 0.5 - Math.random()).slice(0, 3); // Увеличиваем количество категорий
			await post.addCategories(categories);
		}

		// Создание тестовых комментариев
		const testComments = Array.from({ length: 12000 }).map((_, index) => ({
			content: faker.lorem.sentence(),
			post_id: faker.number.int({ min: 1, max: testPostsAll.length }), // Увеличиваем диапазон постов
			author_id: faker.number.int({ min: 1, max: 1000 }),
		}));

		await Comment.bulkCreate(testComments, { ignoreDuplicates: true });

		// Создание тестовых лайков
		const testLikes = Array.from({ length: 8000 }).map(() => ({
			post_id: faker.number.int({ min: 1, max: testPostsAll.length }),
			author_id: faker.number.int({ min: 1, max: 1000 }),
			type: faker.helpers.arrayElement(['like', 'dislike']),
		}));

		await Like.bulkCreate(testLikes, { ignoreDuplicates: true });

		// Создание тестовых избранных записей
		const testFavourites = Array.from({ length: 5000 }).map(() => ({
			user_id: faker.number.int({ min: 1, max: 1000 }),
			post_id: faker.number.int({ min: 1, max: testPostsAll.length }),
		}));

		await Favourite.bulkCreate(testFavourites, { ignoreDuplicates: true });

		console.log('Test data inserted successfully!');
	} catch (error) {
		console.error('Error adding test data:', error);
	}
};

module.exports = createDatabase;
