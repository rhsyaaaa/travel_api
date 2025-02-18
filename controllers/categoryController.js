// filepath: /C:/Users/Rahsya Aditiya/OneDrive/Documents/travel_API/controllers/categoryController.js
const { Category } = require('../models/category');

// Create a new category
const createCategory = async (req, res) => {
    try {
        const { namacategory, gambarcategory } = req.body;
        const newCategory = await Category.create({ namacategory, gambarcategory });
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all categories
const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.findAll();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a single category by ID
const getCategoryById = async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id);
        if (category) {
            res.status(200).json(category);
        } else {
            res.status(404).json({ error: 'Category not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a category by ID
const updateCategoryById = async (req, res) => {
    try {
        const { namacategory, gambarcategory } = req.body;
        const category = await Category.findByPk(req.params.id);
        if (category) {
            category.namacategory = namacategory;
            category.gambarcategory = gambarcategory;
            await category.save();
            res.status(200).json(category);
        } else {
            res.status(404).json({ error: 'Category not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a category by ID
const deleteCategoryById = async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id);
        if (category) {
            await category.destroy();
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Category not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategoryById,
    deleteCategoryById
};