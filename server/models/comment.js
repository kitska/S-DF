const { DataTypes } = require('sequelize');
const sequelize = require('../db/db').sequelize;
const Post = require('./post');
const User = require('./user');

const Comment = sequelize.define(
	'Comment',
	{
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
		comment_id: {
			type: DataTypes.INTEGER,
			allowNull: true,
			references: {
				model: 'comments',
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
		status: {
			type: DataTypes.ENUM('active', 'inactive'),
			defaultValue: 'active',
		},
	},
	{
		tableName: 'comments',
		timestamps: false,
	}
);


Comment.belongsTo(Post, { foreignKey: 'post_id' });
Comment.belongsTo(User, { foreignKey: 'author_id' });
Comment.belongsTo(Comment, { as: 'ParentComment', foreignKey: 'comment_id' });
Comment.hasMany(Comment, { as: 'Replies', foreignKey: 'comment_id' });

module.exports = Comment;
