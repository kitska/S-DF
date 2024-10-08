const { DataTypes } = require('sequelize');
const sequelize = require('../db/db').sequelize;
const Post = require('./post');
const User = require('./user');

const Comment = sequelize.define('Comment', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    post_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Post,
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    author_id: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    publish_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
}, {
    tableName: 'comments',
    timestamps: false,
});

Comment.belongsTo(Post, { foreignKey: 'post_id' });
Comment.belongsTo(User, { foreignKey: 'author_id' });

module.exports = Comment;
