const { DataTypes } = require('sequelize');
const sequelize = require('../db/db').sequelize;
const Post = require('./post');
const Category = require('./category');

const PostCategory = sequelize.define('PostCategory', {
    post_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Post,
            key: 'id',
        },
        onDelete: 'CASCADE',
        primaryKey: true,
    },
    category_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Category,
            key: 'id',
        },
        onDelete: 'CASCADE',
        primaryKey: true,
    },
}, {
    tableName: 'post_categories',
    timestamps: false,
});

// Устанавливаем ассоциации после определения всех моделей
Post.belongsToMany(Category, { through: PostCategory, foreignKey: 'post_id' });
Category.belongsToMany(Post, { through: PostCategory, foreignKey: 'category_id' });

module.exports = PostCategory;
