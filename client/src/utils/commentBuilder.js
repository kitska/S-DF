export const buildCommentTree = comments => {
	const commentMap = new Map();
	const rootComments = [];

	comments.forEach(comment => {
		// Для каждого комментария создаем ключ для map
		comment.replies = []; // Изначально у нас пустой массив для ответов
		commentMap.set(comment.id, comment);

		// Строим дерево (если у комментария есть parent_id, то это ответ на другой комментарий)
		if (comment.comment_id) {
			const parentComment = commentMap.get(comment.comment_id);
			if (parentComment) {
				parentComment.replies.push(comment);
			}
		} else {
			// Если комментарий не является ответом, добавляем его в корень
			rootComments.push(comment);
		}
	});

	return rootComments;
};
