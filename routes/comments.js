const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

router.get('/:commentId', commentController.getCommentById);
router.get('/:commentId/like', commentController.getLikesForComment);
router.post('/:commentId/like', commentController.likeComment);
router.patch('/:commentId', commentController.updateComment);
router.delete('/:commentId', commentController.deleteComment);
router.delete('/:commentId/like', commentController.deleteLike);

module.exports = router;