// filepath: /C:/Users/Rahsya Aditiya/OneDrive/Documents/travel_API/models/Category.js
const { DataTypes } = require('sequelize');
const db = require('../config/db');

const Category = db.define('Category', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    namacategory: {
        type: DataTypes.STRING,
        allowNull: false
    },
    gambarcategory: {
        type: DataTypes.STRING,
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
});

module.exports = Category;