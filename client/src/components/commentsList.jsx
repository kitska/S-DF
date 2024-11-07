import React, { useEffect, useState } from 'react';
import Comment from './UI/comment';
import PostHandler from '../api/postHandler';

const CommentsList = ({ postId }) => {
	const [comments, setComments] = useState([]);

	const buildCommentTree = comments => {
		const commentMap = {};

		// Сначала создадим мапу комментариев по их ID
		comments.forEach(comment => {
			commentMap[comment.id] = { ...comment, replies: [] };
		});

		// Теперь распределим комментарии и их ответы
		const rootComments = [];
		comments.forEach(comment => {
			if (comment.comment_id === null) {
				// Это корневой комментарий
				rootComments.push(commentMap[comment.id]);
			} else {
				// Это ответ, добавляем в массив replies родительского комментария
				commentMap[comment.comment_id].replies.push(commentMap[comment.id]);
			}
		});

		return rootComments;
	};

	useEffect(() => {
		const fetchComments = async () => {
			try {
				const response = await PostHandler.getCommentsForPost(postId);
				const commentTree = buildCommentTree(response.data.comments);
				setComments(commentTree);
			} catch (error) {
				console.error('Ошибка при загрузке комментариев:', error);
			}
		};

		fetchComments();
	}, [postId]);

	return (
		<div>
			{comments.map(comment => (
				<Comment key={comment.id} comment={comment} postId={postId} setComments={setComments} />
			))}
		</div>
	);
};

export default CommentsList;
