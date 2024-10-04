// commentController.js

exports.getCommentById = (req, res) => {
    console.log(`Получение комментария с ID ${req.params.commentId}`);
    res.json({ message: `Комментарий с ID ${req.params.commentId}` });
};

exports.getLikesForComment = (req, res) => {
    console.log(`Получение лайков для комментария с ID ${req.params.commentId}`);
    res.json({ message: `Лайки для комментария с ID ${req.params.commentId}` });
};

exports.likeComment = (req, res) => {
    console.log(`Лайк для комментария с ID ${req.params.commentId}`);
    res.json({ message: `Комментарий с ID ${req.params.commentId} был лайкнут` });
};

exports.updateComment = (req, res) => {
    console.log(`Обновление комментария с ID ${req.params.commentId}`);
    res.json({ message: `Комментарий с ID ${req.params.commentId} обновлен` });
};

exports.deleteComment = (req, res) => {
    console.log(`Удаление комментария с ID ${req.params.commentId}`);
    res.json({ message: `Комментарий с ID ${req.params.commentId} удален` });
};

exports.deleteLike = (req, res) => {
    console.log(`Удаление лайка для комментария с ID ${req.params.commentId}`);
    res.json({ message: `Лайк для комментария с ID ${req.params.commentId} удален` });
};
