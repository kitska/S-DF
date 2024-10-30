const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { authenticateToken, isAdmin } = require('../middleware/authMW');

router.get('/', categoryController.getAllCategories);
router.get('/:category_id', categoryController.getCategoryById);
router.get('/:category_id/posts', categoryController.getPostsForCategory);
router.post('/', authenticateToken, categoryController.createCategory);
router.patch('/:category_id', authenticateToken, isAdmin, categoryController.updateCategory);
router.delete('/:category_id', authenticateToken, isAdmin, categoryController.deleteCategory);

module.exports = router;
