// postController.js

exports.getAllPosts = (req, res) => {
    console.log('Получение всех постов');
    res.json({ message: 'Список всех постов' });
};

exports.getPostById = (req, res) => {
    console.log(`Получение поста с ID ${req.params.postId}`);
    res.json({ message: `Пост с ID ${req.params.postId}` });
};

exports.getCommentsForPost = (req, res) => {
    console.log(`Получение комментариев для поста с ID ${req.params.postId}`);
    res.json({ message: `Комментарии для поста с ID ${req.params.postId}` });
};

exports.createComment = (req, res) => {
    console.log(`Создание комментария для поста с ID ${req.params.postId}`);
    res.json({ message: `Комментарий для поста с ID ${req.params.postId} создан` });
};

exports.getCategoriesForPost = (req, res) => {
    console.log(`Получение категорий для поста с ID ${req.params.postId}`);
    res.json({ message: `Категории для поста с ID ${req.params.postId}` });
};

exports.getLikesForPost = (req, res) => {
    console.log(`Получение лайков для поста с ID ${req.params.postId}`);
    res.json({ message: `Лайки для поста с ID ${req.params.postId}` });
};

exports.createPost = (req, res) => {
    console.log('Создание нового поста');
    res.json({ message: 'Пост создан' });
};

exports.likePost = (req, res) => {
    console.log(`Лайк для поста с ID ${req.params.postId}`);
    res.json({ message: `Пост с ID ${req.params.postId} был лайкнут` });
};

exports.updatePost = (req, res) => {
    console.log(`Обновление поста с ID ${req.params.postId}`);
    res.json({ message: `Пост с ID ${req.params.postId} обновлен` });
};

exports.deletePost = (req, res) => {
    console.log(`Удаление поста с ID ${req.params.postId}`);
    res.json({ message: `Пост с ID ${req.params.postId} удален` });
};

exports.deleteLike = (req, res) => {
    console.log(`Удаление лайка для поста с ID ${req.params.postId}`);
    res.json({ message: `Лайк для поста с ID ${req.params.postId} удален` });
};
