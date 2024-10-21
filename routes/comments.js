const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { authenticateToken, isAdmin } = require('../middleware/authMW');

router.get('/:comment_id', commentController.getCommentById);
router.get('/:comment_id/like', commentController.getLikesForComment);
router.post('/:comment_id/like', authenticateToken, commentController.likeComment);
router.patch('/:comment_id', authenticateToken, commentController.updateComment);
router.delete('/:comment_id', authenticateToken, commentController.deleteComment);
router.delete('/:comment_id/like', authenticateToken, commentController.deleteLike);

module.exports = router;
