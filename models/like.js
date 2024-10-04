const { DataTypes } = require('sequelize');
const sequelize = require('../db/db').sequelize;
const Post = require('./post');
const Comment = require('./comment');
const User = require('./user');

const Like = sequelize.define('Like', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    authorId: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    postId: {
        type: DataTypes.INTEGER,
        references: {
            model: Post,
            key: 'id',
        },
        onDelete: 'SET NULL',
    },
    commentId: {
        type: DataTypes.INTEGER,
        references: {
            model: Comment,
            key: 'id',
        },
        onDelete: 'SET NULL',
    },
    type: {
        type: DataTypes.ENUM('like', 'dislike'),
    },
    publishDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'likes',
    timestamps: false,
});

Like.belongsTo(Post, { foreignKey: 'postId' });
Like.belongsTo(Comment, { foreignKey: 'commentId' });
Like.belongsTo(User, { foreignKey: 'authorId' });

module.exports = Like;
