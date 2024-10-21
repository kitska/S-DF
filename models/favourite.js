const { DataTypes } = require('sequelize');
const sequelize = require('../db/db').sequelize;
const User = require('./user');
const Post = require('./post');

const Favourite = sequelize.define(
	'Favourite',
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
		tableName: 'favourites',
	}
);

User.belongsToMany(Post, { through: Favourite, foreignKey: 'user_id' });
Post.belongsToMany(User, { through: Favourite, foreignKey: 'post_id' });

Favourite.belongsTo(User, { foreignKey: 'user_id' });
Favourite.belongsTo(Post, { foreignKey: 'post_id' });

module.exports = Favourite;
