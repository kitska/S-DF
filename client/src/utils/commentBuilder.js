// utils/commentBuilder.js
export const buildCommentTree = comments => {
	const commentMap = {};

	// Создаем карту для быстрого доступа к комментариям по их ID
	comments.forEach(comment => {
		comment.replies = [];
		commentMap[comment.id] = comment;
	});

	const rootComments = [];

	comments.forEach(comment => {
		if (comment.comment_id) {
			// Если comment_id есть, это ответ, добавляем его в массив replies родительского комментария
			if (commentMap[comment.comment_id]) {
				commentMap[comment.comment_id].replies.push(comment);
			}
		} else {
			// Если comment_id нет, это корневой комментарий
			rootComments.push(comment);
		}
	});

	// Функция для сортировки комментариев по дате
	const sortCommentsByDate = commentsArray => {
		return commentsArray.sort((a, b) => new Date(a.publish_date) - new Date(b.publish_date));
	};

	// Сортируем корневые комментарии
	sortCommentsByDate(rootComments);

	// Сортируем ответы для каждого корневого комментария
	rootComments.forEach(comment => {
		if (comment.replies.length > 0) {
			comment.replies = sortCommentsByDate(comment.replies);
		}
	});

	return rootComments;
};
