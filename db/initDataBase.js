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

const setAssociations = () => {
  Post.belongsToMany(Category, { through: PostCategory, foreignKey: 'post_id' });
  Category.belongsToMany(Post, { through: PostCategory, foreignKey: 'category_id' });
  
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
      console.log(`База данных ${process.env.DB_NAME} успешно создана`);
    } else {
      console.log(`База данных ${process.env.DB_NAME} уже существует`);
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
      console.log('Таблицы успешно созданы на основе моделей');

      await insertTestData();
      console.log('Тестовые данные успешно добавлены в таблицы');
    } else {
      console.log('Таблицы уже созданы');
    }

    return sequelize;
  } catch (error) {
    console.error('Ошибка при создании базы данных или таблиц:', error);
    process.exit(1);
  }
};

const insertTestData = async () => {
  try {
    const testUsers = [
      { login: 'admin', password: 'password1', full_name: 'Admin One', email: 'Admin@example.com', email_confirmed: true, role: 'admin' },
      { login: 'user2', password: 'password2', full_name: 'User Two', email: 'user2@example.com', email_confirmed: true },
      { login: 'user3', password: 'password3', full_name: 'User Three', email: 'user3@example.com', email_confirmed: true },
      { login: 'user4', password: 'password4', full_name: 'User Four', email: 'user4@example.com', email_confirmed: true },
      { login: 'user5', password: 'password5', full_name: 'User Five', email: 'user5@example.com', email_confirmed: true },
    ];

    for (const user of testUsers) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      user.password = hashedPassword;

      await User.findOrCreate({
        where: { email: user.email },
        defaults: user,
      });
    }

    const testCategories = [
      { title: 'Category 1', description: 'Description 1' },
      { title: 'Category 2', description: 'Description 2' },
      { title: 'Category 3', description: 'Description 3' },
      { title: 'Category 4', description: 'Description 4' },
      { title: 'Category 5', description: 'Description 5' },
    ];

    for (const category of testCategories) {
      await Category.findOrCreate({
        where: { title: category.title },
        defaults: category,
      });
    }

    const testPosts = [
      { title: 'Post 1', content: 'Content for post 1', author_id: 1 },
      { title: 'Post 2', content: 'Content for post 2', author_id: 2 },
      { title: 'Post 3', content: 'Content for post 3', author_id: 3 },
      { title: 'Post 4', content: 'Content for post 4', author_id: 4 },
      { title: 'Post 5', content: 'Content for post 5', author_id: 5 },
    ];

    for (const post of testPosts) {
      await Post.findOrCreate({
        where: { title: post.title },
        defaults: post,
      });
    }

    const test_Categories = await Category.findAll();
    const test_Posts = await Post.findAll();

    for (const post of test_Posts) {
      const categories = test_Categories.sort(() => 0.5 - Math.random()).slice(0, 2);
      await post.addCategories(categories);
    }

    const testComments = [
      { content: 'Comment 1', post_id: 1, author_id: 2 },
      { content: 'Comment 2', post_id: 2, author_id: 3 },
      { content: 'Comment 3', post_id: 3, author_id: 4 },
      { content: 'Comment 4', post_id: 4, author_id: 5 },
      { content: 'Comment 5', post_id: 5, author_id: 1 },
    ];

    for (const comment of testComments) {
      await Comment.findOrCreate({
        where: { content: comment.content, post_id: comment.post_id },
        defaults: comment,
      });
    }

    const testLikes = [
      { post_id: 1, author_id: 2, type: 'like' },
      { post_id: 2, author_id: 3, type: 'dislike' },
      { post_id: 3, author_id: 4, type: 'like' },
      { post_id: 4, author_id: 5, type: 'dislike' },
      { post_id: 5, author_id: 1, type: 'like' },
    ];

    for (const like of testLikes) {
      await Like.findOrCreate({
        where: { post_id: like.post_id, author_id: like.author_id },
        defaults: like,
      });
    }

    const testFavourites = [
      { user_id: 1, post_id: 2 },
      { user_id: 2, post_id: 3 },
      { user_id: 3, post_id: 4 },
      { user_id: 4, post_id: 5 },
      { user_id: 5, post_id: 1 },
    ];

    for (const favourite of testFavourites) {
      await Favourite.findOrCreate({
        where: { user_id: favourite.user_id, post_id: favourite.post_id },
        defaults: favourite,
      });
    }
  } catch (error) {
    console.error('Ошибка при добавлении тестовых данных:', error);
  }
};

module.exports = createDatabase;
