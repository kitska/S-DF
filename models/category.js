const { DataTypes } = require('sequelize');
const sequelize = require('../db/db').sequelize;

const Category = sequelize.define('Category', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
    },
}, {
    tableName: 'categories',
    timestamps: false,
});

module.exports = Category;
