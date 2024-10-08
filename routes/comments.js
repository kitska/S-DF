const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { authenticateToken, isAdmin } = require('../middleware/authMW');

router.get('/:commentId', commentController.getCommentById);
router.get('/:commentId/like', commentController.getLikesForComment);
router.post('/:commentId/like', authenticateToken, commentController.likeComment);
router.patch('/:commentId', authenticateToken, commentController.updateComment);
router.delete('/:commentId', authenticateToken, commentController.deleteComment);
router.delete('/:commentId/like', authenticateToken, commentController.deleteLike);

module.exports = router;