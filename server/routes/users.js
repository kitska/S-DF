const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken, isAdmin } = require('../middleware/authMW');

router.get('/', userController.getAllUsers);
router.get('/favorites', authenticateToken, userController.getUserFavorites);
router.get('/:userId', userController.getUserById);
router.get('/:userId/posts', userController.getUserPosts);
router.get('/:userId/liked-posts', userController.getUserLikedPosts);
router.post('/', authenticateToken, isAdmin, userController.createUser);
router.patch('/avatar', authenticateToken, userController.uploadAvatar);
router.patch('/:userId', authenticateToken, userController.updateUser);
router.delete('/:userId', authenticateToken, userController.deleteUser);

module.exports = router;
