const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { authenticateToken, isAdmin } = require('../middleware/authMW');

router.get('/', postController.getAllPosts);
router.get('/:post_id', postController.getPostById);
router.get('/:post_id/comments', postController.getCommentsForPost);
router.post('/:post_id/comments', authenticateToken, postController.createComment);
router.get('/:post_id/categories', postController.getCategoriesForPost);
router.get('/:post_id/like', postController.getLikesForPost);
router.post('/', authenticateToken, postController.createPost);
router.post('/:post_id/like', authenticateToken, postController.likePost);
router.patch('/:post_id', authenticateToken, postController.updatePost);
router.delete('/:post_id', authenticateToken, postController.deletePost);
router.delete('/:post_id/like', authenticateToken, postController.deleteLike);

module.exports = router;