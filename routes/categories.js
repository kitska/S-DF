const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { authenticateToken, isAdmin } = require('../middleware/authMW');

router.get('/', categoryController.getAllCategories);
router.get('/:categoryId', categoryController.getCategoryById);
router.get('/:categoryId/posts', categoryController.getPostsForCategory);
router.post('/', authenticateToken, categoryController.createCategory);
router.patch('/:categoryId', authenticateToken, isAdmin, categoryController.updateCategory);
router.delete('/:categoryId', authenticateToken, isAdmin, categoryController.deleteCategory);

module.exports = router;