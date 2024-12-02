const { DataTypes } = require('sequelize');
const sequelize = require('../db/db').sequelize;
const bcrypt = require('bcrypt');

const User = sequelize.define(
	'User',
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		login: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
			set(value) {
				const hashedPassword = bcrypt.hashSync(value, 10);
				this.setDataValue('password', hashedPassword);
			},
		},
		full_name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		profile_picture: {
			type: DataTypes.STRING,
			defaultValue: 'assets/img/default.png',
		},
		rating: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
		},
		role: {
			type: DataTypes.ENUM('user', 'admin'),
			defaultValue: 'user',
		},
		created_at: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW,
		},
		email_confirmed: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
		email_confirmation_token: {
			type: DataTypes.STRING,
			allowNull: true,
		},
	},
	{
		tableName: 'users',
		timestamps: false,
	}
);

module.exports = User;
