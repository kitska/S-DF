require('dotenv').config();
const mysql = require('mysql2/promise');
const { sequelize } = require('./db');
const Post = require('../models/post');
const Category = require('../models/category');
const PostCategory = require('../models/post_category');
const Comment = require('../models/comment');
const User = require('../models/user');
const Like = require('../models/like');

const setAssociations = () => {
  Post.belongsToMany(Category, { through: PostCategory, foreignKey: 'post_id' });
  Category.belongsToMany(Post, { through: PostCategory, foreignKey: 'category_id' });

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

    setAssociations();

    await sequelize.sync({ force: false });
    console.log('Таблицы успешно созданы на основе моделей');

    return sequelize;
  } catch (error) {
    console.error('Ошибка при создании базы данных или таблиц:', error);
    process.exit(1);
  }
};

module.exports = createDatabase;
