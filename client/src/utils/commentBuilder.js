export const buildCommentTree = comments => {
	const commentMap = {};

	comments.forEach(comment => {
		comment.replies = [];
		commentMap[comment.id] = comment;
	});

	const rootComments = [];

	comments.forEach(comment => {
		if (comment.comment_id) {
			if (commentMap[comment.comment_id]) {
				commentMap[comment.comment_id].replies.push(comment);
			}
		} else {
			rootComments.push(comment);
		}
	});

	const sortCommentsByDate = commentsArray => {
		return commentsArray.sort((a, b) => new Date(a.publish_date) - new Date(b.publish_date));
	};

	sortCommentsByDate(rootComments);

	rootComments.forEach(comment => {
		if (comment.replies.length > 0) {
			comment.replies = sortCommentsByDate(comment.replies);
		}
	});

	return rootComments;
};
