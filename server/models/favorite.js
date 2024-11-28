const { DataTypes } = require('sequelize');
const sequelize = require('../db/db').sequelize;
const User = require('./user');
const Post = require('./post');

const favorite = sequelize.define(
	'favorite',
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		user_id: {
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
	},
	{
		timestamps: false,
		tableName: 'favorites',
	}
);

User.belongsToMany(Post, { through: favorite, foreignKey: 'user_id' });
Post.belongsToMany(User, { through: favorite, foreignKey: 'post_id' });

favorite.belongsTo(User, { foreignKey: 'user_id' });
favorite.belongsTo(Post, { foreignKey: 'post_id' });

module.exports = favorite;
