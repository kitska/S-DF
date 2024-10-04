const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

router.get('/', postController.getAllPosts);
router.get('/:postId', postController.getPostById);
router.get('/:postId/comments', postController.getCommentsForPost);
router.post('/:postId/comments', postController.createComment);
router.get('/:postId/categories', postController.getCategoriesForPost);
router.get('/:postId/like', postController.getLikesForPost);
router.post('/', postController.createPost);
router.post('/:postId/like', postController.likePost);
router.patch('/:postId', postController.updatePost);
router.delete('/:postId', postController.deletePost);
router.delete('/:postId/like', postController.deleteLike);

module.exports = router;