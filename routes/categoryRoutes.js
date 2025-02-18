// filepath: /C:/Users/Rahsya Aditiya/OneDrive/Documents/travel_API/routes/categoryRoutes.js
const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategoryById,
    deleteCategoryById
} = require('../controllers/categoryController');

router.post('/', authenticateToken, createCategory);
router.get('/', authenticateToken, getAllCategories);
router.get('/:id', authenticateToken, getCategoryById);
router.put('/:id', authenticateToken, updateCategoryById);
router.delete('/:id', authenticateToken, deleteCategoryById);

module.exports = router;