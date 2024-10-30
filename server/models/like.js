const { DataTypes } = require('sequelize');
const sequelize = require('../db/db').sequelize;
const Post = require('./post');
const Comment = require('./comment');
const User = require('./user');

const Like = sequelize.define(
	'Like',
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		author_id: {
			type: DataTypes.INTEGER,
			references: {
				model: User,
				key: 'id',
			},
			onDelete: 'CASCADE',
		},
		post_id: {
			type: DataTypes.INTEGER,
			references: {
				model: Post,
				key: 'id',
			},
			onDelete: 'CASCADE',
		},
		comment_id: {
			type: DataTypes.INTEGER,
			references: {
				model: Comment,
				key: 'id',
			},
			onDelete: 'CASCADE',
		},
		type: {
			type: DataTypes.ENUM('like', 'dislike'),
		},
		publish_date: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW,
		},
	},
	{
		tableName: 'likes',
		timestamps: false,
	}
);

Like.belongsTo(Post, { foreignKey: 'post_id' });
Like.belongsTo(Comment, { foreignKey: 'comment_id' });
Like.belongsTo(User, { foreignKey: 'author_id' });

module.exports = Like;
